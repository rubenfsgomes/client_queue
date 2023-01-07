import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CustomerService } from '../services/customer.service';
import { Customer } from '../models/customer.model';

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post('addCustomer')
  async addCustomer(@Body() customer: Customer) {
    return this.customerService.addCustomer(customer);
  }

  @Get('getNextCustomer')
  async getNextCustomer() {
    return this.customerService.getNextCustomer();
  }

  @Get('reset')
  async resetQueue(@Query('code') code: string) {
    return this.customerService.resetQueue(code);
  }

  @Get('ask-to-reset')
  async askToReset() {
    return this.customerService.askToReset();
  }
}

