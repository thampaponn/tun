import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsNumber, IsString, MaxLength } from "class-validator";

export class CreateRoomDto {
    @ApiProperty({ type: 'string', format: 'binary', description: 'Image file'})
    image?: any;

    @ApiProperty({ type: 'string'})
    @MaxLength(45)
    @IsNotEmpty()
    name: string;

    @ApiProperty({ type: 'string'})
    @MaxLength(30)
    @IsNotEmpty()
    floor: string;

    @ApiProperty({ type: 'string'})
    @MaxLength(100)
    @IsNotEmpty()
    detail: string;

    @ApiProperty({ type: 'string'})
    @MaxLength(100)
    @IsNotEmpty()
    description: string;

    @ApiProperty({ type: 'number'})
    @MaxLength(30)
    @IsNotEmpty()
    totalSeat: number;

    @ApiProperty({ type: 'boolean'})
    @IsNotEmpty()
    status: boolean;
}
