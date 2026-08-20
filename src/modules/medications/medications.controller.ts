import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Patch,
  UseGuards,
  Query,
} from '@nestjs/common';
import { MedicationsService } from './medications.service';
import { CreateMedicationDto } from './dto/create-medication.dto';
import { LogMedicationDto } from './dto/log-medication.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../auth/strategies/jwt.strategy';
import { Medication, MedicationLog } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { IsOptional, IsDateString } from 'class-validator';

class MedicationLogsQuery {
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}

@UseGuards(JwtAuthGuard)
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

  @Get('logs')
  async getLogs(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: MedicationLogsQuery,
  ): Promise<MedicationLog[]> {
    return await this.medicationsService.findLogs(
      user.profileId,
      query.startDate,
      query.endDate,
    );
  }
}
