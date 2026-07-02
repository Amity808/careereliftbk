import { Injectable, Inject, NotFoundException } from '@nestjs/common'
import { DRIZZLE_PROVIDER } from 'src/database/database.module'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import * as schema from '../../database/schema';
import { eq, and, sql, notInArray } from 'drizzle-orm';
import { SubmitReponseDto } from './dto/submit-response.dto';

@Injectable()
export class QuestionService {
    constructor(
        @Inject(DRIZZLE_PROVIDER)
        private db: NodePgDatabase<typeof schema>,
    ) {}


    async getQuestion(category?: any, difficulty?: any) {
        const conditions: any = [];
        if (category) conditions.push(eq(schema.questions.category, category));
        if (difficulty) conditions.push(eq(schema.questions.difficulty, difficulty));

        return this.db.query.questions.findMany({
            where: conditions.length > 0 ? and(...conditions) : undefined,
            columns: {
                id: true,
                title: true,
                category: true,
                difficulty: true,
                estimatedTimeMins: true
            }
        })

    }

    async getDailyQuestions(userId: string) {
        const profile = await 
        this.db.query.onboardingProfiles.findFirst({
            where: eq(schema.onboardingProfiles.userId, userId),
        });
        if(!profile) {
            return {
                count: 0,
                questions: []
            }
        }

        
    // B. Fetch questions that fit the user's career path & level
    // (In an advanced algorithm, you'd check already-completed questions to avoid repeats)
    const dailyList = await this.db.query.questions.findMany({
        where: eq(schema.questions.category, profile.career as any),
        limit: profile.dailyFrequency
    });
    return {
        count: dailyList.length,
        questions: dailyList,
    };
    }

    async getQuestionDetail(questionId: string, userId: string) {
        const question = await this.db.query.questions.findFirst({
            where: eq(schema.questions.id, questionId), 
        });

        // check if the user has an active draft or submitted response
        const responseRecord = await this.db.query.userResponse.findFirst({
            where: and(
                eq(schema.userResponse.userId, userId),
                eq(schema.userResponse.questionId, questionId)
            ),
        });

        // check if user bookmarked it 
        const bookmarkRecord = await this.db.query.bookmarks.findFirst({
            where: and(
                eq(schema.bookmarks.userId, userId),
                eq(schema.bookmarks.questionId, questionId)
            ),
        });

        return {
            ...question,
            isBookmarked: !!bookmarkRecord,
            draftResponse: responseRecord?.status == 'draft' ? responseRecord.userText : null,
        };
    }

    // save response draft or final submit 
    async submitResponse(questionId: string, userId: string, dto: SubmitReponseDto) {
        const { responseText, status } = dto;

        // upsert user response 
        await this.db.insert(schema.userResponse)
        .values({
            userId, questionId, userText: responseText,
            status: status as any,
            submittedAt: status === 'submitted' ? new Date() : null
        })
        .onConflictDoUpdate({
            target: [ schema.userResponse.userId, 
                schema.userResponse.questionId],
                set: {
                    userText: responseText,
                    status: status as any,
                    submittedAt: status == 'submitted' ? new Date() : null,
                    updatedAt: new Date(),
                },
        });

        // if final submission, streak login triggers here: 
        let streakUpdated: any = null;
        if (status == 'submitted') {
            // streak validation logic will call StreaksService inphase 9 
            streakUpdated = { message: 'Streak checks processed'};
        }

        return {
            status: 'sucess',
            message: status == 'submitted' ? 'Response submitted.' : 'Draft save',
            streakUpdated, 
        }
    }

    async addBookmark(questionId: string, userId: string) {
        await this.db.insert(schema.bookmarks)
        .values({
            userId, questionId
        }).onConflictDoNothing();
        return { isBookmarked: true };
    }

    async removeBookmark(questionId: string, userId: string) {
        await this.db.delete(schema.bookmarks)
        .where(
            and(
                eq(schema.bookmarks.userId, userId),
                eq(schema.bookmarks.questionId, questionId),
            ),
        );
        return { isBookMarked: false };
    }
    
}