import { Optional } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MaxLength } from "class-validator";
import { Reservation } from "src/reservation/entities/reservation.entity";


export enum UserRole {
    ADMIN = "admin",
    USER = "user",
}

export class CreateUserDto {
    @ApiProperty({ type: 'string' })
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: string;

    @ApiProperty({ type: [String] , default: ['empty']})
    @Optional()
    reservationId: string[];

    @ApiProperty({ type: [String], default: ['empty']})
    @Optional()
    reportId: string[];

    @ApiProperty({ type: 'string' })
    @MaxLength(30)
    @IsNotEmpty()
    firstName: string;

    @ApiProperty({ type: 'string' })
    @MaxLength(30)
    @IsNotEmpty()
    lastName: string;

    @ApiProperty({ type: 'string' })
    @MaxLength(8)
    @IsNotEmpty()
    studentId: string;

    @ApiProperty({ type: 'string' })
    @IsNotEmpty()
    @MaxLength(30)
    password: string;

    @ApiProperty({ type: 'string' })
    @IsNotEmpty()
    @MaxLength(30)
    confirmPassword: string;

    @ApiProperty({ type: 'string', enum: UserRole, default: UserRole.USER })
    @Optional()
    role: UserRole;
}
