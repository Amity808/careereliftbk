// src/database/seed.ts
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';
import * as dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool, { schema });

async function seed() {
  console.log('🌱 Starting database seeding...');

  // 1. Insert Mock Companies
  console.log('Inserting companies...');
  const [flutterwave, paystack, google] = await db
    .insert(schema.compaines)
    .values([
      {
        name: 'Flutterwave',
        slug: 'flutterwave',
        industry: 'Fintech',
      },
      {
        name: 'Paystack',
        slug: 'paystack',
        industry: 'Fintech',
      },
      {
        name: 'Google',
        slug: 'google',
        industry: 'Search & Cloud',
      },
    ])
    .onConflictDoNothing()
    .returning();

  // 2. Insert Mock Questions
  console.log('Inserting questions...');
  await db
    .insert(schema.questions)
    .values([
      {
        title: 'Explain React Reconciliation',
        contentMarkdown: 'How does React update the DOM in modern versions? Write down your understanding of Fibers, the Commit phase, and Diffing.',
        category: 'technical', // Changed from 'frontend'
        difficulty: 'medium',
        estimatedTimeMins: 10,
        sampleAnswer: 'React uses a virtual representation of the DOM...',
        keyConcepts: ['Virtual DOM', 'Fibers', 'Reconciliation Algorithm'],
        commonMistakes: ['Assuming the entire DOM is re-rendered on every state change'],
      },
      {
        title: 'Explain useMemo vs useCallback',
        contentMarkdown: 'Explain the difference between useMemo and useCallback. When should you use each, and what are the performance trade-offs?',
        category: 'technical', // Changed from 'frontend'
        difficulty: 'easy',
        estimatedTimeMins: 8,
        sampleAnswer: 'useMemo caches a computed value, while useCallback caches the function instance itself...',
        keyConcepts: ['Memoization', 'Referential Equality', 'Render Optimization'],
        commonMistakes: ['Wrapping every single function and variable in hooks without profiling'],
      },
      {
        title: 'Design a Distributed Rate Limiter',
        contentMarkdown: 'Design an API Rate Limiter that can handle millions of requests per day. Explain the algorithms (e.g. Token Bucket, Sliding Window) and storage choices.',
        category: 'system_design', // Changed from 'backend'
        difficulty: 'hard',
        estimatedTimeMins: 20,
        sampleAnswer: 'A distributed rate limiter can be designed using Redis for fast, atomic updates...',
        keyConcepts: ['Token Bucket', 'Redis Caching', 'Atomic Operations'],
        commonMistakes: ['Failing to account for race conditions in concurrent environments'],
      },
    ])
    .onConflictDoNothing();

  console.log('✅ Seeding completed successfully!');
  await pool.end();
}

seed().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
