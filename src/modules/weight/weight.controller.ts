import { Controller, Post, Get, Body } from '@nestjs/common';
import { WeightService } from './weight.service';
import { LogWeightDto } from './dto/log-weight.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../auth/strategies/jwt.strategy';
import { WeightLog } from '@prisma/client';

@Controller('weight')
export class WeightController {
  constructor(private readonly weightService: WeightService) {}

  @Post()
  async logWeight(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: LogWeightDto,
  ): Promise<WeightLog> {
    return await this.weightService.logWeight(user.profileId, dto);
  }

  @Get('history')
  async getHistory(
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<WeightLog[]> {
    return await this.weightService.getHistory(user.profileId);
  }
}
