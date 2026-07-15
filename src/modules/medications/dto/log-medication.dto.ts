import { IsEnum, IsISO8601, IsNotEmpty } from 'class-validator';
import { MedicationStatus } from '@prisma/client';

export class LogMedicationDto {
  @IsEnum(MedicationStatus, {
    message: 'Status inválido. Use TAKEN, SKIPPED ou MISSED.',
  })
  @IsNotEmpty()
  status: MedicationStatus;

  @IsISO8601(
    { strict: true },
    { message: 'A data deve ser num formato ISO-8601 válido.' },
  )
  @IsNotEmpty()
  loggedAt: string;
}
