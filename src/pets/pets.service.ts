import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';

@Injectable()
export class PetsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreatePetDto) {
    return this.prisma.pet.create({ data: dto });
  }

  async findAll(propertyId?: string, residentId?: string) {
    return this.prisma.pet.findMany({
      where: {
        deletedAt: null,
        ...(propertyId ? { propertyId } : {}),
        ...(residentId ? { residentId } : {}),
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const pet = await this.prisma.pet.findFirst({ where: { id, deletedAt: null } });
    if (!pet) throw new NotFoundException('Mascota no encontrada');
    return pet;
  }

  async update(id: string, dto: UpdatePetDto) {
    const pet = await this.findOne(id);

    const { residentId, propertyId, ...data } = dto;
    if (residentId !== undefined && residentId !== pet.residentId) {
      throw new BadRequestException('No se puede cambiar el residente de una mascota existente');
    }
    if (propertyId !== undefined && propertyId !== pet.propertyId) {
      throw new BadRequestException('No se puede cambiar la propiedad de una mascota existente');
    }

    return this.prisma.pet.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.pet.update({
      where: { id },
      data: { deletedAt: new Date(), isActive: false },
    });
    return { message: 'Mascota eliminada correctamente' };
  }
}
