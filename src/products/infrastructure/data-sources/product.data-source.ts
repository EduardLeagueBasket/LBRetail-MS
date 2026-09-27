import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import type { Prisma } from '@prisma/client';
import { RetailPrismaClient } from '../../../shared/prisma/prisma-client';
import { toSlug } from '../../../shared/utils/slug.util';
import type { CreateProductDto } from '../../application/dto/create.dto';
import type { ListProductsDto } from '../../application/dto/list-products.dto';
import type { UpdateProductDto } from '../../application/dto/update.dto';
import type { ProductInterfaceRepository } from '../../application/ports/product.interface-repository';
import type { ProductEntity } from '../../domain/entities/product.entity';

@Injectable()
export class ProductDataSource
  extends RetailPrismaClient
  implements ProductInterfaceRepository
{
  async findAll(filters: ListProductsDto): Promise<ProductEntity[]> {
    console.log('filters @@@@', filters);
    const where: Prisma.ProductoWhereInput = {};

    if (filters.teamId) where.teamId = filters.teamId;
    if (filters.teamType) where.teamType = filters.teamType;

    if (filters.categoria) {
      where.categoria = filters.categoria;
    }

    if (filters.activo !== undefined) {
      where.activo = filters.activo;
    }

    return this.producto.findMany({
      where,
      orderBy: { creadoEn: 'desc' },
    });
  }

  async findById(id: string): Promise<ProductEntity | null> {
    return this.producto.findUnique({ where: { id } });
  }

  async create(dto: CreateProductDto): Promise<ProductEntity> {
    const baseSlug = dto.slug?.trim() || toSlug(dto.nombre);
    const slug = await this.ensureUniqueSlug(baseSlug);

    return this.producto.create({
      data: {
        teamId: dto.teamId,
        teamType: dto.teamType,
        nombre: dto.nombre,
        slug,
        categoria: dto.categoria,
        descripcion: dto.descripcion,
        marca: dto.marca,
        imagenes: dto.imagenes ?? [],
        variantes: dto.variantes.map((v) => ({
          ...v,
          atributos: v.atributos as Prisma.InputJsonValue,
        })),
        atributosDisponibles: dto.atributosDisponibles ?? [],
        descuento: dto.descuento,
        precioOriginal: dto.precioOriginal,
        tags: dto.tags ?? [],
        creadoPorId: dto.creadoPorId,
      },
    });
  }

  async update(id: string, dto: UpdateProductDto): Promise<ProductEntity> {
    const existing = await this.findById(id);
    if (!existing) {
      throw new RpcException({
        status: 'error',
        message: 'Producto no encontrado',
      });
    }

    let slug: string | undefined;
    if (dto.slug) {
      slug =
        dto.slug === existing.slug
          ? dto.slug
          : await this.ensureUniqueSlug(dto.slug, id);
    } else if (dto.nombre && dto.nombre !== existing.nombre) {
      slug = await this.ensureUniqueSlug(toSlug(dto.nombre), id);
    }

    return this.producto.update({
      where: { id },
      data: {
        teamId: dto.teamId,
        teamType: dto.teamType,
        nombre: dto.nombre,
        slug,
        categoria: dto.categoria,
        descripcion: dto.descripcion,
        marca: dto.marca,
        imagenes: dto.imagenes,
        variantes: dto.variantes
          ? dto.variantes.map((v) => ({
              ...v,
              atributos: v.atributos as Prisma.InputJsonValue,
            }))
          : undefined,
        atributosDisponibles: dto.atributosDisponibles,
        descuento: dto.descuento,
        precioOriginal: dto.precioOriginal,
        tags: dto.tags,
      },
    });
  }

  async deactivate(id: string): Promise<ProductEntity> {
    const existing = await this.findById(id);
    if (!existing) {
      throw new RpcException({
        status: 'error',
        message: 'Producto no encontrado',
      });
    }

    return this.producto.update({
      where: { id },
      data: { activo: false },
    });
  }

  private async ensureUniqueSlug(
    baseSlug: string,
    excludeId?: string,
  ): Promise<string> {
    let slug = baseSlug;
    let suffix = 1;

    while (true) {
      const found = await this.producto.findUnique({ where: { slug } });
      if (!found || found.id === excludeId) {
        return slug;
      }
      slug = `${baseSlug}-${suffix}`;
      suffix += 1;
    }
  }
}
