import { v4 as uuidv4 } from 'uuid';
import { CreateReservationDto } from "../dto/create-reservation.dto";

export class Reservation {
    reservationId: string;
    email: string;
    roomId: string;
    name: string;
    startTime: Date;
    endTime: Date;
    detail: string;
    status: string;
    createdAt: Date;
    updatedAt?: Date;

    static newInstanceFromDTO(data: CreateReservationDto) {
        const result = new Reservation();
        result.reservationId = uuidv4();
        result.email = data.email;
        result.roomId = data.roomId;
        result.name = data.name;
        result.startTime = new Date(data.startTime);
        result.endTime = new Date(data.endTime);
        result.detail = data.detail;
        result.status = data.status;
        result.createdAt = new Date();
        return result;
    }
    static newInstanceFromDynamoDBObject(data: any) {
        const result = new Reservation();
        result.reservationId = data.reservationId.S;
        result.email = data.email.S;
        result.roomId = data.roomId.S;
        result.name = data.name.S;
        result.startTime = new Date(Number(data.startTime.N));
        result.endTime = new Date(Number(data.endTime.N));
        result.detail = data.detail.S;
        result.status = data.status.S;
        result.createdAt = new Date(Number(data.createdAt.N));
        if (data.updatedAt) {
            result.updatedAt = new Date(Number(data.updatedAt.N));
        }
        return result;
    }
}
