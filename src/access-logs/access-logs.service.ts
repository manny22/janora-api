import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { AccessType, AuthorizationStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAccessLogDto } from './dto/create-access-log.dto';

const INCLUDE_ACCESS_LOG = {
  guard: { select: { id: true, firstName: true, lastName: true } },
  visitor: { select: { id: true, firstName: true, lastName: true, documentNumber: true } },
  resident: { select: { id: true, unitId: true } },
  vehicle: { select: { id: true, plate: true } },
  pet: { select: { id: true, name: true } },
};

@Injectable()
export class AccessLogsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateAccessLogDto, guardId: string) {
    if (dto.authorizationId) {
      const authorization = await this.prisma.visitAuthorization.findFirst({
        where: { id: dto.authorizationId, deletedAt: null },
      });
      if (!authorization) throw new NotFoundException('Autorización no encontrada');

      const now = new Date();
      if (
        authorization.status !== AuthorizationStatus.ACTIVE ||
        now < authorization.validFrom ||
        now > authorization.validUntil
      ) {
        throw new BadRequestException('La autorización no está vigente');
      }
    }

    return this.prisma.accessLog.create({
      data: { ...dto, guardId },
      include: INCLUDE_ACCESS_LOG,
    });
  }

  async findAll(filters: {
    propertyId?: string;
    type?: AccessType;
    visitorId?: string;
    residentId?: string;
  }) {
    return this.prisma.accessLog.findMany({
      where: {
        ...(filters.propertyId ? { propertyId: filters.propertyId } : {}),
        ...(filters.type ? { type: filters.type } : {}),
        ...(filters.visitorId ? { visitorId: filters.visitorId } : {}),
        ...(filters.residentId ? { residentId: filters.residentId } : {}),
      },
      include: INCLUDE_ACCESS_LOG,
      orderBy: { createdAt: 'desc' },
      take: 200,
    });
  }

  async findOne(id: string) {
    const log = await this.prisma.accessLog.findUnique({
      where: { id },
      include: INCLUDE_ACCESS_LOG,
    });
    if (!log) throw new NotFoundException('Registro de acceso no encontrado');
    return log;
  }
}
