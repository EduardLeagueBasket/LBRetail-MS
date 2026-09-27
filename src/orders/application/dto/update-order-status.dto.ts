import { IsIn, IsNotEmpty, IsString } from 'class-validator';

const estados = [
  'PENDIENTE',
  'PAGADO',
  'ENVIADO',
  'ENTREGADO',
  'CANCELADO',
] as const;

export class UpdateOrderStatusDto {
  @IsString()
  @IsNotEmpty()
  id!: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(estados)
  estado!: (typeof estados)[number];
}
