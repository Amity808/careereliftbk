import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { DRIZZLE_PROVIDER } from 'src/database/database.module';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../../database/schema';
import { eq, and } from 'drizzle-orm';
import { SubmissionDto } from './dto/submission.dto';

@Injectable()
export class ChallengesService {
  constructor(
    @Inject(DRIZZLE_PROVIDER)
    private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  async getChallenges(userId: string, category?: string, difficulty?: string, status?: string) {
    // 1. Fetch all challenges
    const challenges = await this.db.query.designChallenges.findMany();

    // 2. Fetch all user submissions
    const submissions = await this.db.query.challengeSubmissions.findMany({
      where: eq(schema.challengeSubmissions.userId, userId),
    });

    const submissionMap = new Map(submissions.map((s) => [s.challengeId, s]));

    // 3. Map and Filter
    let mapped = challenges.map((c) => {
      const sub = submissionMap.get(c.id);
      return {
        id: c.id,
        title: c.title,
        category: c.category,
        difficulty: c.difficulty,
        estimatedTimeMins: c.estimatedTimeMins,
        imageUrl: c.imageUrl,
        submissionStatus: sub ? sub.status : null,
      };
    });

    // Apply filtering
    if (category && category !== 'all') {
      mapped = mapped.filter((item) => item.category === category);
    }
    if (difficulty && difficulty !== 'all') {
      mapped = mapped.filter((item) => item.difficulty === difficulty);
    }
    if (status && status !== 'all') {
      mapped = mapped.filter((item) => {
        if (status === 'completed') return item.submissionStatus === 'completed';
        if (status === 'in_progress') return item.submissionStatus === 'draft';
        if (status === 'not_started') return item.submissionStatus === null;
        return true;
      });
    }

    return mapped;
  }

  async getChallengeDetail(userId: string, challengeId: string) {
    const challenge = await this.db.query.designChallenges.findFirst({
      where: eq(schema.designChallenges.id, challengeId),
    });

    if (!challenge) {
      throw new NotFoundException('Challenge not found');
    }

    const submission = await this.db.query.challengeSubmissions.findFirst({
      where: and(
        eq(schema.challengeSubmissions.userId, userId),
        eq(schema.challengeSubmissions.challengeId, challengeId),
      ),
    });

    return {
      id: challenge.id,
      title: challenge.title,
      description: challenge.description,
      difficulty: challenge.difficulty,
      category: challenge.category,
      estimatedTimeMins: challenge.estimatedTimeMins,
      specs: challenge.specs,
      imageUrl: challenge.imageUrl,
      starterCode: challenge.starterCode,
      referenceSolutionCode: challenge.referenceSolutionCode,
      userSubmission: submission
        ? {
            userCode: submission.userCode,
            status: submission.status,
          }
        : null,
    };
  }

  async submitChallenge(userId: string, challengeId: string, dto: SubmissionDto) {
    const challenge = await this.db.query.designChallenges.findFirst({
      where: eq(schema.designChallenges.id, challengeId),
    });

    if (!challenge) {
      throw new NotFoundException('Challenge not found');
    }

    await this.db
      .insert(schema.challengeSubmissions)
      .values({
        userId,
        challengeId,
        userCode: dto.userCode,
        status: dto.status as any,
      })
      .onConflictDoUpdate({
        target: [schema.challengeSubmissions.userId, schema.challengeSubmissions.challengeId],
        set: {
          userCode: dto.userCode,
          status: dto.status as any,
          updatedAt: new Date(),
        },
      });

    return {
      status: 'success',
      message: 'Submission updated successfully.',
    };
  }
}
