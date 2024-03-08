import { AttributeValue, DeleteItemCommand, DynamoDBClient, GetItemCommand, PutItemCommand, ScanCommand } from "@aws-sdk/client-dynamodb";
import { Injectable } from "@nestjs/common";
import { Report } from "./entities/report.entity";

@Injectable()
export class ReportRepository {
    private readonly tableName = "report";
    private readonly client: DynamoDBClient;

    constructor() {
        this.client = new DynamoDBClient({
            region: 'us-east-1',
            credentials: {
                accessKeyId: 'ASIATCKAP6XCZTHZL2M2',
                secretAccessKey: 'KT8+R0/H3FAZbiz+1+lYOaa09eLEfL2/WGzBepc6',
                sessionToken: 'FwoGZXIvYXdzEOf//////////wEaDNmowkgvJ9WHYbX4+iLFAYJIliYlnMnfmTeuZv3ASjZy5OpDZkHfTlxLD6dLF5RyzNsqhIz+UK21t9BYGVaqFsQMg2+6i6leCZAw3P2QdTYZGTfjXeku+PpVO9j0qQmkQQ87gesCF0tGpV2kgHuFm9afVJGaIif2ESuAAqbYxF7QkErPTqls0DZk9E9xvsFN9OCq4BykGmkIz7CzH5o3+0w6nU6xKRyoGC7T0M+DHzabvPktyueiXYq4BkUoXZIhkVxy9kqYhbOPwApEpRCsUYnx0MksKNXJqq8GMi24Ap/F8Xo5LfX3XVCwJHF30eIuLPkqsWsNwnbA8jWfsq3rYrhXbFMWCpGq/t8='
            }
        });
    }

    async upsertOne(data: Report) {
        const itemObject: Record<string, AttributeValue> = {
            reportId: {
                S: data.reportId
            },
            userId: {
                S: data.userId
            },
            roomId: {
                S: data.roomId
            },
            detail: {
                S: data.detail
            },
            status: {
                BOOL: data.status
            },
            createdAt: {
                N: String(data.createdAt.getTime())
            }
        }

        if (data.reportId) {
            itemObject.reportId = {
                S: data.reportId
            }
        }

        if (data.updatedAt) {
            itemObject.updatedAt = {
                N: String(data.updatedAt.getTime())
            }
        }

        const command = new PutItemCommand({
            TableName: this.tableName,
            Item: itemObject
        });

        await this.client.send(command);

        return data;
    }

    async findAll() {
        const result: Report[] = [];

        const command = new ScanCommand({
            TableName: this.tableName
        });

        const response = await this.client.send(command);

        response.Items.forEach((item) => {
            result.push(Report.newInstanceFromDynamoDBObject(item));
        })

        return result;
    }

    async findByReportId(reportId: string) {
        const command = new GetItemCommand({
            TableName: this.tableName,
            Key: {
                reportId: {
                    S: reportId
                }
            }
        });

        const result = await this.client.send(command);
        if (result.Item) {
            return Report.newInstanceFromDynamoDBObject(result.Item);
        }

        return undefined;
    }

    async delete(reportId: string) {
        const command = new DeleteItemCommand({
            TableName: this.tableName,
            Key: {
                reportId: {
                    S: reportId
                }
            },
            ReturnConsumedCapacity: "TOTAL",
            ReturnValues: "ALL_OLD",
        });

        const result = await this.client.send(command);

        if (result.Attributes) {
            return true;
        }
        return false;
    }
}