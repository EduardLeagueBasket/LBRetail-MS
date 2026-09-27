import type { AddCartItemDto } from '../dto/add-cart-item.dto';
import type { GetCartDto } from '../dto/get-cart.dto';
import type { ListCartsDto } from '../dto/list-carts.dto';
import type { RemoveCartItemDto } from '../dto/remove-cart-item.dto';
import type { UpdateCartItemDto } from '../dto/update-cart-item.dto';
import type { CartEntity } from '../../domain/entities/cart.entity';

export interface CartInterfaceRepository {
  getOrCreate(dto: GetCartDto): Promise<CartEntity>;
  list(filters: ListCartsDto): Promise<CartEntity[]>;
  addItem(dto: AddCartItemDto): Promise<CartEntity>;
  updateItem(dto: UpdateCartItemDto): Promise<CartEntity>;
  removeItem(dto: RemoveCartItemDto): Promise<CartEntity>;
  clear(cartId: string): Promise<CartEntity>;
}
