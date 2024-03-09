import { AttributeValue, DeleteItemCommand, DynamoDBClient, GetItemCommand, PutItemCommand, ScanCommand } from "@aws-sdk/client-dynamodb";
import { Injectable } from "@nestjs/common";
import { Room } from "./entities/room.entity";

@Injectable()
export class RoomsRepository {
    private readonly tableName = "rooms";
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

    async create(image: Express.Multer.File, data: Room) {
        const itemObject: Record<string, AttributeValue> = {
            image: {
                S: image.originalname
            },
            roomId: {
                S: data.roomId
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
    async update(data: Room) {
        const itemObject: Record<string, AttributeValue> = {
            roomId: {
                S: data.roomId
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