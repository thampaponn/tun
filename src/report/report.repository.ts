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
                accessKeyId: 'ASIATCKAP6XCRKGS6LMV',
                secretAccessKey: '7W3eO3/E4ad1SINwD7MOwl/xbT38TTry33rGJlAC',
                sessionToken: 'FwoGZXIvYXdzEPL//////////wEaDJZ8JTjNydTOHS6HMSLFATAnK6DqL0SEHDUcvyzx2GBDjecQkN3n2suJqoA3vhXt81UI0R+2N8n/UU7taLjQxXk+A3Hf+Y0en6EVq+i9bsq7pwJcFqGoTaq1pMEcE+GYBXFATvHBk4d6RYHQzTma8mjfdoWRMnVpppls8ypKy4U7V8c2GuFysnUVq3MwJFo+6703nKZdgvhcD8I1Z1UKD/OnlNYanTgAspJb6Dy0dN1OGXRQcuEawLbZtnt30tcthu+aBgPtuk68zc8wkngB9p7N3MhZKPH5rK8GMi1l/A54JEDxgPQ/JEHiLRq025q5XK6cUEKn1cnWLkiKLgwv+bf4mLMH/LR5f8I='
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
                S: data.status
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