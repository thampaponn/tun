import { IsBoolean, IsNotEmpty, IsNumber, IsString, MaxLength } from "class-validator";

export class CreateRoomDto {
    image?: any;

    @IsString()
    @MaxLength(45)
    @IsNotEmpty()
    name: string;

    @IsString()
    @MaxLength(30)
    @IsNotEmpty()
    floor: string;

    @IsString()
    @MaxLength(100)
    @IsNotEmpty()
    detail: string;

    @IsString()
    @MaxLength(100)
    @IsNotEmpty()
    description: string;

    @IsNumber()
    @MaxLength(30)
    @IsNotEmpty()
    totalSeat: number;

    @IsBoolean()
    @IsNotEmpty()
    status: boolean;
}
