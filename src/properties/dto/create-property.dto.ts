import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional } from 'class-validator';

export class CreatePropertyDto {
  @ApiProperty({ example: 'Conjunto Residencial Los Robles' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Calle 123 #45-67' })
  @IsString()
  address: string;

  @ApiProperty({ example: 'Bogotá' })
  @IsString()
  city: string;

  @ApiPropertyOptional({ example: '6011234567' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: 'contacto@losrobles.com' })
  @IsOptional()
  @IsEmail()
  email?: string;
}
