import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateResidentialBlockDto } from './create-residential-block.dto';

export class UpdateResidentialBlockDto extends PartialType(
  OmitType(CreateResidentialBlockDto, ['propertyId'] as const),
) {}
