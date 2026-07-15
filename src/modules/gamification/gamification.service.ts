import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class GamificationService {
  private readonly logger = new Logger(GamificationService.name);

  constructor(private readonly prisma: PrismaService) {}

  @OnEvent('habit.logged')
  async handleHabitLoggedEvent(payload: { profileId: string; action: string }) {
    const XP_REWARD = 10;

    try {
      await this.prisma.profile.update({
        where: { id: payload.profileId },
        data: {
          currentXp: {
            increment: XP_REWARD,
          },
        },
      });

      this.logger.log(
        `+${XP_REWARD} XP concedido ao perfil ${payload.profileId} (Ação: ${payload.action})`,
      );
    } catch (error) {
      this.logger.error(
        `Falha ao conceder XP para o perfil ${payload.profileId}`,
        error,
      );
    }
  }
}
