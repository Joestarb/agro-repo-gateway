import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class SensorsService {
  constructor(
    @InjectModel('LatestReading') private readonly latestModel: Model<any>,
    @InjectModel('SensorEvent') private readonly eventModel: Model<any>,
  ) {}

  async getLatest(sensorType?: string) {
    const filter = sensorType ? { sensorType } : {};
    return this.latestModel.find(filter).select('-_id sensorType sensorId ts value').lean();
  }

  async getHistory(sensorType: string, limit = 50) {
    return this.eventModel
      .find({ sensorType })
      .sort({ ts: -1 })
      .limit(limit)
      .select('-_id sensorType sensorId ts value')
      .lean();
  }
}
