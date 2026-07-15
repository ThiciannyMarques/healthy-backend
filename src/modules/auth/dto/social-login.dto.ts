import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsEnum,
  IsOptional,
} from 'class-validator';

export class SocialLoginDto {
  @IsEnum(['google', 'apple'], {
    message: 'O provedor deve ser google ou apple.',
  })
  @IsNotEmpty()
  provider: 'google' | 'apple';

  @IsString()
  @IsNotEmpty({ message: 'O ID do provedor é obrigatório.' })
  providerId: string;

  @IsEmail({}, { message: 'E-mail inválido.' })
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsOptional()
  name?: string;
}
