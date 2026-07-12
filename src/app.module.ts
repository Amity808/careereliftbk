import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { validateEnv } from './config/env.validations';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { RedisModule } from './redis/redis.module';
import { AuthModule } from './modules/auth/auth.module';
import { OnboardingModule } from './modules/onboarding/onboarding.module';
import { QuestionModule } from './modules/questions/questions.module';
import { CompaniesModule } from './modules/companies/companies.module';
import { StreakModule } from './modules/streaks/streaks.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { ChallengesModule } from './modules/challenges/challenges.module';
import { DesignsModule } from './modules/designs/designs.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // envFilePath: ".env",
      validate: validateEnv,
    }),
    DatabaseModule,
    RedisModule,
    AuthModule,
    OnboardingModule,
    QuestionModule,
    CompaniesModule,
    StreakModule,
    DashboardModule,
    ChallengesModule,
    DesignsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
