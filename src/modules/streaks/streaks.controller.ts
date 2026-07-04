import { Controller, Get, UseGuards, Request } from "@nestjs/common";
import { StreaksService } from "./streaks.service";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { ApiTags } from "@nestjs/swagger";

@ApiTags('streaks')
@Controller('streaks')
@UseGuards(JwtAuthGuard)
export class StreakController {
    constructor(private readonly streakService: StreaksService) {}

    @Get()
    async getStreakInfo(@Request() req: any) {
        return this.streakService.getStreakInfo(req.user.id);
    }
}