import { AttributeValue, DeleteItemCommand, DynamoDBClient, GetItemCommand, PutItemCommand, ScanCommand, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { Injectable } from "@nestjs/common";
import { Report } from "./entities/report.entity";

@Injectable()
export class ReportRepository {
    private readonly tableName = "report";
    private readonly client: DynamoDBClient;

    constructor() {
        this.client = new DynamoDBClient({
            region: process.env.AWS_REGION,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
                sessionToken: process.env.AWS_SESSION_TOKEN
            }
        });
    }

    async upsertOne(data: Report) {
        const itemObject: Record<string, AttributeValue> = {
            reportId: {
                S: data.reportId
            },
            email: {
                S: data.email
            },
            name: {
                S: data.name
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
        const addReportId = new UpdateItemCommand({
            TableName: "users",
            Key: {
                email: { S: data.email }
            },
            UpdateExpression: "ADD reportId :reportId",
            ExpressionAttributeValues: {
                ":reportId": { SS: [data.reportId] }
            },
            ReturnValues: "ALL_NEW"
        })
        await this.client.send(command);
        await this.client.send(addReportId);

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