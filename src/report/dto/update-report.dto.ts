import { PartialType } from '@nestjs/mapped-types';
import { CreateReportDto } from './create-report.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Optional } from '@nestjs/common';

export enum ReportStatus {
    PENDING = 'pending',
    APPROVED = 'done',
}

export class UpdateReportDto extends PartialType(CreateReportDto) {
    @ApiProperty({ type: 'string', enum: ReportStatus, default: ReportStatus.PENDING })
    @Optional()
    status: ReportStatus;
}
