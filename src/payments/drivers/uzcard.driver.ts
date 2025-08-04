import { Injectable } from '@nestjs/common';
import { PaymentDriver } from '../interfaces/payment-driver.interface';
import axios from 'axios';

@Injectable()
export class UzcardDriver implements PaymentDriver {
  private readonly apiUrl = 'https://api.uzcard.uz/api/v1';
  private readonly terminalId = 'your_terminal_id';
  private readonly terminalUserId = 'your_terminal_user_id';
  private readonly serviceId = 'your_service_id';

  async createPayment(data: any): Promise<any> {
    const { orderId, amount, cardNumber } = data;

    const payload = {
      terminal_id: this.terminalId,
      terminal_user_id: this.terminalUserId,
      service_id: this.serviceId,
      amount: amount,
      order_id: orderId,
      card_number: cardNumber,
    };

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
        provider: 'uzcard',
        transactionId: response.data.transaction_id,
        status: response.data.status,
        paymentUrl: response.data.payment_url,
        ...response.data,
      };
    } catch (error) {
      throw new Error(`UzCard payment creation failed: ${error.message}`);
    }
  }

  async checkPayment(data: any): Promise<any> {
    const { transactionId } = data;

    const payload = {
      terminal_id: this.terminalId,
      transaction_id: transactionId,
    };

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
        provider: 'uzcard',
        transactionId: transactionId,
        status: response.data.status,
        ...response.data,
      };
    } catch (error) {
      throw new Error(`UzCard payment check failed: ${error.message}`);
    }
  }

  async cancelPayment(data: any): Promise<any> {
    const { transactionId } = data;

    const payload = {
      terminal_id: this.terminalId,
      transaction_id: transactionId,
    };

    try {
      const response = await axios.post(
        `${this.apiUrl}/payment/cancel`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      return {
        provider: 'uzcard',
        transactionId: transactionId,
        status: 'cancelled',
        ...response.data,
      };
    } catch (error) {
      throw new Error(`UzCard payment cancellation failed: ${error.message}`);
    }
  }
}
