import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { ResidentsService } from './residents.service';
import { CreateResidentDto } from './dto/create-resident.dto';
import { UpdateResidentDto } from './dto/update-resident.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('Residents')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('residents')
export class ResidentsController {
  constructor(private readonly residentsService: ResidentsService) {}

  @Post()
  @Roles(Role.SUPER_ADMIN, Role.PROPERTY_ADMIN)
  @ApiOperation({ summary: 'Crear residente (crea usuario + residente)' })
  create(@Body() dto: CreateResidentDto) {
    return this.residentsService.create(dto);
  }

  @Get()
  @Roles(Role.SUPER_ADMIN, Role.PROPERTY_ADMIN, Role.SECURITY_GUARD)
  @ApiOperation({ summary: 'Listar residentes' })
  @ApiQuery({ name: 'propertyId', required: false })
  @ApiQuery({ name: 'unitId', required: false })
  findAll(@Query('propertyId') propertyId?: string, @Query('unitId') unitId?: string) {
    return this.residentsService.findAll(propertyId, unitId);
  }

  @Get(':id')
  @Roles(Role.SUPER_ADMIN, Role.PROPERTY_ADMIN, Role.SECURITY_GUARD)
  @ApiOperation({ summary: 'Obtener residente por ID' })
  findOne(@Param('id') id: string) {
    return this.residentsService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.SUPER_ADMIN, Role.PROPERTY_ADMIN)
  @ApiOperation({ summary: 'Actualizar residente' })
  update(@Param('id') id: string, @Body() dto: UpdateResidentDto) {
    return this.residentsService.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.SUPER_ADMIN, Role.PROPERTY_ADMIN)
  @ApiOperation({ summary: 'Eliminar residente (soft delete)' })
  remove(@Param('id') id: string) {
    return this.residentsService.remove(id);
  }
}
