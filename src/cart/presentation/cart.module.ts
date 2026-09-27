import { Module } from '@nestjs/common';
import { CART_REPOSITORY } from '../domain/constants/injection-tokens';
import { CartUseCase } from '../application/use-cases/cart.use-case';
import { CartDataSource } from '../infrastructure/data-sources/cart.data-source';
import { CartController } from './controllers/cart.controller';

@Module({
  controllers: [CartController],
  providers: [
    CartUseCase,
    {
      provide: CART_REPOSITORY,
      useClass: CartDataSource,
    },
  ],
})
export class CartModule {}
