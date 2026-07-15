import { IsNumber, IsISO8601, Min } from 'class-validator';

export class LogWeightDto {
  @IsNumber({}, { message: 'O peso deve ser um número válido.' })
  @Min(1, { message: 'O peso deve ser maior que 0.' })
  weightKg: number;

  @IsISO8601(
    { strict: true },
    { message: 'A data deve estar no formato ISO-8601 válido.' },
  )
  loggedAt: string;
}
