import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Injectable, OnModuleInit } from '@nestjs/common';
import axios from 'axios';

@WebSocketGateway({
  cors: { origin: '*' },
})
@Injectable()
export class SensorGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;

  private readonly baseUrl = process.env.API_BASE_URL!;
  private readonly pollInterval = parseInt(
    process.env.POLL_INTERVAL_MS || '60000',
    10,
  );

  async onModuleInit() {
    console.log('🚀 Gateway de sensores inicializado');

    setInterval(async () => {
      try {
        const { data } = await axios.get(`${this.baseUrl}/all`);

        if (Array.isArray(data)) {
          // Caso raro: la API devuelve un array
          for (const reading of data) {
            console.log('📡 Re‑emitiendo lectura (array):', reading);
            this.server.emit('reading', reading);
          }
        } else if (typeof data === 'object' && data !== null) {
          // Caso normal: la API devuelve un objeto con sensores
          for (const [sensorType, readings] of Object.entries(data)) {
            if (typeof readings === 'object' && readings !== null) {
              const payload = { sensorType, ...readings };
              console.log('📡 Re‑emitiendo lectura (objeto):', payload);
              this.server.emit('reading', payload);
            } else {
              const payload = { sensorType, value: readings };
              console.log('📡 Re‑emitiendo lectura (valor simple):', payload);
              this.server.emit('reading', payload);
            }
          }
        } else {
          console.warn('⚠️ Respuesta inesperada de la API:', data);
        }
      } catch (err: any) {
        console.error('❌ Error consultando API de sensores:', err.message);
      }
    }, this.pollInterval);
  }
}
