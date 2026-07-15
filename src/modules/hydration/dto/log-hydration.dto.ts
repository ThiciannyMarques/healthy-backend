import { IsInt, IsISO8601, Min } from 'class-validator';

export class LogHydrationDto {
  @IsInt({ message: 'A quantidade deve ser um número inteiro.' })
  @Min(1, { message: 'A quantidade deve ser maior que 0.' })
  amountMl: number;

  @IsISO8601(
    { strict: true },
    { message: 'A data deve estar no formato ISO-8601 válido.' },
  )
  loggedAt: string;
}
