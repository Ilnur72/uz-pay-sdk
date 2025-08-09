import { Injectable } from '@nestjs/common';
import { PaymentDriver } from '../interfaces/payment-driver.interface';
import axios from 'axios';
import { generateBasicAuthHeader } from '../utils/signer.util';
import { PaymentConfigService } from '../../config/payment-config.service';

@Injectable()
export class PaymeDriver implements PaymentDriver {
  constructor(private readonly configService: PaymentConfigService) {}

  async createPayment(data: any): Promise<any> {
    const { orderId, amount } = data;
    const time = Date.now();
    const config = this.configService.paymeConfig;

    const payload = {
      method: 'CreateTransaction',
      params: {
        id: orderId,
        time: time,
        amount: amount,
        account: { order_id: orderId },
      },
    };

    const headers = {
      'Content-Type': 'application/json',
      Authorization: generateBasicAuthHeader(config.merchantId, config.key),
    };

    const response = await axios.post(config.apiUrl, payload, { headers });

    return response.data;
  }

  async checkPayment(data: any): Promise<any> {
    const { transactionId } = data;
    const config = this.configService.paymeConfig;

    const payload = {
      method: 'CheckTransaction',
      params: {
        id: transactionId,
      },
    };

    const headers = {
      'Content-Type': 'application/json',
      Authorization: generateBasicAuthHeader(config.merchantId, config.key),
    };

    const response = await axios.post(config.apiUrl, payload, { headers });

    return response.data;
  }
}
