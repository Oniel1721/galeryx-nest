import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type PictureDocument = Document;


@Schema()
export class Picture{
    @Prop({required: true, minlength: 6, maxlength: 24})
    owner: string;

    @Prop({default: `${Date.now()}`, required: true})
    name: string;

    @Prop({required: true})
    type: string;

    @Prop({required: true})
    source: string;

    @Prop({default: 'without'})
    category: string;
}

export const PictureSchema = SchemaFactory.createForClass(Picture)