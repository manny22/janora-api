import { Module } from '@nestjs/common';
import { ResidentialUnitsService } from './residential-units.service';
import { ResidentialUnitsController } from './residential-units.controller';

@Module({
  controllers: [ResidentialUnitsController],
  providers: [ResidentialUnitsService],
  exports: [ResidentialUnitsService],
})
export class ResidentialUnitsModule {}
