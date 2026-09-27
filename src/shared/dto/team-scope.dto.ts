import { IsIn, IsNotEmpty, IsString } from 'class-validator';

const teamTypes = ['LIGA', 'NACIONAL'] as const;

export type TeamTypeValue = (typeof teamTypes)[number];

export class TeamScopeDto {
  @IsString()
  @IsNotEmpty()
  teamId!: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(teamTypes)
  teamType!: TeamTypeValue;
}
