import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';

const SELECT_PROPERTY = {
  id: true,
  name: true,
  address: true,
  city: true,
  phone: true,
  email: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
};

@Injectable()
export class PropertiesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreatePropertyDto) {
    return this.prisma.property.create({
      data: dto,
      select: SELECT_PROPERTY,
    });
  }

  async findAll() {
    return this.prisma.property.findMany({
      where: { deletedAt: null },
      select: SELECT_PROPERTY,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const property = await this.prisma.property.findFirst({
      where: { id, deletedAt: null },
      select: {
        ...SELECT_PROPERTY,
        blocks: { select: { id: true, name: true } },
        units: { select: { id: true, number: true, floor: true, isOccupied: true } },
      },
    });
    if (!property) throw new NotFoundException('Propiedad no encontrada');
    return property;
  }

  async update(id: string, dto: UpdatePropertyDto) {
    await this.findOne(id);
    return this.prisma.property.update({
      where: { id },
      data: dto,
      select: SELECT_PROPERTY,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.property.update({
      where: { id },
      data: { deletedAt: new Date(), isActive: false },
    });
    return { message: 'Propiedad eliminada correctamente' };
  }

  async toggleActive(id: string) {
    const property = await this.findOne(id);
    return this.prisma.property.update({
      where: { id },
      data: { isActive: !property.isActive },
      select: SELECT_PROPERTY,
    });
  }
}
