import { Injectable } from '@nestjs/common';
import { PaymentDriver } from '../interfaces/payment-driver.interface';
import axios from 'axios';
import * as crypto from 'crypto';

@Injectable()
export class HumoDriver implements PaymentDriver {
  private readonly apiUrl = 'https://api.humo.tj/v1';
  private readonly merchantId = 'your_merchant_id';
  private readonly secretKey = 'your_secret_key';

  private generateSignature(data: any): string {
    const sortedKeys = Object.keys(data).sort();
    const signString = sortedKeys.map((key) => `${key}=${data[key]}`).join('&');
    return crypto
      .createHmac('sha256', this.secretKey)
      .update(signString)
      .digest('hex');
  }

  async createPayment(data: any): Promise<any> {
    const { orderId, amount, currency = 'UZS' } = data;

    const payload = {
      merchant_id: this.merchantId,
      order_id: orderId,
      amount: amount,
      currency: currency,
      timestamp: Math.floor(Date.now() / 1000),
    };

    payload['signature'] = this.generateSignature(payload);

    try {
      const response = await axios.post(
        `${this.apiUrl}/payment/create`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        },
      );

      return {
        provider: 'humo',
        transactionId: response.data.transaction_id,
        status: response.data.status,
        paymentUrl: response.data.payment_url,
        ...response.data,
      };
    } catch (error) {
      throw new Error(`Humo payment creation failed: ${error.message}`);
    }
  }

  async checkPayment(data: any): Promise<any> {
    const { transactionId } = data;

    const payload = {
      merchant_id: this.merchantId,
      transaction_id: transactionId,
      timestamp: Math.floor(Date.now() / 1000),
    };

    payload['signature'] = this.generateSignature(payload);

    try {
      const response = await axios.post(
        `${this.apiUrl}/payment/status`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      return {
        provider: 'humo',
        transactionId: transactionId,
        status: response.data.status,
        ...response.data,
      };
    } catch (error) {
      throw new Error(`Humo payment check failed: ${error.message}`);
    }
  }

  async cancelPayment(data: any): Promise<any> {
    const { transactionId } = data;

    const payload = {
      merchant_id: this.merchantId,
      transaction_id: transactionId,
      timestamp: Math.floor(Date.now() / 1000),
    };

    payload['signature'] = this.generateSignature(payload);

    try {
      const response = await axios.post(
        `${this.apiUrl}/payment/refund`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      return {
        provider: 'humo',
        transactionId: transactionId,
        status: 'refunded',
        ...response.data,
      };
    } catch (error) {
      throw new Error(`Humo payment cancellation failed: ${error.message}`);
    }
  }
}
