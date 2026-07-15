import {
  IsString,
  IsNotEmpty,
  IsInt,
  Min,
  Matches,
  IsOptional,
} from 'class-validator';

export class CreateMedicationDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome do medicamento é obrigatório.' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'A dosagem é obrigatória (ex: 1 comprimido, 500mg).' })
  dosage: string;

  @IsInt()
  @Min(0, { message: 'O stock não pode ser negativo.' })
  stockCount: number;

  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'O horário deve estar no formato HH:MM (ex: 08:00, 22:30).',
  })
  timeOfDay: string;

  @IsString()
  @IsOptional()
  color?: string;

  @IsString()
  @IsOptional()
  icon?: string;

  @IsString()
  @IsOptional()
  frequency?: string;
}
