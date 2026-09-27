import type { CreateOrderDto } from '../dto/create-order.dto';
import type { ListOrdersDto } from '../dto/list-orders.dto';
import type { UpdateOrderStatusDto } from '../dto/update-order-status.dto';
import type { OrderEntity } from '../../domain/entities/order.entity';

export interface OrderInterfaceRepository {
  findAll(filters: ListOrdersDto): Promise<OrderEntity[]>;
  findById(id: string): Promise<OrderEntity | null>;
  createFromCart(dto: CreateOrderDto): Promise<OrderEntity>;
  updateStatus(dto: UpdateOrderStatusDto): Promise<OrderEntity>;
}
