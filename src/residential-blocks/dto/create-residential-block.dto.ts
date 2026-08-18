import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateResidentialBlockDto {
  @ApiProperty({ example: 'Torre A' })
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  propertyId: string;
}
