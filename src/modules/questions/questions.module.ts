import { Module } from "@nestjs/common";
import { QuestionService } from "./questions.service";
import { QuestionsController } from "./questions.controller";

@Module({
    controllers: [QuestionsController],
    providers: [QuestionService],
    exports: [QuestionService]
})
export class QuestionModule {}