import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString} from 'class-validator';

export class ContributionDto {
    @IsString()
    @IsNotEmpty()
    companyName: string;

    @IsString()
    @IsNotEmpty()
    role: string;

    @IsEnum(['recruiter', 'technical', 'system_design', 'final'], {
        message: 'Stage must be recruiter, technical, system_design, or final'
    })
    @IsNotEmpty()
    stage: 'recruiter' | 'technical' | 'system_design' | 'final';

    @IsString()
    @IsNotEmpty()
    questionCategory: string;

    @IsString()
    @IsNotEmpty()
    questionText: string;

    // @IsString()
    @IsEnum(['easy', 'medium', 'hard'], {
        message: 'Difficulty must be easy, medium, or hard',
    })
    @IsNotEmpty()
    difficulty: 'easy' | 'medium' | 'hard';

    @IsEnum(['offer', 'rejected', 'pending'], {
        message: 'Outcome must be offer, rejected, or pending'
    })
    @IsNotEmpty()
    outcome: 'offer' | 'rejected' | 'pending';

    @IsBoolean()
    @IsOptional()
    isAnonymous?: boolean;
}