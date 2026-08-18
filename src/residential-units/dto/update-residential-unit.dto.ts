import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateResidentialUnitDto } from './create-residential-unit.dto';

export class UpdateResidentialUnitDto extends PartialType(
  OmitType(CreateResidentialUnitDto, ['propertyId'] as const),
) {}
