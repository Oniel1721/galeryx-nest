import {
  Controller,
  Get,
  Post,
  Delete,
  Put,
  Req,
  UseInterceptors,
  UploadedFile,
  Param,
  Res,
} from '@nestjs/common';
import { PictureService } from './picture.service';
import { Request, Express } from 'express';
import { JwtService } from '@nestjs/jwt';
import { FileInterceptor } from '@nestjs/platform-express';
import { Types } from 'mongoose';

@Controller('picture')
export class PictureController {
  constructor(
    private pictureService: PictureService,
    private jwtService: JwtService
  ) {}

  private async checkToken(authorization: string): Promise<string> {
    if (!authorization) return '';
    if (authorization?.indexOf('Bearer ') !== 0) return '';
    const token = authorization?.split(' ')[1];
    if (!token) return '';
    let ans = null;
    try {
      ans = await this.jwtService.verifyAsync(token, { secret: 'una vaina' });
    } catch (err) {
      console.log('invalid token');
    }

    if (!ans) return '';

    return ans.username;
  }

  private errorResponses = {
    invalidToken: {
      statusCode: 401,
      message: 'Your token is invalid',
    },
    invalidId: {
      statusCode: 401,
      message: "That Id is'nt valid",
    },
    invalidPicture: {
      statusCode: 401,
      message: 'That picture is not valid',
    },
  };


  @Get()
  async getPictures(@Req() req: Request) {
    const owner = await this.checkToken(req.headers.authorization);
    if (!owner) return this.errorResponses.invalidToken;
    return await this.pictureService.getPictures({ owner });
  }

  @Get(':id')
  async downloadPicture(@Param('id') id:string, @Req() req:Request){
    const owner = await this.checkToken(req.headers.authorization);
    if (!owner) return this.errorResponses.invalidToken;
    if (!Types.ObjectId.isValid(id)) return this.errorResponses.invalidId;
    const picture = await this.pictureService.downloadPicture(id)
    return picture
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadPicture(
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const owner = await this.checkToken(req.headers.authorization);
    if (!owner) return this.errorResponses.invalidToken;
    let source = file?.buffer?.toString('base64');
    let name = file?.originalname
      ?.slice(0, file.originalname.lastIndexOf('.'))
      .toUpperCase();
    let type = file?.mimetype;

    if (!source || !name || !type) return this.errorResponses.invalidPicture;

    return this.pictureService.uploadPicture({
      source,
      owner,
      name,
      type,
    });
  }

  @Put(':id')
  async updatePicture(@Param('id') id: string, @Req() req: Request) {
    const owner = await this.checkToken(req.headers.authorization);
    if (!owner) return this.errorResponses.invalidToken;
    if (!Types.ObjectId.isValid(id)) return this.errorResponses.invalidId;
    return this.pictureService.updatePictureName(id, req.body?.name);
  }

  @Delete(':id')
  async deletePicture(@Param('id') id: string, @Req() req: Request) {
    const owner = await this.checkToken(req.headers.authorization);
    if (!owner) return this.errorResponses.invalidToken;
    if (!Types.ObjectId.isValid(id)) return this.errorResponses.invalidId;
    return this.pictureService.deletePicture(id, owner);
  }
}
