import { Controller, Post, Get, Body, Param, Patch } from '@nestjs/common';
import { MedicationsService } from './medications.service';
import { CreateMedicationDto } from './dto/create-medication.dto';
import { LogMedicationDto } from './dto/log-medication.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../auth/strategies/jwt.strategy';
import { Medication, MedicationLog } from '@prisma/client';

@Controller('medications')
export class MedicationsController {
  constructor(private readonly medicationsService: MedicationsService) {}

  @Post()
  async create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateMedicationDto,
  ): Promise<Medication> {
    return await this.medicationsService.create(user.profileId, dto);
  }

  @Get()
  async findAll(@CurrentUser() user: AuthenticatedUser): Promise<Medication[]> {
    return await this.medicationsService.findAllActive(user.profileId);
  }

  @Patch(':id/deactivate')
  async deactivate(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') medicationId: string,
  ): Promise<Medication> {
    return await this.medicationsService.deactivate(
      user.profileId,
      medicationId,
    );
  }

  @Post(':id/log')
  async logConsumption(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') medicationId: string,
    @Body() dto: LogMedicationDto,
  ): Promise<MedicationLog> {
    return await this.medicationsService.logConsumption(
      user.profileId,
      medicationId,
      dto,
    );
  }
}
