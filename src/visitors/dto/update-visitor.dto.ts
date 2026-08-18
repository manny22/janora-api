import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateVisitorDto } from './create-visitor.dto';

export class UpdateVisitorDto extends PartialType(
  OmitType(CreateVisitorDto, ['propertyId'] as const),
) {}
