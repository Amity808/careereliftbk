import { Injectable, Inject, NotFoundException} from '@nestjs/common'
import { DRIZZLE_PROVIDER } from 'src/database/database.module'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import * as schema from "../../database/schema"
import { eq, sql } from 'drizzle-orm';
import { ContributionDto } from './dto/contribution.dto';


@Injectable()
export class CompaniesService {
    constructor(
        @Inject(DRIZZLE_PROVIDER)
        private db: NodePgDatabase<typeof schema>,
    ) {}


    async getCompanies() {
        return this.db.query.compaines.findMany({
            columns: {
                id: true,
                name: true,
                slug: true,
                industry: true
            },
        })
    }

    // fetch the company stats (aggreagtes stages and list reports
    
    async getCompanyDetail(companyId: string) {
        const company = await this.db.query.compaines.findFirst({
            where: eq(schema.compaines.id, companyId)
        });
        if (!company) {
            throw new NotFoundException('Company not found');
        }

        const reports = await this.db.query.interviewReports.findMany({
            where: eq(schema.interviewReports.companyId, companyId),
        });

        const stageCounts: Record<string, number> = {
            recruiter: 0, technical: 0, system_design: 0, final: 0
        };
        reports.forEach((report) => {
            if (stageCounts[report.stage] !== undefined) {
                stageCounts[report.stage]++;
                }
        });

        const totalReports = reports.length;
        const interviewStages = Object.keys(stageCounts).map((stage) => ({
            stage, percentage: totalReports > 0 ? 
        Math.round((stageCounts[stage] / totalReports) * 100) : 0,
    }));

    return {
        company,
        totalReports, 
        interviewStages, 
        reports
    };
}

// create a contribution (and create company dynamically if missing()
async createContriution(userId: string, dto: ContributionDto) {
    const { companyName, role, stage, questionCategory,
        outcome, 
        difficulty, isAnonymous , questionText
     } = dto;

    const slug = companyName.toLowerCase().replace(
        /[^a-z0-9]+/g, "-"). replace(/(^-|-$)/g, '');
    
    let company = await this.db.query.compaines.findFirst({
        where: eq(schema.compaines.slug, slug),
    });

    if(!company) {
        const [newCompany] = await this.db.insert(schema.compaines)
        .values({
            name: companyName,
            slug, industry: 'Tech' //default fallback
        }).returning();
        company = newCompany
    }

// insert the interview report contribution 
await this.db.insert(schema.interviewReports).values({
    userId: isAnonymous ? null : userId,
    companyId: company.id,
    role,
    stage: stage as any,
    questionCategory,
    questionText,
    difficulty: difficulty as any,
    outcome: outcome as any,
    isAnonymous: isAnonymous ?? false,
});
return {
    message: 'Thank you for contributing!',
    pointsAwarded: 100,
}
}


}