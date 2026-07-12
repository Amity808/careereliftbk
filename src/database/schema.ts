import { timeStamp } from "console";
import { pgTable
    ,uuid, varchar, text, timestamp, integer, boolean,
    date, jsonb, pgEnum, unique, primaryKey
 } from "drizzle-orm/pg-core";

 export const careerEnum = pgEnum("user_career_enum",
    ['frontend', 'backend', 'pm', 'hr', 'analyst']
 );

 export const experienceEnum = pgEnum('user_experince_enum', 
    ['entry', 'mid', 'senior', 'lead']);

export const goalEnum = pgEnum('user_goal_enum', 
    ['new_job', 'promotion', 'growth', 'leadership']);

export const categoryEnum = pgEnum('question_category_enum', 
    ['technical', 'behavioral', 'scenario', 'system_design', 'whiteboard', 'leadership']
);

export const difficultyEnum = pgEnum('question_difficulty_enum', 
    ['easy', 'medium', 'hard']
);

export const stageEnum = pgEnum('interview_stage_enum', 
    ['recruiter', 'technical', 'system_design', 'final']
);

export const outcomeEnum = pgEnum('interview_outcome_enum', 
    ['offer', 'rejected', 'pending']
);

export const responseStatusEnum = pgEnum('response_status_enum', 
    ['draft', 'submitted']
);


// 2. define tables 

export const users = pgTable('users', {
    id: uuid('id').primaryKey().defaultRandom(),
    email: varchar('email', { length: 255}).notNull(),
    passwordHash: varchar('password_hash', {length: 255}).notNull(),
    
    fullName: varchar('full_name', { length: 255 }),
    
    company: varchar('company', { length: 255 }),
    role: varchar('role', { length: 255 }),
    
    experienceYear: integer('experience_year').notNull().default(0),
    
    targetRole: varchar('target_role', { length: 255 }),
    
    
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull()
})

export const onboardingProfiles = pgTable('onboarding_profiles', {
    userId: uuid('user_id').primaryKey().references(() => users.id, {onDelete: 'cascade'}),
    career: careerEnum('career').notNull(),
    experienceLevel: experienceEnum('experience_level').notNull(),
    goal: goalEnum('goal').notNull(),
    dailyFrequency: integer('daily_frequency').default(5).notNull(),

    updatedAt: timestamp("updated_at", { withTimezone: true}).defaultNow().notNull()


})

export const questions = pgTable('questions', {
    id: uuid('id').primaryKey().defaultRandom(),
    title: varchar('title', { length: 500}).notNull(),
    contentMarkdown: text('content_markdown').notNull(),
    
    category: categoryEnum('category').notNull(),
    difficulty: difficultyEnum('difficulty').notNull(),
    estimatedTimeMins: integer('estimated_time_minutes').notNull(),
    sampleAnswer: text('sample_answer').notNull(),
    keyConcepts: jsonb('key_concepts').notNull(),

    commonMistakes: jsonb('common_mistakes').default([]).notNull(),
    created_at: timestamp("created_at", {withTimezone: true}).defaultNow().notNull(),
    
});

export const userResponse = pgTable('user_reponse', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade'}),
    questionId: uuid('question_id').notNull().references(() => questions.id, {
        onDelete: 'cascade'
    }),
    userText: text('user_text').notNull(),

    status: responseStatusEnum('status').default('draft').notNull(),

    submittedAt: timestamp('submitted_at', { withTimezone: true}),
    updatedAt: timestamp("updated_at", { withTimezone: true}).defaultNow().notNull()
    
}, (t) => [
    unique('unique_user_question_draft').on(t.userId, t.questionId)
]);


export const bookmarks = pgTable('bookmarks', {
    userId: uuid('user_id').notNull().references(() => 
    users.id, { onDelete: 'cascade'}),
    questionId: uuid('question_id').notNull().references(() => 
    questions.id, { onDelete: 'cascade'}),
    createdAt: timestamp("created_at", {withTimezone: true}).defaultNow().notNull(),
    
}, (t) => [
    primaryKey({ name: 'bookmarks_pkey', columns: [t.userId, t.questionId]})
]);

export const compaines = pgTable('companies', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 255}).notNull(),
    slug: varchar('slug', { length: 255}).notNull(),
    industry: varchar('industry', { length: 255 }).notNull(),
  logoUrl: varchar('logo_url', { length: 255 }),
    createdAt: timestamp("created_at", {withTimezone: true}).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", {withTimezone: true}).defaultNow().notNull()
})

export const interviewReports = pgTable('interview_reports', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
  companyId: uuid('company_id').notNull().references(() => compaines.id, { onDelete: 'cascade' }),
  role: varchar('role', { length: 255 }).notNull(),
  stage: stageEnum('stage').notNull(),
  questionCategory: varchar('question_category', { length: 255 }).notNull(),
  questionText: text('question_text').notNull(),
  difficulty: difficultyEnum('difficulty').notNull(),
  outcome: outcomeEnum('outcome').notNull(),
  isAnonymous: boolean('is_anonymous').default(false).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const streakHistories = pgTable('streak_histories', {
  userId: uuid('user_id').primaryKey().references(() => users.id, { onDelete: 'cascade' }),
  currentStreak: integer('current_streak').default(0).notNull(),
  longestStreak: integer('longest_streak').default(0).notNull(),
  lastActivityDate: date('last_activity_date'),
  questionsCompletedToday: integer('questions_completed_today').default(0).notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});



export const userBadges = pgTable('user_badges', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  badgeType: varchar('badge_type', { length: 100 }).notNull(),
  awardedAt: timestamp('awarded_at', { withTimezone: true }).defaultNow().notNull(),
});

export const challengeCategoryEnum = pgEnum('challenge_category_enum', 
  ['component', 'interaction', 'form', 'layout']
);

export const submissionStatusEnum = pgEnum('submission_status_enum', 
  ['draft', 'completed']
);

export const designChallenges = pgTable('design_challenges', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  difficulty: difficultyEnum('difficulty').notNull(),
  category: challengeCategoryEnum('category').notNull(),
  estimatedTimeMins: integer('estimated_time_minutes').notNull(),
  specs: jsonb('specs').default([]).notNull(),
  imageUrl: varchar('image_url', { length: 500 }).notNull(),
  starterCode: text('starter_code').notNull(),
  referenceSolutionCode: text('reference_solution_code').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const challengeSubmissions = pgTable('challenge_submissions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  challengeId: uuid('challenge_id').notNull().references(() => designChallenges.id, { onDelete: 'cascade' }),
  userCode: text('user_code').notNull(),
  status: submissionStatusEnum('status').default('draft').notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (t) => [
  unique('unique_user_challenge_submission').on(t.userId, t.challengeId)
]);

export const figmaDesigns = pgTable('figma_designs', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  category: varchar('category', { length: 100 }).notNull(),
  difficulty: difficultyEnum('difficulty').notNull(),
  figmaEmbedUrl: varchar('figma_embed_url', { length: 1000 }).notNull(),
  specs: jsonb('specs').default([]).notNull(),
  tags: jsonb('tags').default([]).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});