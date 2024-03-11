import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MaxLength } from "class-validator";


export enum UserRole {
    ADMIN = "admin",
    USER = "user",
}

export class UserDto {
    @ApiProperty({ type: 'string' })
    @IsNotEmpty()
    email: string;

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
    role: UserRole;
}
