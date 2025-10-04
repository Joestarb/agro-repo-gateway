import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { ProxyAuthController } from './proxy/proxyAuth.controller';
import { ProxyPlotsController } from './proxy/proxyPlots.controller';
import { SensorsModule } from './sensors/sensors.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    // Config primero, para que las variables estén listas
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI!, {
      dbName: process.env.DB_NAME,
    }),
    SensorsModule,
    HttpModule,
  ],
  controllers: [ProxyAuthController, ProxyPlotsController],
  providers: [AppService],
})
export class AppModule {}