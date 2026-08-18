import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsDateString } from 'class-validator';

export class CreateVisitAuthorizationDto {
  @ApiProperty()
  @IsString()
  visitorId: string;

  @ApiProperty()
  @IsString()
  residentId: string;

  @ApiProperty()
  @IsString()
  unitId: string;

  @ApiProperty()
  @IsString()
  propertyId: string;

  @ApiProperty()
  @IsDateString()
  validFrom: string;

  @ApiProperty()
  @IsDateString()
  validUntil: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}
