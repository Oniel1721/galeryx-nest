import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type UserDocument = Document;


@Schema()
export class User{
    @Prop({required: true, minlength: 6, maxlength: 24, unique: true})
    username: string;

    @Prop({required: true})
    password: string;
}

export const UserSchema = SchemaFactory.createForClass(User)