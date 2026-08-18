import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateResidentialUnitDto } from './dto/create-residential-unit.dto';
import { UpdateResidentialUnitDto } from './dto/update-residential-unit.dto';

@Injectable()
export class ResidentialUnitsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateResidentialUnitDto) {
    return this.prisma.residentialUnit.create({ data: dto });
  }

  async findAll(propertyId?: string, blockId?: string) {
    return this.prisma.residentialUnit.findMany({
      where: {
        deletedAt: null,
        ...(propertyId ? { propertyId } : {}),
        ...(blockId ? { blockId } : {}),
      },
      orderBy: { number: 'asc' },
    });
  }

  async findOne(id: string) {
    const unit = await this.prisma.residentialUnit.findFirst({
      where: { id, deletedAt: null },
      include: {
        residents: {
          where: { deletedAt: null },
          select: { id: true, userId: true, isActive: true },
        },
      },
    });
    if (!unit) throw new NotFoundException('Unidad no encontrada');
    return unit;
  }

  async update(id: string, dto: UpdateResidentialUnitDto) {
    await this.findOne(id);
    return this.prisma.residentialUnit.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.residentialUnit.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    return { message: 'Unidad eliminada correctamente' };
  }
}
