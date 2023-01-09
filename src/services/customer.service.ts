import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Customer } from '../models/customer.model';
const CodeModel = require('../models/code.model');
const jwt = require('jsonwebtoken');
require('dotenv').config();

import * as crypto from 'crypto';
const bcrypt = require('bcrypt');

@Injectable()
export class CustomerService {
  private codeModel: any;
  constructor(@InjectModel('Customer') private readonly customerModel: Model<Customer>) {
    this.codeModel = CodeModel;
  }

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
    if (jwt.verify(code, process.env.RESET_CODE_SECRET)) {
      await this.customerModel.deleteMany({}).exec();
      return { result: true };
    } else {
      return { result: false };
    }
  }
  
  async askToReset() {
    const code = jwt.sign({var: process.env.RESET_CODE_HASH}, process.env.RESET_CODE_SECRET);
    return { code: code };
  }
}
