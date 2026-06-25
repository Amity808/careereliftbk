import { IsEnum, IsInt, IsNotEmpty, Max, Min } from 'class-validator';

export class OnboardingDto {
    @IsEnum(['frontend', 'backend', 'pm', 'hr', 'analyst'], {
        message: 'Career musr be: frontend, backend, om, hr, or analyst'
    })
    @IsNotEmpty()
    career: 'frontend' | 'backend' | 'pm' | 'hr' | 'analyst';

    @IsEnum(['entry', 'mid', 'senior', 'lead'], {
        message: 'Experience level must be: entry, mid, seniorm or lead'
    })
    @IsNotEmpty()
    experienceLevel: 'entry' | 'mid' | 'senior' | 'lead';

    @IsEnum(['new_job', 'promotion', 'growth', 'leadership'],{
        message: 'Goal must be new_job, promotion, growth, or leadership'
    })
    @IsNotEmpty()
    goal: 'new_job' | 'promotion' | 'growth' | 'leadership'

    @IsInt()
    @Min(1)
    @Max(20)
    dailyFrequency: number;
}