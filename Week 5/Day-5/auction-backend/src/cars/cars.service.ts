// cars.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Car, CarDocument } from './schemas/car.schema';

@Injectable()
export class CarsService {
  constructor(@InjectModel(Car.name) private carModel: Model<CarDocument>) {}

  create(car: Partial<Car>) {
    const newCar = new this.carModel(car);
    return newCar.save();
  }

  findAll() {
    return this.carModel.find().populate('sellerId').populate('bids').exec();
  }

  findOne(id: string) {
    return this.carModel
      .findById(id)
      .populate('sellerId')
      .populate('bids')
      .exec();
  }
}
