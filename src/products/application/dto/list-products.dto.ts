import { IsBoolean, IsIn, IsOptional, IsString } from 'class-validator';

const categorias = [
  'jersey',
  'short',
  'medias',
  'llavero',
  'gorra',
  'bandana',
  'taza',
  'vaso',
  'balon',
  'sudadera',
  'bandera',
  'poster',
  'otro',
] as const;

const teamTypes = ['LIGA', 'NACIONAL'] as const;

export class ListProductsDto {
  @IsString()
  @IsOptional()
  teamId?: string;

  @IsString()
  @IsOptional()
  @IsIn(teamTypes)
  teamType?: (typeof teamTypes)[number];

  @IsString()
  @IsOptional()
  @IsIn(categorias)
  categoria?: (typeof categorias)[number];

  @IsBoolean()
  @IsOptional()
  activo?: boolean;
}
