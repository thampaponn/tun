import { CreateUserDto } from "../dto/create-user.dto";

export class User {
    email: string;
    reservationId: string[];
    reportId: string[];
    firstName: string;
    lastName: string;
    studentId: string;
    password: string;
    confirmPassword: string;
    role: string;
    createdAt: Date;
    updatedAt?: Date;

    static newInstanceFromDTO(data: CreateUserDto) {
        const result = new User();
        result.email = data.email;
        result.reservationId = data.reservationId;
        result.reportId = data.reportId;
        result.firstName = data.firstName;
        result.lastName = data.lastName;
        result.studentId = data.studentId;
        result.password = data.password;
        result.confirmPassword = data.confirmPassword;
        result.role = data.role;
        result.createdAt = new Date();
        console.log(result);
        return result;
    }
    static newInstanceFromDynamoDBObject(data: any) {
        const result = new User();
        result.email = data.email.S;
        result.reservationId = data.reservationId.SS;
        result.reportId = data.reportId.SS;
        result.firstName = data.firstName.S;
        result.lastName = data.lastName.S;
        result.studentId = data.studentId.S;
        result.password = data.password.S;
        result.role = data.role.S;
        result.createdAt = new Date(Number(data.createdAt.N));
        if (data.updatedAt) {
            result.updatedAt = new Date(Number(data.updatedAt.N));
        }
        console.log(result);
        return result;
    }

}
