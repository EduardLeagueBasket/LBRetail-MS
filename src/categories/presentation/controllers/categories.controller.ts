import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { CategoryUseCase } from '../../application/use-cases/category.use-case';

@Controller()
export class CategoriesController {
  constructor(private readonly useCase: CategoryUseCase) {}

  @MessagePattern('retail.list-categories')
  list(): string[] {
    return this.useCase.list();
  }
}
