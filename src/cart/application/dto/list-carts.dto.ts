import { IsOptional, IsString } from 'class-validator';
import { TeamScopeDto } from '../../../shared/dto/team-scope.dto';

export class ListCartsDto {
  @IsString()
  @IsOptional()
  teamId?: string;

  @IsString()
  @IsOptional()
  teamType?: 'LIGA' | 'NACIONAL';

  @IsString()
  @IsOptional()
  usuarioId?: string;

  @IsString()
  @IsOptional()
  sessionId?: string;
}

export class ListCartsByTeamDto extends TeamScopeDto {
  @IsString()
  @IsOptional()
  usuarioId?: string;
}
