import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDate, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export enum ReportStatus {
    PENDING = 'pending',
    APPROVED = 'done',
}

export class CreateReportDto {
    @ApiProperty({ type: 'string' })
    @IsNotEmpty()
    email: string;

    @ApiProperty({ type: 'string' })
    @IsNotEmpty()
    roomId: string;

    @ApiProperty({ type: 'string' })
    @MaxLength(100)
    @IsNotEmpty()
    detail: string;

    @ApiProperty({ type: 'string', enum: ReportStatus, default: ReportStatus.PENDING })
    @IsNotEmpty()
    status: ReportStatus;
}
