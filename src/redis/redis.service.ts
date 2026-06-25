import { Injectable, OnModuleInit } from '@nestjs/common'
import { ConfigService} from '@nestjs/config'
import { Redis } from '@upstash/redis';

@Injectable()
export class RedisService implements OnModuleInit {
    private client: Redis;

    constructor(private configService: ConfigService) {}

    onModuleInit() {
        this.client = new Redis({
            url: this.configService.getOrThrow<string>('UPSTASH_REDIS_REST_URL'),
            token: this.configService.getOrThrow<string>('UPSTASH_REDIS_REST_TOKEN')
        });
        
    }

    async get<T>(key: string): Promise<T | null> {
        return this.client.get<T>(key);
    }

    async set(key: string, value: any, ttlSeconds?: number): Promise<void> {
        if (ttlSeconds) {
            await this.client.set(key, value, {ex: ttlSeconds});
        } else {
            await this.client.set(key, value)
        }
    }

    async del (key: string): Promise<void> {
        await this.client.del(key);
    }

    async incr(key: string): Promise<number> {
        return this.client.incr(key)
    }
}
