import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import type { Log } from './logs.entity';
import type { CreateLogDto } from './logs.service';
import { LogsService } from './logs.service';

@Controller('logs')
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  @Post()
  async create(@Body() createLogDto: CreateLogDto): Promise<Log> {
    return await this.logsService.create(createLogDto);
  }

  @Get()
  async findAll(
    @Query('level') level?: string,
    @Query('context') context?: string,
  ): Promise<Log[]> {
    if (level) {
      return await this.logsService.findByLevel(level);
    }
    if (context) {
      return await this.logsService.findByContext(context);
    }
    return await this.logsService.findAll();
  }

  @Get('user/:userId')
  async findByUserId(@Param('userId') userId: number): Promise<Log[]> {
    return await this.logsService.findByUserId(userId);
  }

  @Delete('cleanup/:days')
  async deleteOldLogs(
    @Param('days') days: number,
  ): Promise<{ message: string }> {
    await this.logsService.deleteOldLogs(days);
    return { message: `Logs older than ${days} days have been deleted` };
  }
}
