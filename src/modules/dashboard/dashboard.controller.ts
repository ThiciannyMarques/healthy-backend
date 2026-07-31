import {
  Controller,
  Get,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../auth/strategies/jwt.strategy';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; // Adicionado

@Controller('dashboard')
@UseGuards(JwtAuthGuard) // <-- A proteção obrigatória
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('summary')
  async getSummary(@CurrentUser() user: AuthenticatedUser) {
    // Trava defensiva para evitar o crash (erro 500)
    if (!user || !user.profileId) {
      throw new UnauthorizedException(
        'Sessão inválida ou usuário não encontrado.',
      );
    }
    return await this.dashboardService.getHomeSummary(user.profileId);
  }
}
