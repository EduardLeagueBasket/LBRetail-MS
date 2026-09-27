import type { CreateProductDto } from '../dto/create.dto';
import type { ListProductsDto } from '../dto/list-products.dto';
import type { UpdateProductDto } from '../dto/update.dto';
import type { ProductEntity } from '../../domain/entities/product.entity';

export interface ProductInterfaceRepository {
  findAll(filters: ListProductsDto): Promise<ProductEntity[]>;
  findById(id: string): Promise<ProductEntity | null>;
  create(dto: CreateProductDto): Promise<ProductEntity>;
  update(id: string, dto: UpdateProductDto): Promise<ProductEntity>;
  deactivate(id: string): Promise<ProductEntity>;
}
