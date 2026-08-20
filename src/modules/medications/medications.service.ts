import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateMedicationDto } from './dto/create-medication.dto';
import { LogMedicationDto } from './dto/log-medication.dto';
import { Medication, MedicationLog } from '@prisma/client';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class MedicationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(
    profileId: string,
    dto: CreateMedicationDto,
  ): Promise<Medication> {
    const stock = dto.stockCount ?? 0;
    const time = dto.timeOfDay || '08:00';
    const activeStatus = dto.active ?? dto.isActive ?? true;

    return await this.prisma.medication.create({
      data: {
        profileId,
        name: dto.name,
        dosage: dto.dosage,
        stockCount: stock,
        timeOfDay: time,
        color: dto.color || '#E24A5C',
        icon: dto.icon || 'pill',
        frequency: dto.frequency || 'DAILY',
        isActive: activeStatus,
      },
    });
  }

  async findAllActive(profileId: string): Promise<Medication[]> {
    return await this.prisma.medication.findMany({
      where: {
        profileId,
        isActive: true,
        deletedAt: null,
      },
      orderBy: { timeOfDay: 'asc' },
    });
  }

  async deactivate(
    profileId: string,
    medicationId: string,
  ): Promise<Medication> {
    const medication = await this.prisma.medication.findFirst({
      where: { id: medicationId, profileId, deletedAt: null },
    });

    if (!medication) {
      throw new NotFoundException('Medicamento não encontrado.');
    }

    return await this.prisma.medication.update({
      where: { id: medicationId },
      data: { isActive: false },
    });
  }

  async logConsumption(
    profileId: string,
    medicationId: string,
    dto: LogMedicationDto,
  ): Promise<MedicationLog> {
    const medication = await this.prisma.medication.findFirst({
      where: { id: medicationId, profileId, isActive: true, deletedAt: null },
    });

    if (!medication) {
      throw new NotFoundException('Medicamento ativo não encontrado.');
    }

    const log = await this.prisma.$transaction(async (tx) => {
      const createdLog = await tx.medicationLog.create({
        data: {
          medicationId,
          profileId,
          status: dto.status,
          loggedAt: new Date(dto.loggedAt),
        },
      });

      if (dto.status === 'TAKEN' && medication.stockCount > 0) {
        await tx.medication.update({
          where: { id: medicationId },
          data: { stockCount: medication.stockCount - 1 },
        });
      } else if (dto.status === 'TAKEN' && medication.stockCount === 0) {
        throw new BadRequestException(
          'Stock insuficiente para registar a toma.',
        );
      }

      return createdLog;
    });

    if (dto.status === 'TAKEN') {
      this.eventEmitter.emit('habit.logged', {
        profileId,
        action: 'medication_taken',
      });
    }

    return log;
  }

  async findLogs(
    profileId: string,
    startDate?: string,
    endDate?: string,
  ): Promise<MedicationLog[]> {
    const where: any = { profileId };

    if (startDate) {
      where.loggedAt = { gte: new Date(startDate) };
    }
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      where.loggedAt = { ...where.loggedAt, lte: end };
    }

    return await this.prisma.medicationLog.findMany({
      where,
      orderBy: { loggedAt: 'desc' },
      take: startDate || endDate ? undefined : 30,
      include: {
        medication: {
          select: {
            name: true,
            dosage: true,
            color: true,
            icon: true,
          },
        },
      },
    });
  }
}
