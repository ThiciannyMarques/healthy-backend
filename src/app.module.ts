import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { MedicationsModule } from './modules/medications/medications.module';
import { HydrationModule } from './modules/hydration/hydration.module';
import { WeightModule } from './modules/weight/weight.module';
import { ExerciseModule } from './modules/exercise/exercise.module';
import { GamificationModule } from './modules/gamification/gamification.module';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    DatabaseModule,
    UsersModule,
    AuthModule,
    MedicationsModule,
    HydrationModule,
    WeightModule,
    ExerciseModule,
    GamificationModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
