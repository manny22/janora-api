import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AccessType } from '@prisma/client';
import { IsString, IsOptional, IsEnum } from 'class-validator';

export class CreateAccessLogDto {
  @ApiProperty({ enum: AccessType, example: AccessType.ENTRY })
  @IsEnum(AccessType)
  type: AccessType;

  @ApiProperty()
  @IsString()
  propertyId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  visitorId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  residentId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  vehicleId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  petId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  authorizationId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}
