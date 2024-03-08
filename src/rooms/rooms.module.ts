import { Module } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';
import { RoomsRepository } from './rooms.repository';
import { ImageService } from 'src/image/image.service';

@Module({
  controllers: [RoomsController],
  providers: [RoomsService, RoomsRepository, ImageService],
})
export class RoomsModule {}
