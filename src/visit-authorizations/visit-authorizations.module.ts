import { Module } from '@nestjs/common';
import { VisitAuthorizationsService } from './visit-authorizations.service';
import { VisitAuthorizationsController } from './visit-authorizations.controller';

@Module({
  controllers: [VisitAuthorizationsController],
  providers: [VisitAuthorizationsService],
  exports: [VisitAuthorizationsService],
})
export class VisitAuthorizationsModule {}
