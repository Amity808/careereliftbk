# Install runtime dependencies
pnpm add @nestjs/config zod drizzle-orm pg @upstash/redis @nestjs/jwt @nestjs/passport passport passport-jwt argon2

# Install development dependencies (types & migrations kit)
pnpm add -D drizzle-kit @types/pg @types/passport-jwt
