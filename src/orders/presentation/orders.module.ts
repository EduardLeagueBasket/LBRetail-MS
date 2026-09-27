import { Module } from '@nestjs/common';
import { ORDER_REPOSITORY } from '../domain/constants/injection-tokens';
import { OrderUseCase } from '../application/use-cases/order.use-case';
import { OrderDataSource } from '../infrastructure/data-sources/order.data-source';
import { OrdersController } from './controllers/orders.controller';

@Module({
  controllers: [OrdersController],
  providers: [
    OrderUseCase,
    {
      provide: ORDER_REPOSITORY,
      useClass: OrderDataSource,
    },
  ],
})
export class OrdersModule {}
