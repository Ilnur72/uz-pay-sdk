import { Injectable } from '@nestjs/common';
import { PaymentDriver } from '../interfaces/payment-driver.interface';
import { PaymentConfigService } from '../../config/payment-config.service';
import axios from 'axios';
import * as crypto from 'crypto';

@Injectable()
export class ApelsinDriver implements PaymentDriver {
  private config: any;

  constructor(private readonly configService: PaymentConfigService) {
    this.config = this.configService.apelsinConfig;
  }

  private generateToken(data: any): string {
    const values = Object.keys(data)
      .sort()
      .map((key) => data[key])
      .join('');
    return crypto
      .createHash('sha256')
      .update(values + this.config.password)
      .digest('hex');
  }

  async createPayment(data: any): Promise<any> {
    const { orderId, amount, description, returnUrl } = data;

    const payload = {
      TerminalKey: this.config.terminalKey,
      Amount: amount * 100, // Apelsin tiyin bilan ishlaydi
      OrderId: orderId,
      Description: description || "To'lov",
      ReturnUrl: returnUrl,
    };

    payload['Token'] = this.generateToken(payload);

    try {
      const response = await axios.post(`${this.config.apiUrl}/Init`, payload, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });

      return {
        provider: 'apelsin',
        transactionId: response.data.PaymentId,
        status: response.data.Status,
        paymentUrl: response.data.PaymentURL,
        ...response.data,
      };
    } catch (error) {
      throw new Error(`Apelsin payment creation failed: ${error.message}`);
    }
  }

  async checkPayment(data: any): Promise<any> {
    const { transactionId } = data;

    const payload = {
      TerminalKey: this.config.terminalKey,
      PaymentId: transactionId,
    };

    payload['Token'] = this.generateToken(payload);

    try {
      const response = await axios.post(
        `${this.config.apiUrl}/GetState`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      return {
        provider: 'apelsin',
        transactionId: transactionId,
        status: response.data.Status,
        ...response.data,
      };
    } catch (error) {
      throw new Error(`Apelsin payment check failed: ${error.message}`);
    }
  }

  async cancelPayment(data: any): Promise<any> {
    const { transactionId, amount } = data;

    const payload = {
      TerminalKey: this.config.terminalKey,
      PaymentId: transactionId,
      Amount: amount ? amount * 100 : undefined,
    };

    payload['Token'] = this.generateToken(payload);

    try {
      const response = await axios.post(
        `${this.config.apiUrl}/Cancel`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      return {
        provider: 'apelsin',
        transactionId: transactionId,
        status: 'cancelled',
        ...response.data,
      };
    } catch (error) {
      throw new Error(`Apelsin payment cancellation failed: ${error.message}`);
    }
  }
}
