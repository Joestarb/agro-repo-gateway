import { Controller, Get, Query } from '@nestjs/common';
import { SensorsService } from './sensors.service';

@Controller('sensors')
export class SensorsController {
  constructor(private readonly sensorsService: SensorsService) {}

  // Últimos valores de todos o de un tipo
  @Get('latest')
  async getLatest(@Query('sensorType') sensorType?: string) {
    return this.sensorsService.getLatest(sensorType);
  }

  // Histórico de un tipo de sensor
  @Get('history')
  async getHistory(
    @Query('sensorType') sensorType: string,
    @Query('limit') limit = 50,
  ) {
    return this.sensorsService.getHistory(sensorType, Number(limit));
  }
}
