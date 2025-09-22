import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    const variable = 'holamundo' + process.env.AUTH_PORT_PROD;
    return variable;
  }
}
