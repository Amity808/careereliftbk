import { Controller, Get, Post, Param, Body
    , UseGuards, Request
 } from "@nestjs/common";
 import { CompaniesService } from "./companies.service";
 import { ContributionDto } from "./dto/contribution.dto";
 import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
 import { ApiTags } from "@nestjs/swagger";

 @ApiTags('companies')
 @Controller('companies')
export class CompaniesController {
    constructor(private readonly companiesService: CompaniesService) {}

    // public list all the companies 
    @Get('companies')
    async getCompanies() {
        return this.companiesService.getCompanies();
    }

    @Get('companies/:id')
    async getCompanyDetails(@Param('id') id: string) {
        return this.companiesService.getCompanyDetail(id)
    }

    @Post('contributions')
    @UseGuards(JwtAuthGuard)
    async createContribution(@Request() req: any, @Body() dto: ContributionDto) {
        return this.companiesService.createContriution(req.user.id, dto);
    }
} 