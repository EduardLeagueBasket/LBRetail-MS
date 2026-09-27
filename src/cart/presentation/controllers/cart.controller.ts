import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { IdDto } from '../../../shared/dto/id.dto';
import { AddCartItemDto } from '../../application/dto/add-cart-item.dto';
import { GetCartDto } from '../../application/dto/get-cart.dto';
import { ListCartsDto } from '../../application/dto/list-carts.dto';
import { RemoveCartItemDto } from '../../application/dto/remove-cart-item.dto';
import { UpdateCartItemDto } from '../../application/dto/update-cart-item.dto';
import { CartUseCase } from '../../application/use-cases/cart.use-case';
import type { CartEntity } from '../../domain/entities/cart.entity';

@Controller()
export class CartController {
  constructor(private readonly useCase: CartUseCase) {}

  @MessagePattern('retail.get-cart')
  getCart(@Payload() dto: GetCartDto): Promise<CartEntity> {
    return this.useCase.getOrCreate(dto);
  }

  @MessagePattern('retail.list-carts')
  list(@Payload() filters: ListCartsDto): Promise<CartEntity[]> {
    return this.useCase.list(filters);
  }

  @MessagePattern('retail.add-cart-item')
  addItem(@Payload() dto: AddCartItemDto): Promise<CartEntity> {
    return this.useCase.addItem(dto);
  }

  @MessagePattern('retail.update-cart-item')
  updateItem(@Payload() dto: UpdateCartItemDto): Promise<CartEntity> {
    return this.useCase.updateItem(dto);
  }

  @MessagePattern('retail.remove-cart-item')
  removeItem(@Payload() dto: RemoveCartItemDto): Promise<CartEntity> {
    return this.useCase.removeItem(dto);
  }

  @MessagePattern('retail.clear-cart')
  clear(@Payload() dto: IdDto): Promise<CartEntity> {
    return this.useCase.clear(dto);
  }
}
