import { HttpService } from '@nestjs/axios';
import { Body, Controller, Post } from '@nestjs/common';
import axios from 'axios';
import { lastValueFrom } from 'rxjs';
import {
  LoginDto,
  RegisterDto,
} from '../../../../packages/common/dist/dtos/user.dto';
@Controller('auth')
export class ProxyAuthController {
  constructor(private http: HttpService) {}

  private base() {
    // Usar AUTH_SERVICE_URL que ya está configurada correctamente para Docker
    const baseUrl = process.env.AUTH_SERVICE_URL;
    return `${baseUrl}/auth`;
  }

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    try {
      const r = await lastValueFrom(
        this.http.post(`${this.base()}/register`, dto),
      );
      return r.data as RegisterDto;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.data) {
        const data = error.response.data as {
          message?: string;
          error?: string;
          statusCode?: number;
        };
        return {
          message: data.message,
          error: data.error,
          statusCode: data.statusCode,
        };
      }
      throw error;
    }
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    try {
      const r = await lastValueFrom(
        this.http.post(`${this.base()}/login`, dto),
      );
      return r.data as LoginDto;
    } catch (error: unknown) {
      if (
        axios.isAxiosError(error) &&
        error.response?.data &&
        error.response.status === 401
      ) {
        // Captura específicamente el error 401 y lo retorna
        const data = error.response.data as {
          message?: string;
          error?: string;
          statusCode?: number;
        };
        return {
          message: data.message,
          error: data.error,
          statusCode: data.statusCode,
        };
      }
      throw error;
    }
  }
}
