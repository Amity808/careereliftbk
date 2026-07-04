import { Injectable, Inject } from "@nestjs/common";
import { DRIZZLE_PROVIDER } from "src/database/database.module";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import * as schema from "../../database/schema";
import { eq, desc } from 'drizzle-orm';


@Injectable()
export class DashboardService {
    constructor(
        @Inject(DRIZZLE_PROVIDER)
        private db: NodePgDatabase<typeof schema>,
    ) {}

    async getSummary(userId: string) {
        const user = await this.db.query.users.findFirst({
            where: eq(schema.users.id, userId),
        });

        const profile = await this.db.query.onboardingProfiles.findFirst({
            where: eq(schema.onboardingProfiles.userId, userId),
        });


        const streak = await this.db.query.streakHistories.findFirst({
            where: eq(schema.streakHistories.userId, userId)
        })
        
    // 4. Fetch the continue learning recommendation cards (sample questions matching their career)
        const careerCategory = profile?.career ?? 'technical';
        const continueLearning = await this.db.query.questions.findMany({
            where: eq(schema.questions.category, careerCategory as any), 
            limit: 2
        });
        // fetch community reports 
        const recentReports = await this.db.query.interviewReports.findMany({
            limit: 3,
            orderBy: [desc(schema.interviewReports.createdAt)]
        });
        return {
            user: {
                fullName: user?.fullName ?? 'Candidate',
                currentStreak: streak?.currentStreak ?? 0,
                questionsCompletedToday: streak?.questionsCompletedToday ?? 0,
                targetQuestionsToday: profile?.dailyFrequency ?? 5,
                readinessScore: 70,
            },
            continueLearning,
            recommendedTopics: [
                'System design scalability patterns',
                'Database index opptimization',
                `${profile?.career ?? 'Technical'} concepts`
            ],
            recentCompanyReports: recentReports,
        }
    }
}