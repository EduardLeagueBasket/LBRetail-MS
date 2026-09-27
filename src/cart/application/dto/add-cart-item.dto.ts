import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';
import { TeamScopeDto } from '../../../shared/dto/team-scope.dto';

export class AddCartItemDto extends TeamScopeDto {
  @IsString()
  @IsNotEmpty()
  sessionId!: string;

  @IsString()
  @IsOptional()
  usuarioId?: string;

  @IsString()
  @IsNotEmpty()
  productoId!: string;

  @IsString()
  @IsNotEmpty()
  varianteSku!: string;

  @IsInt()
  @Min(1)
  cantidad!: number;
}
