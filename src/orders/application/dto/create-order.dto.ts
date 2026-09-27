import { IsNotEmpty, IsString } from 'class-validator';
import { TeamScopeDto } from '../../../shared/dto/team-scope.dto';

export class CreateOrderDto extends TeamScopeDto {
  @IsString()
  @IsNotEmpty()
  usuarioId!: string;

  @IsString()
  @IsNotEmpty()
  sessionId!: string;
}
