import { Module } from '@nestjs/common';
import { PRODUCT_REPOSITORY } from '../domain/constants/injection-tokens';
import { ProductUseCase } from '../application/use-cases/product.use-case';
import { ProductDataSource } from '../infrastructure/data-sources/product.data-source';
import { ProductsController } from './controllers/products.controller';

@Module({
  controllers: [ProductsController],
  providers: [
    ProductUseCase,
    {
      provide: PRODUCT_REPOSITORY,
      useClass: ProductDataSource,
    },
  ],
})
export class ProductsModule {}
