import { IsBoolean, IsISO8601 } from 'class-validator';

export class LogExerciseDto {
  @IsBoolean({ message: 'O valor deve ser verdadeiro ou falso.' })
  didExercise: boolean;

  @IsISO8601(
    { strict: true },
    { message: 'A data deve estar no formato ISO-8601 válido.' },
  )
  loggedAt: string;
}
