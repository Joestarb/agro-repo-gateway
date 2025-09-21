import { HttpService } from '@nestjs/axios';
import { Body, Controller, Post } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import {
  LoginDto,
  RegisterDto,
} from '../../../../packages/common/dist/dtos/user.dto';

@Controller('auth')
export class ProxyAuthController {
  constructor(private http: HttpService) {}

  private base() {
    const host = process.env.AUTH_HOST;
    const port = process.env.AUTH_PORT;
    return `http://${host}:${port}/auth`;
  }

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    const r = await lastValueFrom(
      this.http.post(`${this.base()}/register`, dto),
    );
    return r.data as RegisterDto;
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    const r = await lastValueFrom(this.http.post(`${this.base()}/login`, dto));
    return r.data as LoginDto;
  }
}
