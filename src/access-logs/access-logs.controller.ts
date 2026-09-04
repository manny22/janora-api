import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { Role, AccessType } from '@prisma/client';
import { AccessLogsService } from './access-logs.service';
import { CreateAccessLogDto } from './dto/create-access-log.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Access Logs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('access-logs')
export class AccessLogsController {
  constructor(private readonly accessLogsService: AccessLogsService) {}

  @Post()
  @Roles(Role.SECURITY_GUARD, Role.PROPERTY_ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Registrar entrada/salida' })
  create(@Body() dto: CreateAccessLogDto, @CurrentUser() user: any) {
    return this.accessLogsService.create(dto, user.id);
  }

  @Get()
  @Roles(Role.SUPER_ADMIN, Role.PROPERTY_ADMIN, Role.SECURITY_GUARD, Role.RESIDENT)
  @ApiOperation({ summary: 'Listar registros de acceso' })
  @ApiQuery({ name: 'propertyId', required: false })
  @ApiQuery({ name: 'type', required: false, enum: AccessType })
  @ApiQuery({ name: 'visitorId', required: false })
  @ApiQuery({ name: 'residentId', required: false })
  findAll(
    @Query('propertyId') propertyId?: string,
    @Query('type') type?: AccessType,
    @Query('visitorId') visitorId?: string,
    @Query('residentId') residentId?: string,
  ) {
    return this.accessLogsService.findAll({ propertyId, type, visitorId, residentId });
  }

  @Get('inside')
  @Roles(Role.SUPER_ADMIN, Role.PROPERTY_ADMIN, Role.SECURITY_GUARD, Role.RESIDENT)
  @ApiOperation({ summary: 'Listar personas actualmente dentro de la propiedad' })
  @ApiQuery({ name: 'propertyId', required: true })
  findPeopleInside(@Query('propertyId') propertyId: string) {
    return this.accessLogsService.findPeopleInside(propertyId);
  }

  @Get(':id')
  @Roles(Role.SUPER_ADMIN, Role.PROPERTY_ADMIN, Role.SECURITY_GUARD, Role.RESIDENT)
  @ApiOperation({ summary: 'Obtener registro de acceso por ID' })
  findOne(@Param('id') id: string) {
    return this.accessLogsService.findOne(id);
  }
}
