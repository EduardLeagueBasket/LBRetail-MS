import { Module } from '@nestjs/common';
import { CategoryUseCase } from '../application/use-cases/category.use-case';
import { CategoriesController } from './controllers/categories.controller';

@Module({
  controllers: [CategoriesController],
  providers: [CategoryUseCase],
})
export class CategoriesModule {}
