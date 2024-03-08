import { CreateUserDto } from "../dto/create-user.dto";

export class User {
    email: string;
    firstName: string;
    lastName: string;
    studentId: string;
    password: string;
    confirmPassword: string;
    createdAt: Date;
    updatedAt?: Date;

    static newInstanceFromDTO(data: CreateUserDto) {
        const result = new User();
        result.firstName = data.firstName;
        result.lastName = data.lastName;
        result.studentId = data.studentId;
        result.email = data.email;
        result.password = data.password;
        result.confirmPassword = data.confirmPassword;
        result.createdAt = new Date();
        return result;
    }
    static newInstanceFromDynamoDBObject(data: any) {
        const result = new User();
        result.email = data.email.S;
        result.firstName = data.firstName.S;
        result.lastName = data.lastName.S;
        result.studentId = data.studentId.S;
        result.password = data.password.S;
        result.createdAt = new Date(Number(data.createdAt.N));
        if (data.updatedAt) {
            result.updatedAt = new Date(Number(data.updatedAt.N));
        }
        return result;
    }

}
