import { Controller, Get, Post, Param, Query, Body, UseGuards, Request } from '@nestjs/common';
import { ChallengesService } from './challenges.service';
import { SubmissionDto } from './dto/submission.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('challenges')
@Controller('challenges')
@UseGuards(JwtAuthGuard)
export class ChallengesController {
  constructor(private readonly challengesService: ChallengesService) {}

  @Get()
  async getChallenges(
    @Request() req: any,
    @Query('category') category?: string,
    @Query('difficulty') difficulty?: string,
    @Query('status') status?: string,
  ) {
    return this.challengesService.getChallenges(req.user.id, category, difficulty, status);
  }

  @Get(':id')
  async getChallengeDetail(@Param('id') id: string, @Request() req: any) {
    return this.challengesService.getChallengeDetail(req.user.id, id);
  }

  @Post(':id/submissions')
  async submitChallenge(
    @Param('id') id: string,
    @Request() req: any,
    @Body() dto: SubmissionDto,
  ) {
    return this.challengesService.submitChallenge(req.user.id, id, dto);
  }
}
