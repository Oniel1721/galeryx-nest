import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PictureController } from './picture.controller';
import { PictureService } from './picture.service';
import { PictureSchema } from './schemas/picture.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{name:"Picture", schema: PictureSchema}]),
    JwtModule.register({})
  ],
  controllers: [PictureController],
  providers: [PictureService]
})
export class PictureModule {}
