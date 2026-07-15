import { Controller, Get, Header } from '@nestjs/common';
import { ExportService } from './export.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../auth/strategies/jwt.strategy';

@Controller('users/export')
export class ExportController {
  constructor(private readonly exportService: ExportService) {}

  @Get()
  @Header('Content-Type', 'application/json')
  @Header(
    'Content-Disposition',
    'attachment; filename="meus_dados_healthy.json"',
  )
  async exportData(@CurrentUser() user: AuthenticatedUser) {
    return await this.exportService.exportUserData(user.profileId);
  }
}
