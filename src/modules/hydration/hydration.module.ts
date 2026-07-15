import { Module } from '@nestjs/common';
import { HydrationService } from './hydration.service';
import { HydrationController } from './hydration.controller';

@Module({
  controllers: [HydrationController],
  providers: [HydrationService],
})
export class HydrationModule {}
