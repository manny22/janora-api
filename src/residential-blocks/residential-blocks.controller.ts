import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { ResidentialBlocksService } from './residential-blocks.service';
import { CreateResidentialBlockDto } from './dto/create-residential-block.dto';
import { UpdateResidentialBlockDto } from './dto/update-residential-block.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('Residential Blocks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('residential-blocks')
export class ResidentialBlocksController {
  constructor(private readonly blocksService: ResidentialBlocksService) {}

  @Post()
  @Roles(Role.SUPER_ADMIN, Role.PROPERTY_ADMIN)
  @ApiOperation({ summary: 'Crear bloque residencial' })
  create(@Body() dto: CreateResidentialBlockDto) {
    return this.blocksService.create(dto);
  }

  @Get()
  @Roles(Role.SUPER_ADMIN, Role.PROPERTY_ADMIN)
  @ApiOperation({ summary: 'Listar bloques residenciales' })
  @ApiQuery({ name: 'propertyId', required: false })
  findAll(@Query('propertyId') propertyId?: string) {
    return this.blocksService.findAll(propertyId);
  }

  @Get(':id')
  @Roles(Role.SUPER_ADMIN, Role.PROPERTY_ADMIN)
  @ApiOperation({ summary: 'Obtener bloque por ID' })
  findOne(@Param('id') id: string) {
    return this.blocksService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.SUPER_ADMIN, Role.PROPERTY_ADMIN)
  @ApiOperation({ summary: 'Actualizar bloque residencial' })
  update(@Param('id') id: string, @Body() dto: UpdateResidentialBlockDto) {
    return this.blocksService.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.SUPER_ADMIN, Role.PROPERTY_ADMIN)
  @ApiOperation({ summary: 'Eliminar bloque residencial (soft delete)' })
  remove(@Param('id') id: string) {
    return this.blocksService.remove(id);
  }
}
