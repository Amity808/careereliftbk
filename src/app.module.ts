import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { validateEnv } from './config/env.validations';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { RedisModule } from './redis/redis.module';
import { AuthModule } from './modules/auth/auth.module';
import { OnboardingModule } from './modules/onboarding/onboarding.module';

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
    OnboardingModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
