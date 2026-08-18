import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { AuditLogsService } from './audit-logs.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('Audit Logs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('audit-logs')
export class AuditLogsController {
  constructor(private readonly auditLogsService: AuditLogsService) {}

  @Get()
  @Roles(Role.SUPER_ADMIN, Role.PROPERTY_ADMIN)
  @ApiOperation({ summary: 'Listar registros de auditoría' })
  @ApiQuery({ name: 'propertyId', required: false })
  @ApiQuery({ name: 'userId', required: false })
  @ApiQuery({ name: 'entity', required: false })
  findAll(
    @Query('propertyId') propertyId?: string,
    @Query('userId') userId?: string,
    @Query('entity') entity?: string,
  ) {
    return this.auditLogsService.findAll({ propertyId, userId, entity });
  }

  @Get(':id')
  @Roles(Role.SUPER_ADMIN, Role.PROPERTY_ADMIN)
  @ApiOperation({ summary: 'Obtener registro de auditoría por ID' })
  findOne(@Param('id') id: string) {
    return this.auditLogsService.findOne(id);
  }
}
