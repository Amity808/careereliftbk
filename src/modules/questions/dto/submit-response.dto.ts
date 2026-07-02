import { IsEnum, IsNotEmpty, IsString} from 'class-validator';


export class SubmitReponseDto {
    @IsString()
    @IsNotEmpty()
    responseText: string;

    @IsEnum(['draft', 'submitted'], {
        message: 'Status must be draft or submitted'
    })
    @IsNotEmpty()
    status: 'draft' | 'submitted';
}