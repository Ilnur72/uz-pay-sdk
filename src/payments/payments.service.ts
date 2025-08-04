import { Injectable } from '@nestjs/common';
import { PaymeDriver } from './drivers/payme.driver';
import { ClickDriver } from './drivers/click.driver';
import { UzcardDriver } from './drivers/uzcard.driver';
import { HumoDriver } from './drivers/humo.driver';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly paymeDriver: PaymeDriver,
    private readonly clickDriver: ClickDriver,
    private readonly uzcardDriver: UzcardDriver,
    private readonly humoDriver: HumoDriver,
  ) {}

  async create(provider: string, data: any) {
    switch (provider) {
      case 'payme':
        return this.paymeDriver.createPayment(data);
      case 'click':
        return this.clickDriver.createPayment(data);
      case 'uzcard':
        return this.uzcardDriver.createPayment(data);
      case 'humo':
        return this.humoDriver.createPayment(data);
      default:
        throw new Error(`Qo'llab-quvvatlanmaydigan provider: ${provider}`);
    }
  }

  async check(provider: string, data: any) {
    switch (provider) {
      case 'payme':
        return this.paymeDriver.checkPayment(data);
      case 'click':
        return this.clickDriver.checkPayment(data);
      case 'uzcard':
        return this.uzcardDriver.checkPayment(data);
      case 'humo':
        return this.humoDriver.checkPayment(data);
      default:
        throw new Error(`Qo'llab-quvvatlanmaydigan provider: ${provider}`);
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
      default:
        throw new Error(`Qo'llab-quvvatlanmaydigan provider: ${provider}`);
    }
  }

  getAvailableProviders(): string[] {
    return ['payme', 'click', 'uzcard', 'humo'];
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
    };

    return providerInfos[provider] || null;
  }
}
