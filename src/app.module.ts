import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter'; // <-- Importação adicionada
import { AppConfigModule } from './config/app-config.module';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { MedicationsModule } from './modules/medications/medications.module';
import { HydrationModule } from './modules/hydration/hydration.module';
import { WeightModule } from './modules/weight/weight.module';
import { ExerciseModule } from './modules/exercise/exercise.module';
import { GamificationModule } from './modules/gamification/gamification.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { ProfileModule } from './modules/profile/profile.module';
import { MailModule } from './modules/mail/mail.module';

@Module({
  imports: [
    AppConfigModule,
    DatabaseModule,
    EventEmitterModule.forRoot(), // <-- Módulo global de eventos inicializado aqui
    UsersModule,
    AuthModule,
    MedicationsModule,
    HydrationModule,
    WeightModule,
    ExerciseModule,
    GamificationModule,
    DashboardModule,
    ProfileModule,
    MailModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
