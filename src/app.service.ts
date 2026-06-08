import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello() {
    return {
      name: 'EnduroFlow API',
      version: '1.0',
      docs: '/api',
      openapi: '/api-json',
    };
  }
}
