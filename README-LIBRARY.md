# UZ Pay SDK

Universal payment SDK for Uzbekistan banks that provides a unified interface for integrating with multiple payment providers.

## Supported Payment Providers

- **Payme** - Leading mobile payment system in Uzbekistan
- **Click** - Popular online payment gateway
- **UzCard** - National payment system of Uzbekistan  
- **Humo** - International payment system
- **Apelsin** - Mobile payment and money transfer service

## Features

- 🌟 **Unified API** - Single interface for all payment providers
- 🔒 **Secure** - Built-in signature verification and data sanitization
- 📋 **TypeScript** - Full TypeScript support with type definitions
- 📊 **Logging** - Comprehensive logging with Winston
- ⚡ **Performance** - Optimized for high-throughput applications
- 🧪 **Testing** - Built-in testing utilities and mocks
- 🔧 **Configurable** - Environment-based configuration

## Installation

```bash
npm install uz-pay-sdk
```

## Quick Start

### 1. Basic Setup

```typescript
import { PaymentsModule, PaymentsService } from 'uz-pay-sdk';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PaymentsModule,
  ],
  providers: [PaymentsService],
})
export class AppModule {}
```

### 2. Environment Configuration

Create a `.env` file with your payment provider credentials:

```env
# Payme Configuration
PAYME_MERCHANT_ID=your_payme_merchant_id
PAYME_KEY=your_payme_key  
PAYME_API_URL=https://checkout.test.paycom.uz/api

# Click Configuration
CLICK_SERVICE_ID=your_click_service_id
CLICK_MERCHANT_ID=your_click_merchant_id
CLICK_SECRET_KEY=your_click_secret_key
CLICK_API_URL=https://api.click.uz/v2
```

### 3. Using the Service

```typescript
import { Injectable } from '@nestjs/common';
import { PaymentsService, PaymentResponse } from 'uz-pay-sdk';

@Injectable()
export class MyPaymentService {
  constructor(private readonly paymentsService: PaymentsService) {}

  async createPayment(): Promise<PaymentResponse> {
    const result = await this.paymentsService.createPayment('payme', {
      amount: 50000, // 500.00 UZS (in tiyin)
      orderId: 'order-123',
      description: 'Payment for order #123',
    });

    return result;
  }
}
```

## License

MIT
