import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { IdDto } from '../../../shared/dto/id.dto';
import { CreateProductDto } from '../../application/dto/create.dto';
import { ListProductsDto } from '../../application/dto/list-products.dto';
import { ProductUseCase } from '../../application/use-cases/product.use-case';
import type { ProductEntity } from '../../domain/entities/product.entity';
import { UpdateProductMessageDto } from '../dto/update-product-message.dto';

@Controller()
export class ProductsController {
  constructor(private readonly useCase: ProductUseCase) {}

  @MessagePattern('retail.create-product')
  create(@Payload() dto: CreateProductDto): Promise<ProductEntity> {
    return this.useCase.create(dto);
  }

  @MessagePattern('retail.list-products')
  findAll(@Payload() filters: ListProductsDto): Promise<ProductEntity[]> {
    return this.useCase.findAll(filters);
  }

  @MessagePattern('retail.get-product')
  findById(@Payload() dto: IdDto): Promise<ProductEntity | null> {
    return this.useCase.findById(dto.id);
  }

  @MessagePattern('retail.update-product')
  update(@Payload() payload: UpdateProductMessageDto): Promise<ProductEntity> {
    return this.useCase.update(payload.id, payload.data);
  }

  @MessagePattern('retail.deactivate-product')
  deactivate(@Payload() dto: IdDto): Promise<ProductEntity> {
    return this.useCase.deactivate(dto.id);
  }
}
