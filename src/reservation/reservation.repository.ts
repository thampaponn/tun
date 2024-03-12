import { AttributeValue, DeleteItemCommand, DynamoDBClient, GetItemCommand, PutItemCommand, ScanCommand, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { Injectable } from "@nestjs/common";
import { Reservation } from "./entities/reservation.entity";

@Injectable()
export class ReservationRepository {
    private readonly tableName = "reservation";
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

    async upsertOne(data: Reservation) {
        const itemObject: Record<string, AttributeValue> = {
            reservationId: {
                S: data.reservationId
            },
            roomId: {
                S: data.roomId
            },
            name: {
                S: data.name
            },
            email: {
                S: data.email
            },
            startTime: {
                N: String(data.startTime.getTime())
            },
            endTime: {
                N: String(data.endTime.getTime())
            },
            detail: {
                S: data.detail
            },
            status: {
                S: data.status
            },
            createdAt: {
                N: String(data.createdAt.getTime())
            },
        }

        if (data.reservationId) {
            itemObject.reservationId = {
                S: data.reservationId
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
        })
        const addReservationId = new UpdateItemCommand({
            TableName: "users",
            Key: {
                email: { S: data.email }
            },
            UpdateExpression: "ADD reservationId :reservationId",
            ExpressionAttributeValues: {
                ":reservationId": { SS: [data.reservationId] }
            },
            ReturnValues: "ALL_NEW"
        })
        await this.client.send(command);
        await this.client.send(addReservationId);

        return data;
    }

    async update(reservationId: string, status: string) {
        const command = new UpdateItemCommand({
            TableName: this.tableName,
            Key: {
                reservationId: { S: reservationId }
            },
            UpdateExpression: "SET #status = :status",
            ExpressionAttributeNames: {
                "#status": "status"
            },
            ExpressionAttributeValues: {
                ":status": { S: status }
            },
            ReturnValues: "ALL_NEW",
        });

        try {
            const response = await this.client.send(command);
            return response;
        } catch (error) {
            console.error("Error updating status:", error);
            throw error;
        }
    }

    async findAll() {
        const result: Reservation[] = [];

        const command = new ScanCommand({
            TableName: this.tableName,
        });

        const response = await this.client.send(command);

        response.Items.forEach((item) => {
            result.push(Reservation.newInstanceFromDynamoDBObject(item));
        });

        return result;
    }

    async findByReservationId(reservationId: string) {
        const command = new GetItemCommand({
            TableName: this.tableName,
            Key: {
                reservationId: { S: reservationId },
            },
        });

        const result = await this.client.send(command);
        if (result.Item) {
            return Reservation.newInstanceFromDynamoDBObject(result.Item);
        }

        return undefined;
    }

    async delete(reservationId: string) {
        const command = new DeleteItemCommand({
            TableName: this.tableName,
            Key: {
                reservationId: { S: reservationId },
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