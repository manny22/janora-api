import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateResidentialBlockDto } from './dto/create-residential-block.dto';
import { UpdateResidentialBlockDto } from './dto/update-residential-block.dto';

@Injectable()
export class ResidentialBlocksService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateResidentialBlockDto) {
    return this.prisma.residentialBlock.create({ data: dto });
  }

  async findAll(propertyId?: string) {
    return this.prisma.residentialBlock.findMany({
      where: {
        deletedAt: null,
        ...(propertyId ? { propertyId } : {}),
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const block = await this.prisma.residentialBlock.findFirst({
      where: { id, deletedAt: null },
      include: { units: { select: { id: true, number: true, floor: true, isOccupied: true } } },
    });
    if (!block) throw new NotFoundException('Bloque no encontrado');
    return block;
  }

  async update(id: string, dto: UpdateResidentialBlockDto) {
    await this.findOne(id);
    return this.prisma.residentialBlock.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.residentialBlock.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    return { message: 'Bloque eliminado correctamente' };
  }
}
