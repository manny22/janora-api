import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('Reports')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('dashboard-metrics/:propertyId')
  @Roles(Role.SUPER_ADMIN, Role.PROPERTY_ADMIN, Role.SECURITY_GUARD)
  @ApiOperation({ summary: 'Obtener métricas del dashboard' })
  async getDashboardMetrics(@Param('propertyId') propertyId: string) {
    return this.reportsService.getDashboardMetrics(propertyId);
  }

  @Get('access-logs')
  @Roles(Role.SUPER_ADMIN, Role.PROPERTY_ADMIN, Role.SECURITY_GUARD)
  @ApiOperation({ summary: 'Obtener registros de acceso' })
  async getAccessLogs(
    @Query('propertyId') propertyId: string,
    @Query('dateFrom') dateFrom: string,
    @Query('dateTo') dateTo: string,
  ) {
    return this.reportsService.getAccessLogs(
      propertyId,
      new Date(dateFrom),
      new Date(dateTo),
    );
  }

  @Get('active-residents/:propertyId')
  @Roles(Role.SUPER_ADMIN, Role.PROPERTY_ADMIN, Role.SECURITY_GUARD)
  @ApiOperation({ summary: 'Obtener residentes activos' })
  async getActiveResidents(@Param('propertyId') propertyId: string) {
    return this.reportsService.getActiveResidents(propertyId);
  }

  @Get('registered-vehicles/:propertyId')
  @Roles(Role.SUPER_ADMIN, Role.PROPERTY_ADMIN, Role.SECURITY_GUARD)
  @ApiOperation({ summary: 'Obtener vehículos registrados' })
  async getRegisteredVehicles(@Param('propertyId') propertyId: string) {
    return this.reportsService.getRegisteredVehicles(propertyId);
  }

  @Get('registered-pets/:propertyId')
  @Roles(Role.SUPER_ADMIN, Role.PROPERTY_ADMIN, Role.SECURITY_GUARD)
  @ApiOperation({ summary: 'Obtener mascotas registradas' })
  async getRegisteredPets(@Param('propertyId') propertyId: string) {
    return this.reportsService.getRegisteredPets(propertyId);
  }

  @Get('frequent-visitors')
  @Roles(Role.SUPER_ADMIN, Role.PROPERTY_ADMIN, Role.SECURITY_GUARD)
  @ApiOperation({ summary: 'Obtener visitantes frecuentes' })
  async getFrequentVisitors(
    @Query('propertyId') propertyId: string,
    @Query('dateFrom') dateFrom: string,
    @Query('dateTo') dateTo: string,
  ) {
    return this.reportsService.getFrequentVisitors(
      propertyId,
      new Date(dateFrom),
      new Date(dateTo),
    );
  }
}
