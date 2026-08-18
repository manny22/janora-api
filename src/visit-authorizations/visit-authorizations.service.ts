import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { AuthorizationStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVisitAuthorizationDto } from './dto/create-visit-authorization.dto';
import { UpdateVisitAuthorizationDto } from './dto/update-visit-authorization.dto';

const INCLUDE_AUTHORIZATION = {
  visitor: { select: { id: true, firstName: true, lastName: true, documentNumber: true } },
  unit: { select: { id: true, number: true, floor: true } },
  authorizedBy: { select: { id: true, firstName: true, lastName: true } },
};

@Injectable()
export class VisitAuthorizationsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateVisitAuthorizationDto, authorizedById: string) {
    if (new Date(dto.validUntil) <= new Date(dto.validFrom)) {
      throw new BadRequestException('validUntil debe ser posterior a validFrom');
    }

    return this.prisma.visitAuthorization.create({
      data: { ...dto, authorizedById },
      include: INCLUDE_AUTHORIZATION,
    });
  }

  async findAll(propertyId?: string, status?: AuthorizationStatus, residentId?: string) {
    return this.prisma.visitAuthorization.findMany({
      where: {
        deletedAt: null,
        ...(propertyId ? { propertyId } : {}),
        ...(status ? { status } : {}),
        ...(residentId ? { residentId } : {}),
      },
      include: INCLUDE_AUTHORIZATION,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const authorization = await this.prisma.visitAuthorization.findFirst({
      where: { id, deletedAt: null },
      include: INCLUDE_AUTHORIZATION,
    });
    if (!authorization) throw new NotFoundException('Autorización no encontrada');
    return authorization;
  }

  async update(id: string, dto: UpdateVisitAuthorizationDto) {
    const authorization = await this.findOne(id);

    if (authorization.status !== AuthorizationStatus.ACTIVE && authorization.status !== AuthorizationStatus.PENDING) {
      throw new BadRequestException('Solo se pueden modificar autorizaciones activas o pendientes');
    }

    return this.prisma.visitAuthorization.update({
      where: { id },
      data: dto,
      include: INCLUDE_AUTHORIZATION,
    });
  }

  async revoke(id: string) {
    const authorization = await this.findOne(id);

    if (authorization.status === AuthorizationStatus.REVOKED) {
      throw new BadRequestException('La autorización ya está revocada');
    }

    return this.prisma.visitAuthorization.update({
      where: { id },
      data: { status: AuthorizationStatus.REVOKED },
      include: INCLUDE_AUTHORIZATION,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.visitAuthorization.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    return { message: 'Autorización eliminada correctamente' };
  }
}
