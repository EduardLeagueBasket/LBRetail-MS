import { Inject, Injectable } from '@nestjs/common';
import { CART_REPOSITORY } from '../../domain/constants/injection-tokens';
import type { CartEntity } from '../../domain/entities/cart.entity';
import type { AddCartItemDto } from '../dto/add-cart-item.dto';
import type { GetCartDto } from '../dto/get-cart.dto';
import type { ListCartsDto } from '../dto/list-carts.dto';
import type { RemoveCartItemDto } from '../dto/remove-cart-item.dto';
import type { UpdateCartItemDto } from '../dto/update-cart-item.dto';
import type { CartInterfaceRepository } from '../ports/cart.interface-repository';
import { IdDto } from '../../../shared/dto/id.dto';

@Injectable()
export class CartUseCase {
  constructor(
    @Inject(CART_REPOSITORY)
    private readonly repo: CartInterfaceRepository,
  ) {}

  getOrCreate(dto: GetCartDto): Promise<CartEntity> {
    return this.repo.getOrCreate(dto);
  }

  list(filters: ListCartsDto): Promise<CartEntity[]> {
    return this.repo.list(filters);
  }

  addItem(dto: AddCartItemDto): Promise<CartEntity> {
    return this.repo.addItem(dto);
  }

  updateItem(dto: UpdateCartItemDto): Promise<CartEntity> {
    return this.repo.updateItem(dto);
  }

  removeItem(dto: RemoveCartItemDto): Promise<CartEntity> {
    return this.repo.removeItem(dto);
  }

  clear(dto: IdDto): Promise<CartEntity> {
    return this.repo.clear(dto.id);
  }
}
