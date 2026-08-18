import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { Role, AuthorizationStatus } from '@prisma/client';
import { VisitAuthorizationsService } from './visit-authorizations.service';
import { CreateVisitAuthorizationDto } from './dto/create-visit-authorization.dto';
import { UpdateVisitAuthorizationDto } from './dto/update-visit-authorization.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Visit Authorizations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('visit-authorizations')
export class VisitAuthorizationsController {
  constructor(private readonly authorizationsService: VisitAuthorizationsService) {}

  @Post()
  @Roles(Role.SUPER_ADMIN, Role.PROPERTY_ADMIN, Role.RESIDENT)
  @ApiOperation({ summary: 'Crear autorización de visita' })
  create(@Body() dto: CreateVisitAuthorizationDto, @CurrentUser() user: any) {
    return this.authorizationsService.create(dto, user.id);
  }

  @Get()
  @Roles(Role.SUPER_ADMIN, Role.PROPERTY_ADMIN, Role.SECURITY_GUARD, Role.RESIDENT)
  @ApiOperation({ summary: 'Listar autorizaciones de visita' })
  @ApiQuery({ name: 'propertyId', required: false })
  @ApiQuery({ name: 'status', required: false, enum: AuthorizationStatus })
  @ApiQuery({ name: 'residentId', required: false })
  findAll(
    @Query('propertyId') propertyId?: string,
    @Query('status') status?: AuthorizationStatus,
    @Query('residentId') residentId?: string,
  ) {
    return this.authorizationsService.findAll(propertyId, status, residentId);
  }

  @Get(':id')
  @Roles(Role.SUPER_ADMIN, Role.PROPERTY_ADMIN, Role.SECURITY_GUARD, Role.RESIDENT)
  @ApiOperation({ summary: 'Obtener autorización por ID' })
  findOne(@Param('id') id: string) {
    return this.authorizationsService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.SUPER_ADMIN, Role.PROPERTY_ADMIN, Role.RESIDENT)
  @ApiOperation({ summary: 'Actualizar autorización de visita' })
  update(@Param('id') id: string, @Body() dto: UpdateVisitAuthorizationDto) {
    return this.authorizationsService.update(id, dto);
  }

  @Patch(':id/revoke')
  @Roles(Role.SUPER_ADMIN, Role.PROPERTY_ADMIN, Role.RESIDENT)
  @ApiOperation({ summary: 'Revocar autorización de visita' })
  revoke(@Param('id') id: string) {
    return this.authorizationsService.revoke(id);
  }

  @Delete(':id')
  @Roles(Role.SUPER_ADMIN, Role.PROPERTY_ADMIN)
  @ApiOperation({ summary: 'Eliminar autorización (soft delete)' })
  remove(@Param('id') id: string) {
    return this.authorizationsService.remove(id);
  }
}
