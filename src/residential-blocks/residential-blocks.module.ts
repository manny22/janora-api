import { Module } from '@nestjs/common';
import { ResidentialBlocksService } from './residential-blocks.service';
import { ResidentialBlocksController } from './residential-blocks.controller';

@Module({
  controllers: [ResidentialBlocksController],
  providers: [ResidentialBlocksService],
  exports: [ResidentialBlocksService],
})
export class ResidentialBlocksModule {}
