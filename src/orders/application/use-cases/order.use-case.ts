import { Inject, Injectable } from '@nestjs/common';
import { ORDER_REPOSITORY } from '../../domain/constants/injection-tokens';
import type { OrderEntity } from '../../domain/entities/order.entity';
import type { CreateOrderDto } from '../dto/create-order.dto';
import type { ListOrdersDto } from '../dto/list-orders.dto';
import type { UpdateOrderStatusDto } from '../dto/update-order-status.dto';
import type { OrderInterfaceRepository } from '../ports/order.interface-repository';

@Injectable()
export class OrderUseCase {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly repo: OrderInterfaceRepository,
  ) {}

  findAll(filters: ListOrdersDto): Promise<OrderEntity[]> {
    return this.repo.findAll(filters);
  }

  findById(id: string): Promise<OrderEntity | null> {
    return this.repo.findById(id);
  }

  createFromCart(dto: CreateOrderDto): Promise<OrderEntity> {
    return this.repo.createFromCart(dto);
  }

  updateStatus(dto: UpdateOrderStatusDto): Promise<OrderEntity> {
    return this.repo.updateStatus(dto);
  }
}
