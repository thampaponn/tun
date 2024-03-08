import { CreateUserDto } from "../dto/create-user.dto";
import { v4 as uuidv4 } from 'uuid';
export class User {
    userId: string;
    firstName: string;
    lastName: string;
    studentId: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt?: Date;

    static newInstanceFromDTO(data: CreateUserDto) {
        const result = new User();
        result.userId = uuidv4();
        result.firstName = data.firstName;
        result.lastName = data.lastName;
        result.studentId = data.studentId;
        result.email = data.email;
        result.password = data.password;
        result.createdAt = new Date();
        return result;
    }
    static newInstanceFromDynamoDBObject(data: any) {
        const result = new User();
        result.userId = data.userId.S;
        result.firstName = data.firstName.S;
        result.lastName = data.lastName.S;
        result.studentId = data.studentId.S;
        result.email = data.email.S;
        result.password = data.password.S;
        result.createdAt = new Date(Number(data.createdAt.N));
        if (data.updatedAt) {
            result.updatedAt = new Date(Number(data.updatedAt.N));
        }
        return result;
    }

}
