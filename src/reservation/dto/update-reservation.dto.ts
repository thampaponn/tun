import { Optional } from "@nestjs/common";
import { PartialType } from "@nestjs/mapped-types";
import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsString, MaxLength } from "class-validator";
import { CreateReservationDto } from "./create-reservation.dto";


export enum ReservationStatus {
    PENDING = 'pending',
    APPROVED = 'approved',
    REJECTED = 'rejected',
}

export class UpdateReservationDto extends PartialType(CreateReservationDto) {
    @ApiProperty({ type: 'string', enum: ReservationStatus, default: ReservationStatus.PENDING })
    @Optional()
    status: ReservationStatus;
}
