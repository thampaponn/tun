import { Injectable } from '@nestjs/common';
import { CreateImageDto } from './dto/create-image.dto';
import { DeleteObjectCommand, GetObjectCommand, ListObjectsCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { ScanCommand } from '@aws-sdk/client-dynamodb';

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

  async findAll() {
    try {
      const response = await this.s3.send(
        new ListObjectsCommand({
          Bucket: 'space-creator',
        })
      );

      const objectList = response.Contents.map(object => object.Key);

      return objectList;
    } catch (error) {
      console.error("Error fetching objects from S3:", error);
      throw error;
    }
  }

  async findOne(fileName: string) {
    await this.s3.send(
      new GetObjectCommand({
        Bucket: 'space-creator',
        Key: fileName,
      })
    )
    return 'https://space-creator.s3.amazonaws.com/' + fileName
  }

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
