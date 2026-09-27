import { Injectable } from '@nestjs/common';
import { Categoria } from '@prisma/client';

@Injectable()
export class CategoryUseCase {
  list(): string[] {
    return Object.values(Categoria);
  }
}
