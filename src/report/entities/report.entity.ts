import { CreateReportDto } from "../dto/create-report.dto";
import { v4 as uuidv4 } from 'uuid';

export class Report {
    reportId: string;
    userId: string;
    roomId: string;
    detail: string;
    status: boolean;
    createdAt: Date;
    updatedAt?: Date;

    static newInstanceFromDTO(data: CreateReportDto) {
        const result = new Report();
        result.reportId = uuidv4();
        result.userId = data.userId;
        result.roomId = data.roomId;
        result.detail = data.detail;
        result.status = data.status;
        result.createdAt = new Date();
        return result;
    }

    static newInstanceFromDynamoDBObject(data: any) {
        const result = new Report();
        result.reportId = data.reportId.S;
        result.userId = data.userId.S;
        result.roomId = data.roomId.S;
        result.detail = data.detail.S;
        result.status = data.status.BOOL;
        result.createdAt = new Date(Number(data.createdAt.N));
        if (data.updatedAt) {
            result.updatedAt = new Date(Number(data.updatedAt.N));
        }
        return result;
    }
}
