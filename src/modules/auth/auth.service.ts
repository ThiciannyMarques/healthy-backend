import {
  Injectable,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { SocialLoginDto } from './dto/social-login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { MailService } from '../mail/mail.service';
import * as argon2 from 'argon2';
import { randomUUID } from 'crypto';
import { User, Profile } from '@prisma/client';

export interface AuthResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
    profile: {
      id: string;
      name: string;
      streakDays: number;
      currentXp: number;
    };
  };
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthResponse> {
    const passwordHash = await argon2.hash(dto.password);
    const user = await this.usersService.create(
      dto.email,
      passwordHash,
      dto.name,
    );

    if (!user.profile) {
      throw new InternalServerErrorException(
        'Erro interno ao gerar o perfil do usuário.',
      );
    }

    return this.generateAuthResponse(user);
  }

  async login(dto: LoginDto): Promise<AuthResponse> {
    const user = await this.usersService.findByEmail(dto.email);

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    const isPasswordValid = await argon2.verify(
      user.passwordHash,
      dto.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    if (!user.profile) {
      throw new UnauthorizedException(
        'Este utilizador não possui um perfil ativo.',
      );
    }

    return this.generateAuthResponse(user as User & { profile: Profile });
  }

  async socialLogin(dto: SocialLoginDto): Promise<AuthResponse> {
    let user = await this.usersService.findByEmail(dto.email);

    if (!user) {
      const randomPassword = randomUUID() + randomUUID();
      const passwordHash = await argon2.hash(randomPassword);

      const defaultName =
        dto.name ||
        (dto.provider === 'apple' ? 'Usuário Apple' : 'Usuário Convidado');

      user = await this.usersService.create(
        dto.email,
        passwordHash,
        defaultName,
      );
    }

    if (!user.profile) {
      throw new UnauthorizedException(
        'Este utilizador não possui um perfil ativo.',
      );
    }

    return this.generateAuthResponse(user as User & { profile: Profile });
  }

  async forgotPassword(dto: ForgotPasswordDto): Promise<{ message: string }> {
    const user = await this.usersService.findByEmail(dto.email);

    if (user) {
      const token = Math.floor(100000 + Math.random() * 900000).toString();
      const expires = new Date();
      expires.setHours(expires.getHours() + 1);

      await this.usersService.updateResetToken(user.id, token, expires);
      await this.mailService.sendResetPasswordEmail(user.email, token);
    }

    return {
      message:
        'Se o e-mail estiver cadastrado, um token de redefinição foi enviado.',
    };
  }

  async resetPassword(dto: ResetPasswordDto): Promise<{ message: string }> {
    const user = await this.usersService.findByResetToken(dto.token);

    if (!user) {
      throw new UnauthorizedException('Token inválido ou expirado.');
    }

    const newPasswordHash = await argon2.hash(dto.newPassword);
    await this.usersService.updatePassword(user.id, newPasswordHash);

    return { message: 'Senha redefinida com sucesso!' };
  }

  private generateAuthResponse(
    user: User & { profile: Profile },
  ): AuthResponse {
    const payload = {
      sub: user.id,
      email: user.email,
      profileId: user.profile.id,
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        profile: {
          id: user.profile.id,
          name: user.profile.name,
          streakDays: user.profile.streakDays,
          currentXp: user.profile.currentXp,
        },
      },
    };
  }
}
