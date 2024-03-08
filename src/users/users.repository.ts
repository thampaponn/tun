import { AttributeValue, DeleteItemCommand, DynamoDBClient, GetItemCommand, PutItemCommand, ScanCommand } from "@aws-sdk/client-dynamodb";
import { Injectable } from "@nestjs/common";
import { User } from "./entities/user.entity";

@Injectable()
export class UsersRepository {
    private readonly tableName = "users";
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

    async login(email: string, password: string) {
        const result = await this.findByEmail(email);
        if (result && result.password === password) {
            return true
        }
        return false
    }

    async upsertOne(data: User) {
        if (data.password !== data.confirmPassword) {
            return false
        }
        const itemObject: Record<string, AttributeValue> = {
            userId: {
                S: data.userId
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
        if (data.userId) {
            itemObject.userId = {
                S: data.userId
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

    async findByUserId(userId: string) {
        const command = new GetItemCommand({
            TableName: this.tableName,
            Key: {
                userId: { S: userId },
            },
        });
        const result = await this.client.send(command);

        if (result.Item) {
            return User.newInstanceFromDynamoDBObject(result.Item);
        }

        return undefined;
    }

    async delete(userId: string) {
        const command = new DeleteItemCommand({
            TableName: this.tableName,
            Key: {
                userId: { S: userId },
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