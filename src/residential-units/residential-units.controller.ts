import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { ResidentialUnitsService } from './residential-units.service';
import { CreateResidentialUnitDto } from './dto/create-residential-unit.dto';
import { UpdateResidentialUnitDto } from './dto/update-residential-unit.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('Residential Units')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('residential-units')
export class ResidentialUnitsController {
  constructor(private readonly unitsService: ResidentialUnitsService) {}

  @Post()
  @Roles(Role.SUPER_ADMIN, Role.PROPERTY_ADMIN)
  @ApiOperation({ summary: 'Crear unidad residencial' })
  create(@Body() dto: CreateResidentialUnitDto) {
    return this.unitsService.create(dto);
  }

  @Get()
  @Roles(Role.SUPER_ADMIN, Role.PROPERTY_ADMIN, Role.SECURITY_GUARD)
  @ApiOperation({ summary: 'Listar unidades residenciales' })
  @ApiQuery({ name: 'propertyId', required: false })
  @ApiQuery({ name: 'blockId', required: false })
  findAll(@Query('propertyId') propertyId?: string, @Query('blockId') blockId?: string) {
    return this.unitsService.findAll(propertyId, blockId);
  }

  @Get(':id')
  @Roles(Role.SUPER_ADMIN, Role.PROPERTY_ADMIN, Role.SECURITY_GUARD)
  @ApiOperation({ summary: 'Obtener unidad por ID' })
  findOne(@Param('id') id: string) {
    return this.unitsService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.SUPER_ADMIN, Role.PROPERTY_ADMIN)
  @ApiOperation({ summary: 'Actualizar unidad residencial' })
  update(@Param('id') id: string, @Body() dto: UpdateResidentialUnitDto) {
    return this.unitsService.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.SUPER_ADMIN, Role.PROPERTY_ADMIN)
  @ApiOperation({ summary: 'Eliminar unidad residencial (soft delete)' })
  remove(@Param('id') id: string) {
    return this.unitsService.remove(id);
  }
}
