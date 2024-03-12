import { AttributeValue, DeleteItemCommand, DynamoDBClient, GetItemCommand, PutItemCommand, ScanCommand, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
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

        return email;
    }

    async updatePassword(email: string, newPassword: string) {
        const command = new UpdateItemCommand({
            TableName: this.tableName,
            Key: {
                email: { S: email }
            },
            UpdateExpression: "SET #passwordAttr = :newPassword",
            ExpressionAttributeNames: {
                "#passwordAttr": "password"
            },
            ExpressionAttributeValues: {
                ":newPassword": { S: newPassword }
            },
            ReturnValues: "ALL_NEW"
        });

        try {
            const response = await this.client.send(command);
            return response;
        } catch (error) {
            console.error("Error updating password:", error);
            throw error;
        }
    }


    async upsertOne(data: User) {
        if (data.password !== data.confirmPassword) {
            throw new HttpException('Password and confirm password do not match', 400);
        }
        const itemObject: Record<string, AttributeValue> = {
            email: {
                S: data.email
            },
            reservationId: {
                SS: data.reservationId
            },
            reportId: {
                SS: data.reportId
            },
            firstName: {
                S: data.firstName
            },
            lastName: {
                S: data.lastName
            },
            studentId: {
                S: data.studentId
            },
            password: {
                S: data.password
            },
            confirmPassword: {
                S: data.confirmPassword
            },
            role: {
                S: data.role
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

    async findAll(): Promise<User[]> {
        const result: User[] = [];

        const command = new ScanCommand({
            TableName: this.tableName,
        });

        const response = await this.client.send(command);

        if (response.Items) {
            response.Items.forEach((item) => {
                const reservationIdArray = item.reservationId ? (item.reservationId.SS || []) : [];
                const reportIdArray = item.reportId ? (item.reportId.SS || []) : [];

                const filteredReservationId = reservationIdArray.filter(id => id !== 'string' && id !== 'empty');
                const filteredReportId = reportIdArray.filter(id => id !== 'string' && id !== 'empty');

                if (filteredReservationId.length > 0 || filteredReportId.length > 0) {
                    result.push(User.newInstanceFromDynamoDBObject({
                        ...item,
                        reservationId: { SS: filteredReservationId },
                        reportId: { SS: filteredReportId }
                    }));
                }
            });
        }

        return result;
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