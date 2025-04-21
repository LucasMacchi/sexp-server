import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    const date = new Date()
    return 'Pinged at '+date;
  }
}
