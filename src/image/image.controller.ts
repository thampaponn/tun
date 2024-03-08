import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, ParseFilePipe, FileTypeValidator } from '@nestjs/common';
import { ImageService } from './image.service';
import { CreateImageDto } from './dto/create-image.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) { }

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(@UploadedFile(new ParseFilePipe({ validators: [new FileTypeValidator({ fileType: 'image/jpeg' })] })) image: Express.Multer.File): Promise<void> {
    await this.imageService.uploadImage(image.originalname, image.buffer);
  }

  @Delete(':id')
  async deleteImage(@Param('id') id: string) {
    await this.imageService.delete(id);
  }
}
