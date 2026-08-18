import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateResidentDto } from './dto/create-resident.dto';
import { UpdateResidentDto } from './dto/update-resident.dto';

const INCLUDE_RESIDENT = {
  unit: { select: { id: true, number: true, floor: true } },
};

@Injectable()
export class ResidentsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateResidentDto) {
    return this.prisma.resident.create({
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        phone: dto.phone,
        unitId: dto.unitId,
        propertyId: dto.propertyId,
      },
      include: INCLUDE_RESIDENT,
    });
  }


  async findAll(propertyId?: string, unitId?: string) {
    return this.prisma.resident.findMany({
      where: {
        deletedAt: null,
        ...(propertyId ? { propertyId } : {}),
        ...(unitId ? { unitId } : {}),
      },
      include: INCLUDE_RESIDENT,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const resident = await this.prisma.resident.findFirst({
      where: { id, deletedAt: null },
      include: {
        ...INCLUDE_RESIDENT,
        pets: { where: { deletedAt: null } },
        vehicles: { where: { deletedAt: null } },
      },
    });
    if (!resident) throw new NotFoundException('Residente no encontrado');
    return resident;
  }

  async update(id: string, dto: UpdateResidentDto) {
    await this.findOne(id);
    return this.prisma.resident.update({
      where: { id },
      data: dto,
      include: INCLUDE_RESIDENT,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.resident.update({
      where: { id },
      data: { deletedAt: new Date(), isActive: false, endDate: new Date() },
    });
    return { message: 'Residente eliminado correctamente' };
  }
}
