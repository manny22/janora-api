import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface DashboardMetrics {
  totalResidents: number;
  totalVehicles: number;
  totalPets: number;
  totalVisitors: number;
  activeResidents: number;
  recentAccessCount: number;
}

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async getDashboardMetrics(propertyId: string): Promise<DashboardMetrics> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [totalResidents, totalVehicles, totalPets, totalVisitors, activeResidents, recentAccessCount] =
      await Promise.all([
        this.prisma.resident.count({
          where: { propertyId, deletedAt: null },
        }),
        this.prisma.vehicle.count({
          where: { propertyId, deletedAt: null },
        }),
        this.prisma.pet.count({
          where: { propertyId, deletedAt: null },
        }),
        this.prisma.visitor.count({
          where: { propertyId, deletedAt: null },
        }),
        this.prisma.resident.count({
          where: { propertyId, isActive: true, deletedAt: null },
        }),
        this.prisma.accessLog.count({
          where: { propertyId, createdAt: { gte: thirtyDaysAgo } },
        }),
      ]);

    return {
      totalResidents,
      totalVehicles,
      totalPets,
      totalVisitors,
      activeResidents,
      recentAccessCount,
    };
  }

  async getAccessLogs(propertyId: string, dateFrom: Date, dateTo: Date) {
    return this.prisma.accessLog.findMany({
      where: {
        propertyId,
        createdAt: {
          gte: dateFrom,
          lte: dateTo,
        },
      },
      include: {
        visitor: true,
        resident: true,
        vehicle: true,
        pet: true,
        guard: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }

  async getActiveResidents(propertyId: string) {
    return this.prisma.resident.findMany({
      where: {
        propertyId,
        isActive: true,
        deletedAt: null,
      },
      include: {
        unit: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getRegisteredVehicles(propertyId: string) {
    return this.prisma.vehicle.findMany({
      where: {
        propertyId,
        isActive: true,
        deletedAt: null,
      },
      include: {
        resident: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getRegisteredPets(propertyId: string) {
    return this.prisma.pet.findMany({
      where: {
        propertyId,
        isActive: true,
        deletedAt: null,
      },
      include: {
        resident: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getFrequentVisitors(propertyId: string, dateFrom: Date, dateTo: Date) {
    const logs = await this.prisma.accessLog.findMany({
      where: {
        propertyId,
        visitorId: { not: null },
        createdAt: {
          gte: dateFrom,
          lte: dateTo,
        },
      },
      include: {
        visitor: true,
      },
    });

    const visitorMap = new Map<string, { visitor: any; visitCount: number }>();

    logs.forEach((log) => {
      if (log.visitor) {
        const key = log.visitor.id;
        if (visitorMap.has(key)) {
          const entry = visitorMap.get(key)!;
          entry.visitCount += 1;
        } else {
          visitorMap.set(key, {
            visitor: log.visitor,
            visitCount: 1,
          });
        }
      }
    });

    return Array.from(visitorMap.values())
      .sort((a, b) => b.visitCount - a.visitCount)
      .slice(0, 10);
  }
}
