// DRIZZLE_PROVIDER to query/insert records into PostgreSQL.
// argon2 for secure hashing.
// JwtService to sign tokens.

import { Injectable, ConflictException,
    UnauthorizedException, Inject
 } from "@nestjs/common";
 import { JwtService } from "@nestjs/jwt";
 import { DRIZZLE_PROVIDER } from "src/database/database.module";
 import { NodePgDatabase } from "drizzle-orm/node-postgres";
 import * as schema from "../../database/schema"
 import { eq } from "drizzle-orm";
 import * as argon2 from 'argon2';
 import { RegisterDto } from "./dto/register.dto";
 import { LoginDto } from "./dto/login.dto";

 @Injectable()
export class AuthService {
    constructor(
        @Inject(DRIZZLE_PROVIDER)
        private db: NodePgDatabase<typeof schema>,
        private jwtService: JwtService,
    ) {}

    async register(resgisterDto: RegisterDto) {
        const { email, password, fullName } = resgisterDto;

        const existingUser = await this.db.query.users.findFirst({
            where: eq(schema.users.email, email.toLowerCase()),
        });

        if (existingUser) {
            throw new ConflictException("User already exist with this email");
        }

        // passwhord hash 
        const passwordHash = await argon2.hash(password);

        // insert a user in the DB
        const [newUser] = await this.db.insert(schema.users)
        .values({
            email: email.toLowerCase(),
            passwordHash,
            fullName
        })
        .returning({
            id: schema.users.id,
            email: schema.users.email,
            fullName: schema.users.fullName
        });

        const token = this.jwtService.sign({
            sub: newUser.id, email: newUser.email
        })

        return { token, user: newUser }        
    }

    async login(loginDto: LoginDto) {
        const { email, password } = loginDto;

        const user = await this.db.query.users.findFirst({
            where: eq(schema.users.email, email.toLowerCase()),
        });

        if (!user) {
            throw new UnauthorizedException("Invalid credientials");
        }

        const isPasswordValid = await argon2.verify(user.passwordHash, password);
        if(!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // generate a jwt token 
        const token = this.jwtService.sign({
            sub: user.id, email: user.email
        });

        return {
            token,
            user: {
                id: user.id,
                email: user.email,
                fullName: user.fullName
            }
        }
    }
}