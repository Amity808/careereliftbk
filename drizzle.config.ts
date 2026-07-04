// drizzle.config.ts
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/database/schema.ts', // Path to your schema definitions
  out: './drizzle',                   // Where migrations SQL files will be saved
  dialect: 'postgresql',              // Database dialect
  dbCredentials: {
    url: process.env.DATABASE_URL!,   // Connection string from your .env
  },
});

