import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const aws = require('aws-sdk');
  aws.config = new aws.Config();
  aws.config.accessKeyId = "ASIAVRUVQ44QK74ZFEHP";
  aws.config.secretAccessKey = "vvQ2fRWkEUc1LTtIA339xdbHeagxfcyCBWtFYltv";
  aws.config.region = "us-east-1";
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
