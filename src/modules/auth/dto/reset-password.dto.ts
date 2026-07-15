import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty({ message: 'O token é obrigatório.' })
  token: string;

  @IsString({ message: 'A senha deve ser uma string.' })
  @MinLength(8, { message: 'A nova senha deve ter no mínimo 8 caracteres.' })
  newPassword: string;
}
