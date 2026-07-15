import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { ExportService } from './export.service';
import { ExportController } from './export.controller';

@Module({
  controllers: [ExportController],
  providers: [UsersService, ExportService],
  exports: [UsersService],
})
export class UsersModule {}
