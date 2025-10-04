import { HttpModule } from '@nestjs/axios';
import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { AppService } from './app.service';
import { ProxyAuthController } from './proxy/proxyAuth.controller';
import { ProxyPlotsController } from './proxy/proxyPlots.controller';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './loggin.interceptor';
import { Log } from './logs/logs.entity';
@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../../../.env',
    }),
    TypeOrmModule.forFeature([Log]),
  ],
  controllers: [ProxyAuthController, ProxyPlotsController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    AppService,
  ],
})
export class AppModule implements OnModuleInit {
  constructor(private dataSource: DataSource) {}

  onModuleInit() {
    // TypeORM ya inicializa automáticamente la conexión con forRoot()
    // Solo verificamos que esté conectado
    if (this.dataSource.isInitialized) {
      console.log('Conectado a la base de datos');
    } else {
      console.error(
        'Error: La conexión a la base de datos no se pudo establecer',
      );
      process.exit(1);
    }
  }
}
