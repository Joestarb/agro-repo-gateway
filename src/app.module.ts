import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProxyAuthController } from './proxy/proxyAuth.controller';
import { ProxyPlotsController } from './proxy/proxyPlots.controller';
@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../../../.env',
    }),
  ],
  controllers: [ProxyAuthController, ProxyPlotsController],
  providers: [AppService],
})
export class AppModule {}
