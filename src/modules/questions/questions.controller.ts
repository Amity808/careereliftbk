import { Controller, Get, Post, Delete, Param, Query
    ,Body, UseGuards, Request
} from '@nestjs/common';
import { QuestionService } from './questions.service';
import { SubmitReponseDto } from './dto/submit-response.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@Controller('questions')
@UseGuards(JwtAuthGuard)
export class QuestionsController {
    constructor(private readonly questionsService: QuestionService
    ) {}

    @Get()
    async getQuestions(
        @Query('category') category?: string,
        @Query('difficulty') difficulty?: string,
    ) {
        return this.questionsService.getQuestion(category, difficulty)
    }

    @Get('daily')
    async getDailyQuestions(@Request() req: any) {
        return this.questionsService.getDailyQuestions(req.user.id);
    }

    @Get(':id')
    async getQuestionDetail(@Param('id') id: string, @Request() req: any) {
        return this.questionsService.getQuestionDetail(id, req.user.id)
    }

    @Post(':id/response')
    async submitResponse(
        @Param('id') id: string,
        @Request() req: any,
        @Body() dto: SubmitReponseDto
    ) {
        return this.questionsService.submitResponse(id, req.user.id, dto);
    }

    @Post(':id/bookmark')
    async addBookMark(@Param('id') id: string, @Request() req: any) {
        return this.questionsService.addBookmark(id, req.user.id);
    }

    @Delete(':id/bookmark')
    async removeBookmark(@Param('id') id: string, @Request() req: any) {
        return this.questionsService.removeBookmark(id, req.user.id);
    }
}