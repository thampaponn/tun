import { Injectable } from '@nestjs/common';
import { CreateImageDto } from './dto/create-image.dto';
import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ImageService {
  private readonly s3 = new S3Client({
    region: 'us-east-1',
    credentials: {
      accessKeyId: 'ASIATCKAP6XC2KG4PXN7',
      secretAccessKey: 'L2fsFU0D1yY/KsV7YDpQ38qJft80hRChjoFhHVbN',
      sessionToken: 'FwoGZXIvYXdzEOz//////////wEaDE1YzMna8fwPCD4bPCLFASJom+qV9Rm5vtopWtdXmk7sZnkFN8FXtW8oL5NYeg1VkcVgJqS2oZeNeB/jji6SvNblGNke8bVBVAm97y2lNuVzhUAUWp65pvTB5ESbjRAdHkHjC5fs+in8deO+CN4z4WIsHKQOJdgvIswYoY87WGNydpSBSi2ruoQY+y59s5m9y1o9FXzx6+4Yy3T5yfQD1qUYjYU/SiPo8Ki6zbGyTGdsLMzSn6YboCLhJ+YeHObWLfDKGvaDr6nmiYowXE9QJ3Mjc6t2KOHPq68GMi306KNEzi0xrK7nUe2T2XAmS1tGP/pL+VRPCWJJeoLdIbtShbA2PXky118/EeU='
    }
  });
  constructor(private readonly configService: ConfigService) { }

  async uploadImage(fileName: string, file: Buffer) {
    fileName = `${Date.now()}_${fileName}`
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
