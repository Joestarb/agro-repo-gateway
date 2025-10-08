import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Log } from './logs.entity';

export interface CreateLogDto {
  level: string;
  message: string;
  context?: string;
  userId?: number;
  ip?: string;
  stack?: string;
}

@Injectable()
export class LogsService {
  constructor(
    @InjectRepository(Log)
    private logsRepository: Repository<Log>,
  ) {}

  async create(createLogDto: CreateLogDto): Promise<Log> {
    const log = this.logsRepository.create(createLogDto);
    return await this.logsRepository.save(log);
  }

  async findAll(): Promise<Log[]> {
    return await this.logsRepository.find({
      order: { timestamp: 'DESC' },
    });
  }

  async findByLevel(level: string): Promise<Log[]> {
    return await this.logsRepository.find({
      where: { level },
      order: { timestamp: 'DESC' },
    });
  }

  async findByUserId(userId: number): Promise<Log[]> {
    return await this.logsRepository.find({
      where: { userId },
      order: { timestamp: 'DESC' },
    });
  }

  async findByContext(context: string): Promise<Log[]> {
    return await this.logsRepository.find({
      where: { context },
      order: { timestamp: 'DESC' },
    });
  }

  async deleteOldLogs(daysOld: number): Promise<void> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    await this.logsRepository
      .createQueryBuilder()
      .delete()
      .where('timestamp < :cutoffDate', { cutoffDate })
      .execute();
  }
}
