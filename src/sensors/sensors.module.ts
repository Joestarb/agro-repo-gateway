import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SensorsController } from './sensors.controller';
import { SensorsService } from './sensors.service';
import { LatestReadingSchema, SensorEventSchema } from '@agro-project/schemas';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'LatestReading', schema: LatestReadingSchema },
      { name: 'SensorEvent', schema: SensorEventSchema },
    ]),
  ],
  controllers: [SensorsController],
  providers: [SensorsService],
})
export class SensorsModule {}
