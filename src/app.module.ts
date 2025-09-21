import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProxyAuthController } from './proxy/proxy.controller';

@Module({
  imports: [HttpModule],
  controllers: [AppController, ProxyAuthController],
  providers: [AppService],
})
export class AppModule {}
