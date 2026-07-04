import { Controller, Get, UseGuards, Request } from "@nestjs/common";
import { DashboardService } from "./dashboard.service";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
    constructor(private readonly dashboardService: DashboardService) {}

    @Get('summary')
    async getSummary(@Request() req: any) {
        return this.dashboardService.getSummary(req.user.id);
    }
    
}