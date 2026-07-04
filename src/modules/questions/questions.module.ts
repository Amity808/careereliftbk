import { Module } from "@nestjs/common";
import { QuestionService } from "./questions.service";
import { QuestionsController } from "./questions.controller";
import { StreakModule } from "../streaks/streaks.module";

@Module({
    imports: [StreakModule],
    controllers: [QuestionsController],
    providers: [QuestionService],
    exports: [QuestionService]
})
export class QuestionModule {}