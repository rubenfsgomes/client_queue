import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Customer } from '../models/customer.model';
import * as crypto from 'crypto';

@Injectable()
export class CustomerService {
  constructor(@InjectModel('Customer') private readonly customerModel: Model<Customer>) {}

  async addCustomer(customer: Customer) {
    if (!customer.name) {
      return { result: 'missing name' };
    }

    const newCustomer = new this.customerModel(customer);
    await newCustomer.save();
  
    await this.customerModel.find().sort({ priority: -1, createdAt: 1 }).exec();

    return { result: true };
  }
  
  async getNextCustomer() {
    const customer = await this.customerModel.findOne().sort({ createdAt: 1 }).exec();
    if (customer) {
      await customer.remove();
      return { result: customer };
    } else {
      return { result: null };
    }
  }

  async resetQueue(code: string) {
    const hash = crypto.createHash('sha256').update(process.env.RESET_CODE_SALT + code).digest('hex');
    if (hash === process.env.RESET_CODE_HASH) {
      await this.customerModel.deleteMany({}).exec();
      return { result: true };
    } else {
      return { result: false };
    }
  }

  async askToReset() {
    const code = crypto.randomBytes(16).toString('hex');
    return { code: code };
  }
}
