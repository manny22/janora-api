import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVisitorDto } from './dto/create-visitor.dto';
import { UpdateVisitorDto } from './dto/update-visitor.dto';

@Injectable()
export class VisitorsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateVisitorDto) {
    const existing = await this.prisma.visitor.findUnique({
      where: {
        propertyId_documentNumber: {
          propertyId: dto.propertyId,
          documentNumber: dto.documentNumber,
        },
      },
    });
    if (existing) throw new ConflictException('Este visitante ya está registrado en la propiedad');

    return this.prisma.visitor.create({ data: dto });
  }

  async findAll(propertyId?: string, documentNumber?: string) {
    return this.prisma.visitor.findMany({
      where: {
        deletedAt: null,
        ...(propertyId ? { propertyId } : {}),
        ...(documentNumber ? { documentNumber } : {}),
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const visitor = await this.prisma.visitor.findFirst({
      where: { id, deletedAt: null },
      include: {
        authorizations: {
          where: { deletedAt: null },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });
    if (!visitor) throw new NotFoundException('Visitante no encontrado');
    return visitor;
  }

  async update(id: string, dto: UpdateVisitorDto) {
    await this.findOne(id);
    return this.prisma.visitor.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.visitor.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    return { message: 'Visitante eliminado correctamente' };
  }
}
