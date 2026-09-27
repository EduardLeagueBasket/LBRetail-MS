import { Inject, Injectable } from '@nestjs/common';
import { PRODUCT_REPOSITORY } from '../../domain/constants/injection-tokens';
import type { ProductEntity } from '../../domain/entities/product.entity';
import type { CreateProductDto } from '../dto/create.dto';
import type { ListProductsDto } from '../dto/list-products.dto';
import type { UpdateProductDto } from '../dto/update.dto';
import type { ProductInterfaceRepository } from '../ports/product.interface-repository';

@Injectable()
export class ProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly repo: ProductInterfaceRepository,
  ) {}

  findAll(filters: ListProductsDto): Promise<ProductEntity[]> {
    return this.repo.findAll(filters);
  }

  findById(id: string): Promise<ProductEntity | null> {
    return this.repo.findById(id);
  }

  create(dto: CreateProductDto): Promise<ProductEntity> {
    return this.repo.create(dto);
  }

  update(id: string, dto: UpdateProductDto): Promise<ProductEntity> {
    return this.repo.update(id, dto);
  }

  deactivate(id: string): Promise<ProductEntity> {
    return this.repo.deactivate(id);
  }
}
