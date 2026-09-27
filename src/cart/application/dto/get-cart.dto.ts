import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { TeamScopeDto } from '../../../shared/dto/team-scope.dto';

export class GetCartDto extends TeamScopeDto {
  @IsString()
  @IsNotEmpty()
  sessionId!: string;

  @IsString()
  @IsOptional()
  usuarioId?: string;
}
