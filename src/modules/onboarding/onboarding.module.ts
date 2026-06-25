import { Module } from '@nestjs/common';
import { OnboardingService } from './onboarding.service';
import { OnbordingController } from './onboarding.controller';

@Module({
    controllers: [OnbordingController],
    providers: [OnboardingService]
})
export class OnboardingModule {}
