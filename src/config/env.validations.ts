import { z } from 'zod';


export const envSchema = z.object({
    NODE_ENV: z.enum(["development", "production", "test"]).default(
        'development'),
        PORT: z.coerce.number().default(3000),
        DATABASE_URL: z.string().url({message: 'DATABASE_URL must be a valid connection string'}),

        UPSTASH_REDIS_REST_URL: z.string().url({message: 'UPSTASH_REDST_REST_URL'}),
        UPSTASH_REDIS_REST_TOKEN: z.string({message: 'UPSTASH_REDST_REST_TOKEN'}),

        JWT_SECRET: z.string().min(8, { message: 'JWT_SECRET must be at least 8 characters long'}),
        JWT_EXPIRE_IN: z.string().default("7d")
    
});


export type EnvConfig = z.infer<typeof envSchema>;

export function validateEnv(config: Record<string, unknown>) {
    const result = envSchema.safeParse(config);

    if (!result.success) {
        console.error("Invalid Environment Variables:")
        console.error(JSON.stringify(result.error.format(), null, 2));
        throw new Error("Environment validation failed");
    }

    return result.data
}