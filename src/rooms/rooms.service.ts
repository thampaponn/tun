import { Injectable } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { RoomsRepository } from './rooms.repository';
import { Room } from './entities/room.entity';
import { ImageService } from 'src/image/image.service';
import { ApiConsumes, ApiProperty, ApiTags } from '@nestjs/swagger';

@Injectable()
export class RoomsService {

  constructor(private readonly repository: RoomsRepository, private readonly imageService: ImageService) { }
  async create(image: Express.Multer.File, createRoomDto: CreateRoomDto) {
    const room = await this.repository.upsertOne(Room.newInstanceFromDTO(createRoomDto));
    if (room) {
      await this.imageService.uploadImage(image.originalname, image.buffer);
    }
    return 'Room created'
  }

  findAll() {
    return this.repository.findAll();
  }

  findOne(id: string) {
    return this.repository.findByRoomId(id);
  }

  async update(id: string, updateRoomDto: UpdateRoomDto) {
    const existingObject = await this.repository.findByRoomId(id);
    if (updateRoomDto.detail) {
      existingObject.detail = updateRoomDto.detail;
    }
    existingObject.updatedAt = new Date();

    return this.repository.upsertOne(existingObject);
  }

  delete(id: string) {
    return this.repository.delete(id);
  }
}
