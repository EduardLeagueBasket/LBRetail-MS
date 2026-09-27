import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class UpdateCartItemDto {
  @IsString()
  @IsNotEmpty()
  carritoId!: string;

  @IsString()
  @IsNotEmpty()
  itemId!: string;

  @IsInt()
  @Min(1)
  cantidad!: number;
}
