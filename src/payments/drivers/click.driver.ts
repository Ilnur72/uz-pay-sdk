import { Injectable } from '@nestjs/common';
import { PaymentDriver } from '../interfaces/payment-driver.interface';
import { PaymentConfigService } from '../../config/payment-config.service';
import axios from 'axios';
import * as crypto from 'crypto';

@Injectable()
export class ClickDriver implements PaymentDriver {
  private config: any;

  constructor(private readonly configService: PaymentConfigService) {
    this.config = this.configService.clickConfig;
  }

  private generateSignature(data: any): string {
    const signString = Object.keys(data)
      .sort()
      .map((key) => `${key}=${data[key]}`)
      .join('&');
    return crypto
      .createHash('md5')
      .update(signString + this.config.secretKey)
      .digest('hex');
  }

  async createPayment(data: any): Promise<any> {
    const { orderId, amount, phoneNumber } = data;

    const payload = {
      service_id: this.config.serviceId,
      merchant_id: this.config.merchantId,
      amount: amount,
      transaction_param: orderId,
      phone_number: phoneNumber,
      timestamp: Math.floor(Date.now() / 1000),
    };

    payload['sign'] = this.generateSignature(payload);

    try {
      const response = await axios.post(
        `${this.config.apiUrl}/payment/create`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        },
      );

      return {
        provider: 'click',
        transactionId: response.data.transaction_id,
        status: response.data.status,
        paymentUrl: response.data.payment_url,
        ...response.data,
      };
    } catch (error) {
      throw new Error(`Click payment creation failed: ${error.message}`);
    }
  }

  async checkPayment(data: any): Promise<any> {
    const { transactionId } = data;

    const payload = {
      service_id: this.config.serviceId,
      merchant_id: this.config.merchantId,
      transaction_id: transactionId,
      timestamp: Math.floor(Date.now() / 1000),
    };

    payload['sign'] = this.generateSignature(payload);

    try {
      const response = await axios.post(
        `${this.config.apiUrl}/payment/status`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      return {
        provider: 'click',
        transactionId: transactionId,
        status: response.data.status,
        ...response.data,
      };
    } catch (error) {
      throw new Error(`Click payment check failed: ${error.message}`);
    }
  }
}
