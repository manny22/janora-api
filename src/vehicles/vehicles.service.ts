import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';

@Injectable()
export class VehiclesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateVehicleDto) {
    const existing = await this.prisma.vehicle.findUnique({
      where: { propertyId_plate: { propertyId: dto.propertyId, plate: dto.plate } },
    });
    if (existing) throw new ConflictException('Esta placa ya está registrada en la propiedad');

    return this.prisma.vehicle.create({ data: dto });
  }

  async findAll(propertyId?: string, residentId?: string) {
    return this.prisma.vehicle.findMany({
      where: {
        deletedAt: null,
        ...(propertyId ? { propertyId } : {}),
        ...(residentId ? { residentId } : {}),
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const vehicle = await this.prisma.vehicle.findFirst({ where: { id, deletedAt: null } });
    if (!vehicle) throw new NotFoundException('Vehículo no encontrado');
    return vehicle;
  }

  async update(id: string, dto: UpdateVehicleDto) {
    const vehicle = await this.findOne(id);

    const { residentId, propertyId, ...data } = dto;
    if (residentId !== undefined && residentId !== vehicle.residentId) {
      throw new BadRequestException('No se puede cambiar el residente de un vehículo existente');
    }
    if (propertyId !== undefined && propertyId !== vehicle.propertyId) {
      throw new BadRequestException('No se puede cambiar la propiedad de un vehículo existente');
    }

    return this.prisma.vehicle.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.vehicle.update({
      where: { id },
      data: { deletedAt: new Date(), isActive: false },
    });
    return { message: 'Vehículo eliminado correctamente' };
  }
}
