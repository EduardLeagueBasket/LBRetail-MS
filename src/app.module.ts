import { Module } from '@nestjs/common';
import { NatsModule } from './nats/nats.module';
import { ProductsModule } from './products/presentation/products.module';
import { CartModule } from './cart/presentation/cart.module';
import { OrdersModule } from './orders/presentation/orders.module';
import { CategoriesModule } from './categories/presentation/categories.module';

@Module({
  imports: [
    NatsModule,
    ProductsModule,
    CartModule,
    OrdersModule,
    CategoriesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
