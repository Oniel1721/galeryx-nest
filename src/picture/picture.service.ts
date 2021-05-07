import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Picture } from './interfaces/picture.interface';

@Injectable()
export class PictureService {
  constructor(@InjectModel('Picture') private pictureModel: Model<any>) {}

  async getPictures(query): Promise<Picture[]> {
    return await this.pictureModel.find(query);
  }

  async uploadPicture(picture: Picture) {
    let newPicture = new this.pictureModel(picture);
    let pictureSaved = await newPicture.save();

    return pictureSaved;
  }

  async updatePictureName(_id: ObjectId | string, name: string) {
    return await this.pictureModel.updateOne({ _id }, { name });
  }

  async deletePicture(_id, owner: string) {
    return await this.pictureModel.deleteOne({ _id, owner });
  }
}
