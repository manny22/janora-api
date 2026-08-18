import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { VisitorsService } from './visitors.service';
import { CreateVisitorDto } from './dto/create-visitor.dto';
import { UpdateVisitorDto } from './dto/update-visitor.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('Visitors')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('visitors')
export class VisitorsController {
  constructor(private readonly visitorsService: VisitorsService) {}

  @Post()
  @Roles(Role.SUPER_ADMIN, Role.PROPERTY_ADMIN, Role.SECURITY_GUARD, Role.RESIDENT)
  @ApiOperation({ summary: 'Registrar visitante' })
  create(@Body() dto: CreateVisitorDto) {
    return this.visitorsService.create(dto);
  }

  @Get()
  @Roles(Role.SUPER_ADMIN, Role.PROPERTY_ADMIN, Role.SECURITY_GUARD)
  @ApiOperation({ summary: 'Listar visitantes' })
  @ApiQuery({ name: 'propertyId', required: false })
  @ApiQuery({ name: 'documentNumber', required: false })
  findAll(
    @Query('propertyId') propertyId?: string,
    @Query('documentNumber') documentNumber?: string,
  ) {
    return this.visitorsService.findAll(propertyId, documentNumber);
  }

  @Get(':id')
  @Roles(Role.SUPER_ADMIN, Role.PROPERTY_ADMIN, Role.SECURITY_GUARD)
  @ApiOperation({ summary: 'Obtener visitante por ID' })
  findOne(@Param('id') id: string) {
    return this.visitorsService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.SUPER_ADMIN, Role.PROPERTY_ADMIN, Role.SECURITY_GUARD)
  @ApiOperation({ summary: 'Actualizar visitante' })
  update(@Param('id') id: string, @Body() dto: UpdateVisitorDto) {
    return this.visitorsService.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.SUPER_ADMIN, Role.PROPERTY_ADMIN)
  @ApiOperation({ summary: 'Eliminar visitante (soft delete)' })
  remove(@Param('id') id: string) {
    return this.visitorsService.remove(id);
  }
}
