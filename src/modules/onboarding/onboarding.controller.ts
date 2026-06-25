import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common'
import { OnboardingDto } from './dto/onboarding.dto'
import { OnboardingService } from './onboarding.service'
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard'

@Controller('onboarding')
export class OnbordingController {
    constructor(private readonly onboardingService: OnboardingService) {}

    @Post()
    @UseGuards(JwtAuthGuard) // protect this route with JWT authentication
    async saveOnboarding(@Request() req: any, @Body() onboardingDto: OnboardingDto) {
        // re.user is set by the JwtStrategy
        const userId = req.user.id;
        return this.onboardingService.saveProfile(userId,onboardingDto);
    }

}