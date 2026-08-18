import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('Vehicles')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Post()
  @Roles(Role.SUPER_ADMIN, Role.PROPERTY_ADMIN, Role.RESIDENT)
  @ApiOperation({ summary: 'Registrar vehículo' })
  create(@Body() dto: CreateVehicleDto) {
    return this.vehiclesService.create(dto);
  }

  @Get()
  @Roles(Role.SUPER_ADMIN, Role.PROPERTY_ADMIN, Role.SECURITY_GUARD, Role.RESIDENT)
  @ApiOperation({ summary: 'Listar vehículos' })
  @ApiQuery({ name: 'propertyId', required: false })
  @ApiQuery({ name: 'residentId', required: false })
  findAll(@Query('propertyId') propertyId?: string, @Query('residentId') residentId?: string) {
    return this.vehiclesService.findAll(propertyId, residentId);
  }

  @Get(':id')
  @Roles(Role.SUPER_ADMIN, Role.PROPERTY_ADMIN, Role.SECURITY_GUARD, Role.RESIDENT)
  @ApiOperation({ summary: 'Obtener vehículo por ID' })
  findOne(@Param('id') id: string) {
    return this.vehiclesService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.SUPER_ADMIN, Role.PROPERTY_ADMIN, Role.RESIDENT)
  @ApiOperation({ summary: 'Actualizar vehículo' })
  update(@Param('id') id: string, @Body() dto: UpdateVehicleDto) {
    return this.vehiclesService.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.SUPER_ADMIN, Role.PROPERTY_ADMIN, Role.RESIDENT)
  @ApiOperation({ summary: 'Eliminar vehículo (soft delete)' })
  remove(@Param('id') id: string) {
    return this.vehiclesService.remove(id);
  }
}
