import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { UpdateProductDto } from '../../application/dto/update.dto';

export class UpdateProductMessageDto {
  @IsString()
  @IsNotEmpty()
  id!: string;

  @ValidateNested()
  @Type(() => UpdateProductDto)
  data!: UpdateProductDto;
}
