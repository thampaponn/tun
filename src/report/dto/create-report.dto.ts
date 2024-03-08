import { IsBoolean, IsDate, IsNotEmpty, IsString, MaxLength } from 'class-validator';
export class CreateReportDto {
    @IsString()
    @IsNotEmpty()
    userId: string;

    @IsString()
    @IsNotEmpty()
    roomId: string;

    @IsString()
    @MaxLength(100)
    @IsNotEmpty()
    detail: string;

    @IsBoolean()
    @IsNotEmpty()
    status: boolean;
}
