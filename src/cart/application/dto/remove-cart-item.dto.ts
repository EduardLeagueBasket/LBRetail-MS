import { IsNotEmpty, IsString } from 'class-validator';

export class RemoveCartItemDto {
  @IsString()
  @IsNotEmpty()
  carritoId!: string;

  @IsString()
  @IsNotEmpty()
  itemId!: string;
}
