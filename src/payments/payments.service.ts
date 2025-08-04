import { Injectable } from '@nestjs/common';
import { PaymeDriver } from './drivers/payme.driver';
import { ClickDriver } from './drivers/click.driver';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly paymeDriver: PaymeDriver,
    private readonly clickDriver: ClickDriver,
  ) {}

  async create(provider: string, data: any) {
    switch (provider) {
      case 'payme':
        return this.paymeDriver.createPayment(data);
      case 'click':
        return this.clickDriver.createPayment(data);
      default:
        throw new Error('Noto‘g‘ri provider');
    }
  }

  async check(provider: string, data: any) {
    switch (provider) {
      case 'payme':
        return this.paymeDriver.checkPayment(data);
      case 'click':
        return this.clickDriver.checkPayment(data);
      default:
        throw new Error('Noto‘g‘ri provider');
    }
  }
}
