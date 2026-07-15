import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateMedicationDto } from './dto/create-medication.dto';
import { LogMedicationDto } from './dto/log-medication.dto';
import { Medication, MedicationLog } from '@prisma/client';

@Injectable()
export class MedicationsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    profileId: string,
    dto: CreateMedicationDto,
  ): Promise<Medication> {
    return await this.prisma.medication.create({
      data: {
        profileId,
        name: dto.name,
        dosage: dto.dosage,
        stockCount: dto.stockCount,
        timeOfDay: dto.timeOfDay,
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

    return await this.prisma.$transaction(async (tx) => {
      const log = await tx.medicationLog.create({
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

      return log;
    });
  }
}
