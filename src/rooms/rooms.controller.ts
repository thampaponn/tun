import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageService } from 'src/image/image.service';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';

@Controller('rooms')
@ApiTags('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService, private readonly imageService: ImageService) { }

  @Post('create')
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({type: CreateRoomDto})
  create(@UploadedFile() image: Express.Multer.File, @Body() createRoomDto: CreateRoomDto) {

    return this.roomsService.create(image, createRoomDto);
  }

  @Get()
  findAll() {
    return this.roomsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roomsService.findOne(id);
  }

  @Patch(':id')
  @ApiBody({type: UpdateRoomDto})
  update(@Param('id') id: string, @Body() updateRoomDto: UpdateRoomDto) {
    return this.roomsService.update(id, updateRoomDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.roomsService.delete(id);
  }
}
