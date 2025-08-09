import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PaymentConfigService {
  constructor(private configService: ConfigService) {}

  // Payme Configuration
  get paymeConfig() {
    return {
      merchantId: this.configService.get<string>('PAYME_MERCHANT_ID'),
      key: this.configService.get<string>('PAYME_KEY'),
      apiUrl: this.configService.get<string>(
        'PAYME_API_URL',
        'https://checkout.test.paycom.uz/api',
      ),
    };
  }

  // Click Configuration
  get clickConfig() {
    return {
      serviceId: this.configService.get<string>('CLICK_SERVICE_ID'),
      merchantId: this.configService.get<string>('CLICK_MERCHANT_ID'),
      secretKey: this.configService.get<string>('CLICK_SECRET_KEY'),
      apiUrl: this.configService.get<string>(
        'CLICK_API_URL',
        'https://api.click.uz/v2',
      ),
    };
  }

  // UzCard Configuration
  get uzcardConfig() {
    return {
      terminalId: this.configService.get<string>('UZCARD_TERMINAL_ID'),
      terminalUserId: this.configService.get<string>('UZCARD_TERMINAL_USER_ID'),
      serviceId: this.configService.get<string>('UZCARD_SERVICE_ID'),
      apiUrl: this.configService.get<string>(
        'UZCARD_API_URL',
        'https://api.uzcard.uz/api/v1',
      ),
    };
  }

  // Humo Configuration
  get humoConfig() {
    return {
      merchantId: this.configService.get<string>('HUMO_MERCHANT_ID'),
      secretKey: this.configService.get<string>('HUMO_SECRET_KEY'),
      apiUrl: this.configService.get<string>(
        'HUMO_API_URL',
        'https://api.humo.tj/v1',
      ),
    };
  }

  // Apelsin Configuration
  get apelsinConfig() {
    return {
      terminalKey: this.configService.get<string>('APELSIN_TERMINAL_KEY'),
      password: this.configService.get<string>('APELSIN_PASSWORD'),
      apiUrl: this.configService.get<string>(
        'APELSIN_API_URL',
        'https://api.apelsin.uz/v1',
      ),
    };
  }

  // Application Configuration
  get appConfig() {
    return {
      port: this.configService.get<number>('PORT', 3000),
      nodeEnv: this.configService.get<string>('NODE_ENV', 'development'),
    };
  }
}
