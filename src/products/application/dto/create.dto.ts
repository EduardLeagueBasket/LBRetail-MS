import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { TeamScopeDto } from '../../../shared/dto/team-scope.dto';

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

class ImagenDto {
  @IsString()
  @IsNotEmpty()
  url!: string;

  @IsBoolean()
  @IsOptional()
  principal?: boolean;
}

class VarianteDto {
  @IsString()
  @IsNotEmpty()
  sku!: string;

  @IsObject()
  atributos!: Record<string, unknown>;

  @IsNumber()
  @Min(0)
  precio!: number;

  @IsNumber()
  @Min(0)
  stock!: number;

  @IsBoolean()
  @IsOptional()
  activo?: boolean;
}

class DescuentoDto {
  @IsNumber()
  @Min(0)
  porcentaje!: number;

  @IsBoolean()
  @IsOptional()
  activo?: boolean;
}

export class CreateProductDto extends TeamScopeDto {
  @IsString()
  @IsNotEmpty()
  nombre!: string;

  @IsString()
  @IsOptional()
  slug?: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(categorias)
  categoria!: (typeof categorias)[number];

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsString()
  @IsOptional()
  marca?: string;

  @ValidateNested({ each: true })
  @Type(() => ImagenDto)
  @IsArray()
  @IsOptional()
  imagenes?: ImagenDto[];

  @ValidateNested({ each: true })
  @Type(() => VarianteDto)
  @IsArray()
  @ArrayMinSize(1)
  variantes!: VarianteDto[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  atributosDisponibles?: string[];

  @ValidateNested()
  @Type(() => DescuentoDto)
  @IsOptional()
  descuento?: DescuentoDto;

  @IsNumber()
  @IsOptional()
  @Min(0)
  precioOriginal?: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @IsString()
  @IsOptional()
  creadoPorId?: string;
}
