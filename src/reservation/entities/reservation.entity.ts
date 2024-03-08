import { CreateReservationDto } from "../dto/create-reservation.dto";
import { v4 as uuidv4 } from 'uuid';

export class Reservation {
    reserveId: string;
    userId: string;
    roomId: string;
    startTime: Date;
    endTime: Date;
    detail: string;
    status: boolean;
    createdAt: Date;
    updatedAt?: Date;

    static newInstanceFromDTO(data: CreateReservationDto) {
        const result = new Reservation();
        result.reserveId = uuidv4();
        result.userId = data.userId;
        result.roomId = data.roomId;
        result.startTime = new Date(data.startTime);
        result.endTime = new Date(data.endTime);
        result.detail = data.detail;
        result.createdAt = new Date();
        return result;
    }
    static newInstanceFromDynamoDBObject(data: any) {
        const result = new Reservation();
        result.reserveId = data.reserveId.S;
        result.userId = data.userId.S;
        result.roomId = data.roomId.S;
        result.startTime = new Date(Number(data.startTime.N));
        result.endTime = new Date(Number(data.endTime.N));
        result.detail = data.detail.S;
        result.createdAt = new Date(Number(data.createdAt.N));
        if (data.updatedAt) {
            result.updatedAt = new Date(Number(data.updatedAt.N));
        }
        return result;
    }
}
