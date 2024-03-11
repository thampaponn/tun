import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsString, MaxLength } from "class-validator";


export enum ReservationStatus {
    PENDING = 'pending',
    APPROVED = 'approved',
    REJECTED = 'rejected',
}

export class CreateReservationDto {
    @ApiProperty({ type: 'string' })
    @IsNotEmpty()
    email: string;

    @ApiProperty({ type: 'string' })
    @IsNotEmpty()
    roomId: string;

    @ApiProperty({ type: 'string', description: 'isoString()' })
    @IsNotEmpty()
    startTime: Date;

    @ApiProperty({ type: 'string', description: 'isoString()' })
    @IsNotEmpty()
    endTime: Date;

    @ApiProperty({ type: 'string' })
    @MaxLength(100)
    @IsNotEmpty()
    detail: string;

    @ApiProperty({ type: 'string', enum: ReservationStatus, default: ReservationStatus.PENDING })
    @IsNotEmpty()
    status: ReservationStatus;
}
