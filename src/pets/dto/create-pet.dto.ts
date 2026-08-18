import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsDateString } from 'class-validator';

export class CreatePetDto {
  @ApiProperty({ example: 'Rocky' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 'Labrador' })
  @IsOptional()
  @IsString()
  breed?: string;

  @ApiPropertyOptional({ example: 'Dorado' })
  @IsOptional()
  @IsString()
  color?: string;

  @ApiPropertyOptional({ example: 'DOG' })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiPropertyOptional({ example: 'MEDIUM' })
  @IsOptional()
  @IsString()
  size?: string;

  @ApiPropertyOptional({ example: 18 })
  @IsOptional()
  @IsNumber()
  weight?: number;

  @ApiPropertyOptional({ example: '2026-01-01T00:00:00Z' })
  @IsOptional()
  @IsDateString()
  vaccinationDate?: string;

  @ApiPropertyOptional({ example: '2027-01-18T00:00:00Z' })
  @IsOptional()
  @IsDateString()
  vaccinationExpiry?: string;

  @ApiPropertyOptional({ example: '2423423423' })
  @IsOptional()
  @IsString()
  healthCertificateNumber?: string;

  @ApiPropertyOptional({ example: '2026-08-31T00:00:00Z' })
  @IsOptional()
  @IsDateString()
  healthCertificateExpiry?: string;

  @ApiProperty()
  @IsString()
  residentId: string;

  @ApiProperty()
  @IsString()
  propertyId: string;
}
