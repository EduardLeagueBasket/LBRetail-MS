import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import type { Prisma } from '@prisma/client';
import { RetailPrismaClient } from '../../../shared/prisma/prisma-client';
import type { CreateOrderDto } from '../../application/dto/create-order.dto';
import type { ListOrdersDto } from '../../application/dto/list-orders.dto';
import type { UpdateOrderStatusDto } from '../../application/dto/update-order-status.dto';
import type { OrderInterfaceRepository } from '../../application/ports/order.interface-repository';
import type { OrderEntity } from '../../domain/entities/order.entity';

const orderInclude = { items: true } satisfies Prisma.PedidoInclude;

@Injectable()
export class OrderDataSource
  extends RetailPrismaClient
  implements OrderInterfaceRepository
{
  async findAll(filters: ListOrdersDto): Promise<OrderEntity[]> {
    const where: Prisma.PedidoWhereInput = {};

    if (filters.teamId) where.teamId = filters.teamId;
    if (filters.teamType) where.teamType = filters.teamType;
    if (filters.usuarioId) where.usuarioId = filters.usuarioId;
    if (filters.estado) where.estado = filters.estado;

    return this.pedido.findMany({
      where,
      include: orderInclude,
      orderBy: { creadoEn: 'desc' },
    });
  }

  async findById(id: string): Promise<OrderEntity | null> {
    return this.pedido.findUnique({
      where: { id },
      include: orderInclude,
    });
  }

  async createFromCart(dto: CreateOrderDto): Promise<OrderEntity> {
    const cart = await this.carrito.findFirst({
      where: {
        sessionId: dto.sessionId,
        teamId: dto.teamId,
        teamType: dto.teamType,
        usuarioId: dto.usuarioId,
      },
      include: { items: true },
    });

    if (!cart || cart.items.length === 0) {
      throw new RpcException({
        status: 'error',
        message: 'El carrito está vacío',
      });
    }

    for (const item of cart.items) {
      const product = await this.producto.findUnique({
        where: { id: item.productoId },
      });
      const variante = product?.variantes.find(
        (v) => v.sku === item.varianteSku,
      );
      if (
        !product?.activo ||
        !variante?.activo ||
        variante.stock < item.cantidad
      ) {
        throw new RpcException({
          status: 'error',
          message: `Stock insuficiente para ${item.nombre}`,
        });
      }
    }

    const subtotal = cart.items.reduce(
      (sum, item) => sum + item.precio * item.cantidad,
      0,
    );
    const descuento = 0;
    const total = subtotal - descuento;
    const numero = await this.generateOrderNumber();

    const order = await this.pedido.create({
      data: {
        numero,
        usuarioId: dto.usuarioId,
        teamId: dto.teamId,
        teamType: dto.teamType,
        subtotal,
        descuento,
        total,
        items: {
          create: cart.items.map((item) => ({
            productoId: item.productoId,
            varianteSku: item.varianteSku,
            nombre: item.nombre,
            imagen: item.imagen,
            atributos: item.atributos as Prisma.InputJsonValue,
            precio: item.precio,
            cantidad: item.cantidad,
          })),
        },
      },
      include: orderInclude,
    });

    for (const item of cart.items) {
      const product = await this.producto.findUnique({
        where: { id: item.productoId },
      });
      if (!product) continue;

      const variantes = product.variantes.map((v) => ({
        sku: v.sku,
        atributos: v.atributos as Prisma.InputJsonValue,
        precio: v.precio,
        stock: v.sku === item.varianteSku ? v.stock - item.cantidad : v.stock,
        activo: v.activo,
      }));

      await this.producto.update({
        where: { id: product.id },
        data: { variantes },
      });
    }

    await this.carritoItem.deleteMany({ where: { carritoId: cart.id } });
    await this.carrito.update({
      where: { id: cart.id },
      data: { total: 0 },
    });

    return order;
  }

  async updateStatus(dto: UpdateOrderStatusDto): Promise<OrderEntity> {
    const existing = await this.findById(dto.id);
    if (!existing) {
      throw new RpcException({
        status: 'error',
        message: 'Pedido no encontrado',
      });
    }

    return this.pedido.update({
      where: { id: dto.id },
      data: { estado: dto.estado },
      include: orderInclude,
    });
  }

  private async generateOrderNumber(): Promise<string> {
    const prefix = `ORD-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}`;
    const count = await this.pedido.count({
      where: { numero: { startsWith: prefix } },
    });
    return `${prefix}-${String(count + 1).padStart(4, '0')}`;
  }
}
