import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { User, Profile } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(
    email: string,
  ): Promise<(User & { profile: Profile | null }) | null> {
    return this.prisma.user.findUnique({
      where: { email, deletedAt: null },
      include: { profile: true },
    });
  }

  async findById(id: string): Promise<User & { profile: Profile | null }> {
    const user = await this.prisma.user.findUnique({
      where: { id, deletedAt: null },
      include: { profile: true },
    });

    if (!user) {
      throw new NotFoundException('Utilizador não encontrado.');
    }

    return user;
  }

  async create(
    email: string,
    passwordHash: string,
    name: string,
  ): Promise<User & { profile: Profile }> {
    const existingUser = await this.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('Este e-mail já está em uso.');
    }

    // Salvamos em uma variável antes de retornar
    const user = await this.prisma.user.create({
      data: {
        email,
        passwordHash,
        profile: {
          create: {
            name,
            timezone: 'America/Sao_Paulo', // Padrão MVP
          },
        },
      },
      include: {
        profile: true,
      },
    });

    // Afirmamos explicitamente o tipo, pois sabemos que a transação criou o Profile com sucesso
    return user as User & { profile: Profile };
  }
}
