import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class SubmissionDto {
  @IsString()
  @IsNotEmpty()
  userCode: string;

  @IsEnum(['draft', 'completed'], {
    message: 'Status must be draft or completed',
  })
  @IsNotEmpty()
  status: 'draft' | 'completed';
}
