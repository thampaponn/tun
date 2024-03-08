import { Injectable } from '@nestjs/common';
import { CreateImageDto } from './dto/create-image.dto';
import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ImageService {
  private readonly s3 = new S3Client({
    region: 'us-east-1',
    credentials: {
      accessKeyId: 'ASIATCKAP6XCRKGS6LMV',
      secretAccessKey: '7W3eO3/E4ad1SINwD7MOwl/xbT38TTry33rGJlAC',
      sessionToken: 'FwoGZXIvYXdzEPL//////////wEaDJZ8JTjNydTOHS6HMSLFATAnK6DqL0SEHDUcvyzx2GBDjecQkN3n2suJqoA3vhXt81UI0R+2N8n/UU7taLjQxXk+A3Hf+Y0en6EVq+i9bsq7pwJcFqGoTaq1pMEcE+GYBXFATvHBk4d6RYHQzTma8mjfdoWRMnVpppls8ypKy4U7V8c2GuFysnUVq3MwJFo+6703nKZdgvhcD8I1Z1UKD/OnlNYanTgAspJb6Dy0dN1OGXRQcuEawLbZtnt30tcthu+aBgPtuk68zc8wkngB9p7N3MhZKPH5rK8GMi1l/A54JEDxgPQ/JEHiLRq025q5XK6cUEKn1cnWLkiKLgwv+bf4mLMH/LR5f8I='
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
