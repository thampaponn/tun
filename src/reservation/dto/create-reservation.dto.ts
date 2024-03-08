import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateReservationDto {
    @IsString()
    @IsNotEmpty()
    userId: string;

    @IsString()
    @IsNotEmpty()
    roomId: string;

    @IsString()
    @IsNotEmpty()
    startTime: Date;

    @IsString()
    @IsNotEmpty()
    endTime: Date;

    @IsString()
    @MaxLength(100)
    @IsNotEmpty()
    detail: string;
}
