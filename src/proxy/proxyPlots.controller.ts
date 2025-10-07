import { HttpService } from '@nestjs/axios';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { lastValueFrom } from 'rxjs';

@Controller('plots')
export class ProxyPlotsController {
  constructor(private readonly http: HttpService) {}

  private base() {
    const baseUrl =
      process.env.PLOTS_SERVICE_URL || 'http://agro-repo-plots:3000';
    return `${baseUrl}/parcelas`;
  }

  @Get()
  async findAll() {
    const r = await lastValueFrom(this.http.get(`${this.base()}`));
    return r.data;
  }

  @Get('inactivas')
  async findInactive() {
    const r = await lastValueFrom(this.http.get(`${this.base()}/inactivas`));
    return r.data;
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const r = await lastValueFrom(this.http.get(`${this.base()}/${id}`));
    return r.data;
  }

  @Post()
  async create(@Body() dto: any) {
    const r = await lastValueFrom(this.http.post(`${this.base()}`, dto));
    return r.data;
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: any) {
    const r = await lastValueFrom(this.http.put(`${this.base()}/${id}`, dto));
    return r.data;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const r = await lastValueFrom(this.http.delete(`${this.base()}/${id}`));
    return r.data;
  }
}
