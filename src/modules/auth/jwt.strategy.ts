// a custom Passport strategy to decrypt incoming tokens and verify the user exists on protected routes.
import { Injectable, UnauthorizedException, Inject } from "@nestjs/common";
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { DRIZZLE_PROVIDER } from "src/database/database.module";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import * as schema from "../../database/schema";
import { eq } from "drizzle-orm"

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        configService: ConfigService,
        @Inject(DRIZZLE_PROVIDER)
        private db: NodePgDatabase<typeof schema>,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
        });
    }

    async validate(payload: { sub: string; email: string }) {
        const user = await this.db.query.users.findFirst({
            where: eq(schema.users.id, payload.sub),
        });

        if (!user) {
            throw new UnauthorizedException();
        }

        return {id: user.id, email: user.email, fullName: user.fullName}
    }
}