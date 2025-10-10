import { Controller, Get } from '@nestjs/common';
import axios from 'axios';

@Controller('sensors')
export class SensorsController {
  private readonly baseUrl = process.env.API_BASE_URL!;

  @Get()
  async getSensorData() {
    try {
      const { data } = await axios.get(`${this.baseUrl}/all`);
      return data;
    } catch (err: any) {
      console.error('❌ Error consultando sensores:', err.message);
      return { error: 'No se pudo obtener los datos de sensores' };
    }
  }
}
