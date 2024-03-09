import { Injectable } from '@nestjs/common';
import { CreateImageDto } from './dto/create-image.dto';
import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ImageService {
  private readonly s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        sessionToken: process.env.AWS_SESSION_TOKEN
    }
  });
  constructor(private readonly configService: ConfigService) { }

  async uploadImage(fileName: string, file: Buffer) {
    await this.s3.send(
      new PutObjectCommand({
        Bucket: 'space-creator',
        Key: fileName,
        Body: file,
      })
    )
    return 'success'
  }

  // async findOne(fileName: string) {
  //   return ;
  // }

  async delete(fileName: string) {
    await this.s3.send(
      new DeleteObjectCommand({
        Bucket: 'space-creator',
        Key: fileName,
      })
    )
    return 'deleted'
  }
}
