import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DocumentType } from '@prisma/client';
import { IsString, IsOptional, IsEnum } from 'class-validator';

export class CreateVisitorDto {
  @ApiProperty({ example: 'Carlos' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Gómez' })
  @IsString()
  lastName: string;

  @ApiPropertyOptional({ enum: DocumentType, example: DocumentType.CC })
  @IsOptional()
  @IsEnum(DocumentType)
  documentType?: DocumentType;

  @ApiProperty({ example: '1020304050' })
  @IsString()
  documentNumber: string;

  @ApiPropertyOptional({ example: '3009876543' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty()
  @IsString()
  propertyId: string;
}
