import { Controller, Post, Body } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@Controller('auth')
export class ProxyAuthController {
  constructor(private http: HttpService) {}

  private base() {
    const host = process.env.AUTH_HOST;
    const port = process.env.AUTH_PORT ;
    return `http://${host}:${port}/auth`;
  }

  @Post('register')
  async register(@Body() dto: any) {
    const r = await lastValueFrom(this.http.post(`${this.base()}/register`, dto));
    return r.data;
  }

  @Post('login')
  async login(@Body() dto: any) {
    const r = await lastValueFrom(this.http.post(`${this.base()}/login`, dto));
    return r.data;
  }
}
