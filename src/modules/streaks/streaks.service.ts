import { Injectable, Inject } from "@nestjs/common";
import { DRIZZLE_PROVIDER } from "src/database/database.module";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import * as schema from "../../database/schema";
import { eq, and } from 'drizzle-orm';

@Injectable()
export class StreaksService {
    constructor(
        @Inject(DRIZZLE_PROVIDER)
        private db: NodePgDatabase<typeof schema>
    ) {}

    // gegt streak details & badges for the dashboard
    async getStreakInfo(userId: string) {
        const streak = await this.db.query.streakHistories.findFirst({
            where: eq(schema.streakHistories.userId, userId),
        });

        const badges = await this.db.query.userBadges.findMany({
            where: eq(schema.userBadges.userId, userId)
        });

        return {
            streak: {
                currentStreak: streak?.currentStreak ?? 0,
                longestStreak: streak?.longestStreak ?? 0,
                lastActivityDate: streak?.lastActivityDate ?? null,
                questionsCompletedToday: streak?.questionsCompletedToday ?? 0
            },
            badges
        }
    }

    // 2. main timezone-aware calculations called when response is submitted
    async updateStreak(userId: string, userTimezone: string) {
        const profile = await this.db.query.onboardingProfiles.findFirst({
            where: eq(schema.onboardingProfiles.userId, userId),
        });
        const dailyTarget = profile?.dailyFrequency ?? 5;

        // get user's current streak history 
        let streak = await this.db.query.streakHistories.findFirst({
            where: eq(schema.streakHistories.userId, userId),
        });

        if(!streak) {
            // first time record creation
            const [newStreak] = await this.db.insert(schema.streakHistories)
            .values({
                userId, currentStreak: 0,
                longestStreak: 0,
                questionsCompletedToday: 0
            })
            .returning();
            streak = newStreak;
        }
        // get today's local data based on user's timezone
        const now = new Date();
        const localDateString = now.toLocaleDateString('en-US',
            {
                timeZone: userTimezone
            }
        )

        const localParts = localDateString.split('/');
        const userTodayStr = `${localParts[2]}-${localParts[0].padStart(2, '0')}-${localParts[1].padStart(2, '0')}`; // "YYYY-MM-DD"

         // Increment completed questions for today
        let completedToday = streak.questionsCompletedToday + 1;
        let currentStreak = streak.currentStreak;
        let longestStreak = streak.longestStreak;
        

        if (streak.lastActivityDate !== userTodayStr) {
            completedToday = 1;
        }

        // check if they just hit their daily target 
        if(completedToday == dailyTarget) {
            const lastActvity = streak.lastActivityDate;

            if (!lastActvity) {
                currentStreak = 1;
            } else {
                const lastDate = new Date(lastActvity);
                const todayDate = new Date(userTodayStr);
                const diffTime = Math.abs(todayDate.getTime() - lastDate.getTime());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                if (diffDays === 1) {
                    currentStreak +=1;
                } else if(diffDays > 1) {
                    // broke the streak resent to 1
                    currentStreak = 1;
                }
            }

            // track record
            if(currentStreak > longestStreak) {
                longestStreak = currentStreak;
            }

            await this.checkAndAwardBadges(userId, currentStreak);
        }

        // save updated stats to DB
        await this.db.update(schema.streakHistories)
        .set({
            currentStreak,
            longestStreak,
            lastActivityDate: userTodayStr,
            questionsCompletedToday: completedToday,
            updatedAt: new Date()
        })
        .where(eq(schema.streakHistories.userId, userId));

        return {
            currentStreak,
            questionCompletedToday: completedToday,
            dailyTagetMet:  completedToday >= dailyTarget
        };
    }

    // helper award badges when user hits milestone
    private async checkAndAwardBadges(userId: string, currentStreak: number) {
        const milestones = [
            { day: 7, type: 'badge_7_day' },
      { day: 30, type: 'badge_30_day' },
      { day: 90, type: 'badge_90_day' },
      { day: 180, type: 'badge_180_day' },
      { day: 365, type: 'badge_365_day' },
        ];

        // for (const mil)
        for (const milestone of milestones) {
            if (currentStreak == milestone.day) {
                // check if badge already exists to prevent duplicate awards
                const existingBadge = await this.db.query.userBadges.findFirst({
                    where: and(
                        eq(schema.userBadges.userId, userId),
                        eq(schema.userBadges.badgeType, milestone.type),
                    ),
                });
                if(!existingBadge) {
                    await this.db.insert(schema.userBadges).values({
                        userId, badgeType: milestone.type
                    });
                }
            }
        }
    }
}