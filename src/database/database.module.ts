import { Module, Global } from '@nestjs/common';
import { ConfigService} from "@nestjs/config"
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';


export const DRIZZLE_PROVIDER = 'DRIZZLE_PROVIDER';

@Global()
@Module({
    providers: [
        {
            provide: DRIZZLE_PROVIDER,
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                const connectionString = configService.getOrThrow<string>('DATABASE_URL');
                const pool = new Pool({
                    connectionString,
                    ssl: connectionString.includes('localhost') || connectionString.includes('127.0.0.1')
                        ? false
                        : { rejectUnauthorized: false }
                });
                return drizzle(pool, {schema});
            }
        }
    ],
    exports: [DRIZZLE_PROVIDER],
})
export class DatabaseModule {}