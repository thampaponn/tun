import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateUserDto {

    @IsString()
    @MaxLength(25)
    @IsNotEmpty()
    firstName: string;

    @IsString()
    @MaxLength(25)
    @IsNotEmpty()
    lastName: string;

    @IsString()
    @MaxLength(8)
    @IsNotEmpty()
    studentId: string;

    @IsString()
    @MaxLength(45)
    @IsNotEmpty()
    email: string;

    @IsString()
    @MaxLength(25)
    @IsNotEmpty()
    password: string;
}
