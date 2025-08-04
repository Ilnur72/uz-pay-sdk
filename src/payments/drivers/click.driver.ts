import { Injectable } from '@nestjs/common';
import { PaymentDriver } from '../interfaces/payment-driver.interface';

@Injectable()
export class ClickDriver implements PaymentDriver {
  async createPayment(data: any): Promise<any> {
    // TODO: Click create payment logika
    return { provider: 'click', status: 'created' };
  }

  async checkPayment(data: any): Promise<any> {
    // TODO: Click check payment logika
    return { provider: 'click', status: 'checked' };
  }
}
