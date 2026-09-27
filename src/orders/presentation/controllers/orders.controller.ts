import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { IdDto } from '../../../shared/dto/id.dto';
import { CreateOrderDto } from '../../application/dto/create-order.dto';
import { ListOrdersDto } from '../../application/dto/list-orders.dto';
import { UpdateOrderStatusDto } from '../../application/dto/update-order-status.dto';
import { OrderUseCase } from '../../application/use-cases/order.use-case';
import type { OrderEntity } from '../../domain/entities/order.entity';

@Controller()
export class OrdersController {
  constructor(private readonly useCase: OrderUseCase) {}

  @MessagePattern('retail.create-order')
  create(@Payload() dto: CreateOrderDto): Promise<OrderEntity> {
    return this.useCase.createFromCart(dto);
  }

  @MessagePattern('retail.list-orders')
  findAll(@Payload() filters: ListOrdersDto): Promise<OrderEntity[]> {
    return this.useCase.findAll(filters);
  }

  @MessagePattern('retail.get-order')
  findById(@Payload() dto: IdDto): Promise<OrderEntity | null> {
    return this.useCase.findById(dto.id);
  }

  @MessagePattern('retail.update-order-status')
  updateStatus(@Payload() dto: UpdateOrderStatusDto): Promise<OrderEntity> {
    return this.useCase.updateStatus(dto);
  }
}
