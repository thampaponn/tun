import { AttributeValue, DeleteItemCommand, DynamoDBClient, GetItemCommand, PutItemCommand, ScanCommand } from "@aws-sdk/client-dynamodb";
import { Injectable } from "@nestjs/common";
import { Room } from "./entities/room.entity";

@Injectable()
export class RoomsRepository {
    private readonly tableName = "rooms";
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

    async upsertOne(data: Room) {
        const itemObject: Record<string, AttributeValue> = {
            roomId: {
                S: data.roomId
            },
            image: {
                S: data.image
            },
            name: {
                S: data.name
            },
            floor: {
                S: data.floor
            },
            detail: {
                S: data.detail
            },
            description: {
                S: data.description
            },
            totalSeat: {
                N: String(data.totalSeat)
            },
            status: {
                BOOL: data.status
            },
            createdAt: {
                N: String(data.createdAt.getTime())
            },
        }
        if (data.roomId) {
            itemObject.roomId = {
                S: data.roomId
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

        await this.client.send(command);

        return data;
    }

    async findAll() {
        const result: Room[] = [];

        const command = new ScanCommand({
            TableName: this.tableName,
        });

        const response = await this.client.send(command);
        console.log(new Date(response.Items[0].createdAt.S));

        if (response.Items) {
            response.Items.forEach((item) => {
                result.push(Room.newInstanceFromDynamoDBObject(item));
            });
        }

        return result
    }

    async findByRoomId(roomId: string) {
        const command = new GetItemCommand({
            TableName: this.tableName,
            Key: {
                roomId: { S: roomId },
            },
        });
        const result = await this.client.send(command);

        if (result.Item) {
            return Room.newInstanceFromDynamoDBObject(result.Item);
        }

        return undefined;
    }

    async delete(roomId: string) {
        const command = new DeleteItemCommand({
            TableName: this.tableName,
            Key: {
                roomId: { S: roomId },
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