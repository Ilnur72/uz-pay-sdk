import { Injectable } from '@nestjs/common';
import { PaymeDriver } from './drivers/payme.driver';
import { ClickDriver } from './drivers/click.driver';
import { UzcardDriver } from './drivers/uzcard.driver';
import { HumoDriver } from './drivers/humo.driver';
import { ApelsinDriver } from './drivers/apelsin.driver';
import { logger, paymentLogger } from '../logger/logger.config';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly paymeDriver: PaymeDriver,
    private readonly clickDriver: ClickDriver,
    private readonly uzcardDriver: UzcardDriver,
    private readonly humoDriver: HumoDriver,
    private readonly apelsinDriver: ApelsinDriver,
  ) {
    logger.info('PaymentsService initialized with all drivers');
  }

  async create(provider: string, data: any) {
    const startTime = Date.now();
    const requestId = this.generateRequestId();

    logger.info('Payment creation started', {
      requestId,
      provider,
      amount: data.amount,
      orderId: data.orderId,
    });

    paymentLogger.info('PAYMENT_CREATE_REQUEST', {
      requestId,
      provider,
      data: this.sanitizeLogData(data),
      timestamp: new Date().toISOString(),
    });

    try {
      let result;

      switch (provider) {
        case 'payme':
          result = await this.paymeDriver.createPayment(data);
          break;
        case 'click':
          result = await this.clickDriver.createPayment(data);
          break;
        case 'uzcard':
          result = await this.uzcardDriver.createPayment(data);
          break;
        case 'humo':
          result = await this.humoDriver.createPayment(data);
          break;
        case 'apelsin':
          result = await this.apelsinDriver.createPayment(data);
          break;
        default:
          throw new Error(`Qo'llab-quvvatlanmaydigan provider: ${provider}`);
      }

      const duration = Date.now() - startTime;

      logger.info('Payment creation completed', {
        requestId,
        provider,
        duration: `${duration}ms`,
        success: true,
      });

      paymentLogger.info('PAYMENT_CREATE_SUCCESS', {
        requestId,
        provider,
        duration,
        result: this.sanitizeLogData(result),
        timestamp: new Date().toISOString(),
      });

      return result;
    } catch (error) {
      const duration = Date.now() - startTime;

      logger.error('Payment creation failed', {
        requestId,
        provider,
        duration: `${duration}ms`,
        error: error.message,
        stack: error.stack,
      });

      paymentLogger.error('PAYMENT_CREATE_ERROR', {
        requestId,
        provider,
        duration,
        error: error.message,
        data: this.sanitizeLogData(data),
        timestamp: new Date().toISOString(),
      });

      throw error;
    }
  }

  async check(provider: string, data: any) {
    const startTime = Date.now();
    const requestId = this.generateRequestId();

    logger.info('Payment check started', {
      requestId,
      provider,
      transactionId: data.transactionId,
    });

    paymentLogger.info('PAYMENT_CHECK_REQUEST', {
      requestId,
      provider,
      data: this.sanitizeLogData(data),
      timestamp: new Date().toISOString(),
    });

    try {
      let result;

      switch (provider) {
        case 'payme':
          result = await this.paymeDriver.checkPayment(data);
          break;
        case 'click':
          result = await this.clickDriver.checkPayment(data);
          break;
        case 'uzcard':
          result = await this.uzcardDriver.checkPayment(data);
          break;
        case 'humo':
          result = await this.humoDriver.checkPayment(data);
          break;
        case 'apelsin':
          result = await this.apelsinDriver.checkPayment(data);
          break;
        default:
          throw new Error(`Qo'llab-quvvatlanmaydigan provider: ${provider}`);
      }

      const duration = Date.now() - startTime;

      logger.info('Payment check completed', {
        requestId,
        provider,
        duration: `${duration}ms`,
        status: result.status,
      });

      paymentLogger.info('PAYMENT_CHECK_SUCCESS', {
        requestId,
        provider,
        duration,
        result: this.sanitizeLogData(result),
        timestamp: new Date().toISOString(),
      });

      return result;
    } catch (error) {
      const duration = Date.now() - startTime;

      logger.error('Payment check failed', {
        requestId,
        provider,
        duration: `${duration}ms`,
        error: error.message,
      });

      paymentLogger.error('PAYMENT_CHECK_ERROR', {
        requestId,
        provider,
        duration,
        error: error.message,
        data: this.sanitizeLogData(data),
        timestamp: new Date().toISOString(),
      });

      throw error;
    }
  }

  async cancel(provider: string, data: any) {
    switch (provider) {
      case 'payme':
        throw new Error('Payme uchun bekor qilish funksiyasi mavjud emas');
      case 'click':
        throw new Error('Click uchun bekor qilish funksiyasi mavjud emas');
      case 'uzcard':
        return this.uzcardDriver.cancelPayment(data);
      case 'humo':
        return this.humoDriver.cancelPayment(data);
      case 'apelsin':
        return this.apelsinDriver.cancelPayment(data);
      default:
        throw new Error(`Qo'llab-quvvatlanmaydigan provider: ${provider}`);
    }
  }

  getAvailableProviders(): string[] {
    return ['payme', 'click', 'uzcard', 'humo', 'apelsin'];
  }

  getProviderInfo(provider: string) {
    const providerInfos = {
      payme: {
        name: 'Payme',
        description: "Payme to'lov tizimi",
        supportedMethods: ['create', 'check'],
        currency: ['UZS'],
      },
      click: {
        name: 'Click',
        description: "Click to'lov tizimi",
        supportedMethods: ['create', 'check'],
        currency: ['UZS'],
      },
      uzcard: {
        name: 'UzCard',
        description: "UzCard to'lov tizimi",
        supportedMethods: ['create', 'check', 'cancel'],
        currency: ['UZS'],
      },
      humo: {
        name: 'Humo',
        description: "Humo to'lov tizimi",
        supportedMethods: ['create', 'check', 'cancel'],
        currency: ['UZS', 'TJS'],
      },
      apelsin: {
        name: 'Apelsin',
        description: "Apelsin (IPAKYULI) to'lov tizimi",
        supportedMethods: ['create', 'check', 'cancel'],
        currency: ['UZS'],
      },
    };

    return providerInfos[provider] || null;
  }

  // Helper методлар
  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private sanitizeLogData(data: any): any {
    if (!data || typeof data !== 'object') return data;

    const sensitiveFields = [
      'password',
      'secret',
      'key',
      'token',
      'cardNumber',
      'cvv',
      'pin',
      'authorization',
    ];

    const sanitized = { ...data };

    for (const field of sensitiveFields) {
      if (sanitized[field]) {
        sanitized[field] = '*'.repeat(sanitized[field].toString().length);
      }
    }

    return sanitized;
  }
}
