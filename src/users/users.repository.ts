import { AttributeValue, DeleteItemCommand, DynamoDBClient, GetItemCommand, PutItemCommand, ScanCommand } from "@aws-sdk/client-dynamodb";
import { HttpException, Injectable } from "@nestjs/common";
import { User } from "./entities/user.entity";

@Injectable()
export class UsersRepository {
    private readonly tableName = "users";
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

    async login(email: string, password: string) {
        if (!email) {
            throw new HttpException('User not found', 404);
        }

        if (password !== password) {
            throw new HttpException('Password is incorrect', 400);
        }

        return true;
    }

    async updatePassword(email: string, password: string) {
        const command = new PutItemCommand({
            TableName: this.tableName,
            Item: {
                email: { S: email },
                password: { S: password },
            }
        });

        await this.client.send(command);

        return 'Password updated successfully';
    }

    async upsertOne(data: User) {
        if (data.password !== data.confirmPassword) {
            throw new HttpException('Password and confirm password do not match', 400);
        }
        const itemObject: Record<string, AttributeValue> = {
            firstName: {
                S: data.firstName
            },
            lastName: {
                S: data.lastName
            },
            studentId: {
                S: data.studentId
            },
            email: {
                S: data.email
            },
            password: {
                S: data.password
            },
            confirmPassword: {
                S: data.confirmPassword
            },
            createdAt: {
                N: String(data.createdAt.getTime())
            },
        }
        if (data.email) {
            itemObject.email = {
                S: data.email
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
        const result: User[] = [];

        const command = new ScanCommand({
            TableName: this.tableName,
        });

        const response = await this.client.send(command);

        if (response.Items) {
            response.Items.forEach((item) => {
                result.push(User.newInstanceFromDynamoDBObject(item));
            });
        }

        return result
    }

    async findByEmail(email: string) {
        const command = new GetItemCommand({
            TableName: this.tableName,
            Key: {
                email: { S: email },
            },
        });

        const result = await this.client.send(command);

        if (result.Item) {
            return User.newInstanceFromDynamoDBObject(result.Item);
        }
        return undefined;
    }

    async delete(email: string) {
        const command = new DeleteItemCommand({
            TableName: this.tableName,
            Key: {
                email: { S: email },
            },
            ReturnConsumedCapacity: "TOTAL",
            ReturnValues: "ALL_OLD",
        });

        const result = await this.client.send(command);

        if (result.Attributes) {
            return 'User deleted successfully';
        }
        throw new HttpException('User not found', 404);
    }

}