import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import {MongooseModule} from '@nestjs/mongoose'
import { PictureModule } from './picture/picture.module';
import { EventGateway } from './socket/events.gateway';

@Module({
  imports: [
    UserModule,
    MongooseModule.forRoot('mongodb+srv://Oniel:532641879@cluster0.extps.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {useNewUrlParser: true}),
    PictureModule
  ],
  controllers: [AppController],
  providers: [AppService, EventGateway],
})
export class AppModule {}
