import { Injectable } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { RoomsRepository } from './rooms.repository';
import { Room } from './entities/room.entity';

@Injectable()
export class RoomsService {

  constructor(private readonly repository: RoomsRepository) { }

  create(createRoomDto: CreateRoomDto) {
    return this.repository.upsertOne(Room.newInstanceFromDTO(createRoomDto));
  }

  findAll() {
    return this.repository.findAll();
  }

  findOne(id: string) {
    return this.repository.findByRoomId(id);
  }

  async update(id: string, updateRoomDto: UpdateRoomDto) {
    const existingObject = await this.repository.findByRoomId(id);
    if (updateRoomDto.image) {
      existingObject.image = updateRoomDto.image;
    }
    existingObject.updatedAt = new Date();

    return this.repository.upsertOne(existingObject);
  }

  delete(id: string) {
    return this.repository.delete(id);
  }
}
