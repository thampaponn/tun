import { v4 as uuidv4 } from 'uuid';
import { CreateRoomDto } from '../dto/create-room.dto';

export class Room {
    roomId: string;
    image: string;
    name: string;
    floor: string;
    detail: string;
    description: string;
    totalSeat: number;
    status: boolean;
    createdAt: Date;
    updatedAt?: Date;

    static newInstanceFromDTO(data: CreateRoomDto) {
        const result = new Room();
        result.roomId = uuidv4();
        result.image = 'https://space-creator.s3.amazonaws.com/' + data.image;
        result.name = data.name;
        result.floor = data.floor;
        result.detail = data.detail;
        result.description = data.description;
        result.totalSeat = data.totalSeat;
        result.status = data.status;
        result.createdAt = new Date();
        return result;
    }
    static newInstanceFromDynamoDBObject(data: any) {
        const result = new Room();
        result.roomId = data.roomId.S;
        result.image = 'https://space-creator.s3.amazonaws.com/' + data.image.S;
        result.name = data.name.S;
        result.floor = data.floor.S;
        result.detail = data.detail.S;
        result.description = data.description.S;
        result.totalSeat = data.totalSeat.N;
        result.status = data.status.BOOL;
        result.createdAt = new Date(Number(data.createdAt.N));
        if (data.updatedAt) {
            result.updatedAt = new Date(Number(data.updatedAt.N));
        }
        return result;
    }
}
