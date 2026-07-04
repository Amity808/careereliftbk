import { Module } from "@nestjs/common";
import { StreaksService } from "./streaks.service";
import { StreakController } from "./streaks.controller";

@Module({
    controllers: [StreakController],
    providers: [StreaksService]
})

export class StreakModule {}