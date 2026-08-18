import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { PetsService } from './pets.service';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('Pets')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('pets')
export class PetsController {
  constructor(private readonly petsService: PetsService) {}

  @Post()
  @Roles(Role.SUPER_ADMIN, Role.PROPERTY_ADMIN, Role.RESIDENT)
  @ApiOperation({ summary: 'Registrar mascota' })
  create(@Body() dto: CreatePetDto) {
    return this.petsService.create(dto);
  }

  @Get()
  @Roles(Role.SUPER_ADMIN, Role.PROPERTY_ADMIN, Role.SECURITY_GUARD, Role.RESIDENT)
  @ApiOperation({ summary: 'Listar mascotas' })
  @ApiQuery({ name: 'propertyId', required: false })
  @ApiQuery({ name: 'residentId', required: false })
  findAll(@Query('propertyId') propertyId?: string, @Query('residentId') residentId?: string) {
    return this.petsService.findAll(propertyId, residentId);
  }

  @Get(':id')
  @Roles(Role.SUPER_ADMIN, Role.PROPERTY_ADMIN, Role.SECURITY_GUARD, Role.RESIDENT)
  @ApiOperation({ summary: 'Obtener mascota por ID' })
  findOne(@Param('id') id: string) {
    return this.petsService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.SUPER_ADMIN, Role.PROPERTY_ADMIN, Role.RESIDENT)
  @ApiOperation({ summary: 'Actualizar mascota' })
  update(@Param('id') id: string, @Body() dto: UpdatePetDto) {
    return this.petsService.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.SUPER_ADMIN, Role.PROPERTY_ADMIN, Role.RESIDENT)
  @ApiOperation({ summary: 'Eliminar mascota (soft delete)' })
  remove(@Param('id') id: string) {
    return this.petsService.remove(id);
  }
}
