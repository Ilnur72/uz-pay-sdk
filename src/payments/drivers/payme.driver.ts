import { Injectable } from '@nestjs/common';
import { PaymentDriver } from '../interfaces/payment-driver.interface';
import axios from 'axios';
import { generateBasicAuthHeader } from '../utils/signer.util';

@Injectable()
export class PaymeDriver implements PaymentDriver {
  private readonly apiUrl = 'https://checkout.test.paycom.uz/api';

  private readonly merchantId = 'your_merchant_id';
  private readonly key = 'your_merchant_key';

  async createPayment(data: any): Promise<any> {
    const { orderId, amount } = data;
    const time = Date.now();

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
      Authorization: generateBasicAuthHeader(this.merchantId, this.key),
    };

    const response = await axios.post(this.apiUrl, payload, { headers });

    return response.data;
  }

  async checkPayment(data: any): Promise<any> {
    const { transactionId } = data;

    const payload = {
      method: 'CheckTransaction',
      params: {
        id: transactionId,
      },
    };

    const headers = {
      'Content-Type': 'application/json',
      Authorization: generateBasicAuthHeader(this.merchantId, this.key),
    };

    const response = await axios.post(this.apiUrl, payload, { headers });

    return response.data;
  }
}
