import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import type { Prisma } from '@prisma/client';
import type { Variante } from '@prisma/client';
import { RetailPrismaClient } from '../../../shared/prisma/prisma-client';
import type { AddCartItemDto } from '../../application/dto/add-cart-item.dto';
import type { GetCartDto } from '../../application/dto/get-cart.dto';
import type { ListCartsDto } from '../../application/dto/list-carts.dto';
import type { RemoveCartItemDto } from '../../application/dto/remove-cart-item.dto';
import type { UpdateCartItemDto } from '../../application/dto/update-cart-item.dto';
import type { CartInterfaceRepository } from '../../application/ports/cart.interface-repository';
import type { CartEntity } from '../../domain/entities/cart.entity';

const cartInclude = { items: true } satisfies Prisma.CarritoInclude;

@Injectable()
export class CartDataSource
  extends RetailPrismaClient
  implements CartInterfaceRepository
{
  async getOrCreate(dto: GetCartDto): Promise<CartEntity> {
    const existing = await this.carrito.findFirst({
      where: {
        sessionId: dto.sessionId,
        teamId: dto.teamId,
        teamType: dto.teamType,
        ...(dto.usuarioId ? { usuarioId: dto.usuarioId } : {}),
      },
      include: cartInclude,
    });

    if (existing) {
      return existing;
    }

    return this.carrito.create({
      data: {
        sessionId: dto.sessionId,
        usuarioId: dto.usuarioId,
        teamId: dto.teamId,
        teamType: dto.teamType,
        total: 0,
      },
      include: cartInclude,
    });
  }

  async list(filters: ListCartsDto): Promise<CartEntity[]> {
    const where: Prisma.CarritoWhereInput = {};

    if (filters.teamId) where.teamId = filters.teamId;
    if (filters.teamType) where.teamType = filters.teamType;
    if (filters.usuarioId) where.usuarioId = filters.usuarioId;
    if (filters.sessionId) where.sessionId = filters.sessionId;

    return this.carrito.findMany({
      where,
      include: cartInclude,
      orderBy: { updatedAt: 'desc' },
    });
  }

  async addItem(dto: AddCartItemDto): Promise<CartEntity> {
    const cart = await this.getOrCreate({
      sessionId: dto.sessionId,
      usuarioId: dto.usuarioId,
      teamId: dto.teamId,
      teamType: dto.teamType,
    });

    const product = await this.producto.findUnique({
      where: { id: dto.productoId },
    });

    if (!product || !product.activo) {
      throw new RpcException({
        status: 'error',
        message: 'Producto no disponible',
      });
    }

    if (product.teamId !== dto.teamId || product.teamType !== dto.teamType) {
      throw new RpcException({
        status: 'error',
        message: 'El producto no pertenece a este equipo',
      });
    }

    const variante = this.findVariant(product.variantes, dto.varianteSku);
    if (!variante || !variante.activo) {
      throw new RpcException({
        status: 'error',
        message: 'Variante no encontrada',
      });
    }

    if (variante.stock < dto.cantidad) {
      throw new RpcException({
        status: 'error',
        message: 'Stock insuficiente',
      });
    }

    const imagen =
      product.imagenes.find((img) => img.principal)?.url ??
      product.imagenes[0]?.url ??
      '';

    const existingItem = await this.carritoItem.findFirst({
      where: {
        carritoId: cart.id,
        productoId: dto.productoId,
        varianteSku: dto.varianteSku,
      },
    });

    if (existingItem) {
      const nuevaCantidad = existingItem.cantidad + dto.cantidad;
      if (variante.stock < nuevaCantidad) {
        throw new RpcException({
          status: 'error',
          message: 'Stock insuficiente',
        });
      }

      await this.carritoItem.update({
        where: { id: existingItem.id },
        data: { cantidad: nuevaCantidad, precio: variante.precio },
      });
    } else {
      await this.carritoItem.create({
        data: {
          carritoId: cart.id,
          productoId: dto.productoId,
          varianteSku: dto.varianteSku,
          nombre: product.nombre,
          imagen,
          atributos: variante.atributos as Prisma.InputJsonValue,
          precio: variante.precio,
          cantidad: dto.cantidad,
        },
      });
    }

    return this.refreshCartTotal(cart.id);
  }

  async updateItem(dto: UpdateCartItemDto): Promise<CartEntity> {
    const item = await this.carritoItem.findUnique({
      where: { id: dto.itemId },
      include: { producto: true },
    });

    if (!item || item.carritoId !== dto.carritoId) {
      throw new RpcException({
        status: 'error',
        message: 'Ítem de carrito no encontrado',
      });
    }

    const variante = this.findVariant(
      item.producto.variantes,
      item.varianteSku,
    );
    if (!variante || variante.stock < dto.cantidad) {
      throw new RpcException({
        status: 'error',
        message: 'Stock insuficiente',
      });
    }

    await this.carritoItem.update({
      where: { id: dto.itemId },
      data: { cantidad: dto.cantidad },
    });

    return this.refreshCartTotal(dto.carritoId);
  }

  async removeItem(dto: RemoveCartItemDto): Promise<CartEntity> {
    const item = await this.carritoItem.findUnique({
      where: { id: dto.itemId },
    });

    if (!item || item.carritoId !== dto.carritoId) {
      throw new RpcException({
        status: 'error',
        message: 'Ítem de carrito no encontrado',
      });
    }

    await this.carritoItem.delete({ where: { id: dto.itemId } });
    return this.refreshCartTotal(dto.carritoId);
  }

  async clear(cartId: string): Promise<CartEntity> {
    await this.carritoItem.deleteMany({ where: { carritoId: cartId } });
    return this.refreshCartTotal(cartId);
  }

  private findVariant(
    variantes: Variante[],
    sku: string,
  ): Variante | undefined {
    return variantes.find((v) => v.sku === sku);
  }

  private async refreshCartTotal(cartId: string): Promise<CartEntity> {
    const items = await this.carritoItem.findMany({
      where: { carritoId: cartId },
    });
    const total = items.reduce(
      (sum, item) => sum + item.precio * item.cantidad,
      0,
    );

    return this.carrito.update({
      where: { id: cartId },
      data: { total },
      include: cartInclude,
    });
  }
}
