import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuditLogsService {
  constructor(private prisma: PrismaService) {}

  async log(entry: {
    userId: string;
    action: string;
    entity: string;
    entityId: string;
    oldValues?: object;
    newValues?: object;
    propertyId?: string;
    ipAddress?: string;
  }) {
    return this.prisma.auditLog.create({ data: entry });
  }

  async findAll(filters: { propertyId?: string; userId?: string; entity?: string }) {
    return this.prisma.auditLog.findMany({
      where: {
        ...(filters.propertyId ? { propertyId: filters.propertyId } : {}),
        ...(filters.userId ? { userId: filters.userId } : {}),
        ...(filters.entity ? { entity: filters.entity } : {}),
      },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 200,
    });
  }

  async findOne(id: string) {
    const log = await this.prisma.auditLog.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, email: true } },
      },
    });
    if (!log) throw new NotFoundException('Registro de auditoría no encontrado');
    return log;
  }
}
