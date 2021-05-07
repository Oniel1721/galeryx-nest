import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from "@nestjs/jwt";
import { UserSchema } from "./schemas/user.schema";

@Module({
  imports: [
    MongooseModule.forFeature([{name: 'User', schema: UserSchema}]),
    JwtModule.register({})
  ],
  providers: [UserService],
  controllers: [UserController]
})
export class UserModule {}

