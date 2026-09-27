import { IsIn, IsOptional, IsString } from 'class-validator';

const estados = [
  'PENDIENTE',
  'PAGADO',
  'ENVIADO',
  'ENTREGADO',
  'CANCELADO',
] as const;

const teamTypes = ['LIGA', 'NACIONAL'] as const;

export class ListOrdersDto {
  @IsString()
  @IsOptional()
  teamId?: string;

  @IsString()
  @IsOptional()
  @IsIn(teamTypes)
  teamType?: (typeof teamTypes)[number];

  @IsString()
  @IsOptional()
  usuarioId?: string;

  @IsString()
  @IsOptional()
  @IsIn(estados)
  estado?: (typeof estados)[number];
}
