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
    image.originalname = `${Date.now()}_${image.originalname}`
    const room = await this.repository.create(image, Room.newInstanceFromDTO(createRoomDto));
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

  update(id: string, status: boolean) {
    return this.repository.update(id, status);
  }

  delete(id: string) {
    return this.repository.delete(id);
  }
}
