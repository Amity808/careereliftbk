import { Injectable, Inject } from '@nestjs/common';
import { DRIZZLE_PROVIDER } from 'src/database/database.module';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from "../../database/schema"
import { OnboardingDto } from './dto/onboarding.dto';


@Injectable()
export class OnboardingService {
    constructor(
        @Inject(DRIZZLE_PROVIDER)
        private db: NodePgDatabase<typeof schema>,
    ) {}

    async saveProfile(userId: string, onboardingDto: OnboardingDto) {
        await this.db.insert(schema.onboardingProfiles)
        .values({
            userId,
        career: onboardingDto.career,
        experienceLevel: onboardingDto.experienceLevel,
        goal: onboardingDto.goal,
        dailyFrequency: onboardingDto.dailyFrequency,
        })
        .onConflictDoUpdate({
            target: schema.onboardingProfiles.userId,
            set: {
                career: onboardingDto.career as any,
          experienceLevel: onboardingDto.experienceLevel,
          goal: onboardingDto.goal,
          dailyFrequency: onboardingDto.dailyFrequency,
          updatedAt: new Date(),
            }
        });
        return {
            message: 'Onboarding complete'
        };
    }
}