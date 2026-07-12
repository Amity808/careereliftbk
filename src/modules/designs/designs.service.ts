import { Injectable, Inject } from '@nestjs/common';
import { DRIZZLE_PROVIDER } from 'src/database/database.module';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../../database/schema';
import { eq, and, ilike, or } from 'drizzle-orm';

@Injectable()
export class DesignsService {
  constructor(
    @Inject(DRIZZLE_PROVIDER)
    private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  async getDesigns(category?: string, difficulty?: string, search?: string) {
    const conditions: any[] = [];

    if (category && category !== 'all') {
      conditions.push(eq(schema.figmaDesigns.category, category));
    }
    if (difficulty && difficulty !== 'all') {
      conditions.push(eq(schema.figmaDesigns.difficulty, difficulty as any));
    }
    if (search) {
      conditions.push(
        or(
          ilike(schema.figmaDesigns.title, `%${search}%`),
          ilike(schema.figmaDesigns.description, `%${search}%`),
        ),
      );
    }

    return this.db.query.figmaDesigns.findMany({
      where: conditions.length > 0 ? and(...conditions) : undefined,
      orderBy: (designs, { desc }) => [desc(designs.createdAt)],
    });
  }
}
