import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { configuration } from './config/configuration';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PropertiesModule } from './properties/properties.module';
import { ResidentialBlocksModule } from './residential-blocks/residential-blocks.module';
import { ResidentialUnitsModule } from './residential-units/residential-units.module';
import { ResidentsModule } from './residents/residents.module';
import { PetsModule } from './pets/pets.module';
import { VehiclesModule } from './vehicles/vehicles.module';
import { VisitorsModule } from './visitors/visitors.module';
import { VisitAuthorizationsModule } from './visit-authorizations/visit-authorizations.module';
import { AccessLogsModule } from './access-logs/access-logs.module';
import { AuditLogsModule } from './audit-logs/audit-logs.module';
import { ReportsModule } from './reports/reports.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: [`.env.${process.env.NODE_ENV || 'development'}`, '.env'],
    }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 60 }]),
    PrismaModule,
    AuthModule,
    UsersModule,
    PropertiesModule,
    ResidentialBlocksModule,
    ResidentialUnitsModule,
    ResidentsModule,
    PetsModule,
    VehiclesModule,
    VisitorsModule,
    VisitAuthorizationsModule,
    AccessLogsModule,
    AuditLogsModule,
    ReportsModule,
  ],
})
export class AppModule {}
