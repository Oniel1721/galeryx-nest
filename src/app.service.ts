import { Injectable } from '@nestjs/common';

const fs = require('fs')
const path = require('path')

@Injectable()
export class AppService {
  getHello() {
    return fs.readFileSync(path.join(__dirname, '../src/html/index.html')).toString();
  }
}
