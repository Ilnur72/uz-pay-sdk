# UZ Pay SDK - Универсальный SDK для платежей в Узбекистане

Мощная и удобная библиотека для интеграции с популярными платежными системами Узбекистана в рамках NestJS приложений.

## 🚀 Возможности

- **Универсальный API**: Единый интерфейс для работы с разными платежными системами
- **5 провайдеров**: Payme, Click, UzCard, Humo, Apelsin
- **Профессиональное логирование**: Winston logger с санитизацией данных
- **TypeScript поддержка**: Полная типизация и автокомплит
- **NestJS интеграция**: Готовые модули и сервисы

## 📦 Установка

```bash
npm install uz-pay-sdk
```

## 🔧 Настройка

### 1. Создайте файл окружения `.env`

```env
# Payme Configuration
PAYME_MERCHANT_ID=your_payme_merchant_id
PAYME_SECRET_KEY=your_payme_secret_key
PAYME_ENDPOINT=https://checkout.paycom.uz

# Click Configuration  
CLICK_MERCHANT_ID=your_click_merchant_id
CLICK_SECRET_KEY=your_click_secret_key
CLICK_ENDPOINT=https://api.click.uz

# UzCard Configuration
UZCARD_MERCHANT_ID=your_uzcard_merchant_id
UZCARD_SECRET_KEY=your_uzcard_secret_key
UZCARD_ENDPOINT=https://api.uzcard.uz

# Humo Configuration
HUMO_MERCHANT_ID=your_humo_merchant_id
HUMO_SECRET_KEY=your_humo_secret_key
HUMO_ENDPOINT=https://api.humo.tj

# Apelsin Configuration
APELSIN_MERCHANT_ID=your_apelsin_merchant_id
APELSIN_SECRET_KEY=your_apelsin_secret_key
APELSIN_ENDPOINT=https://api.apelsin.uz
```

### 2. Импортируйте модуль в ваше приложение

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PaymentsModule } from 'uz-pay-sdk';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PaymentsModule
  ],
})
export class AppModule {}
```

## 💻 Использование

### Базовый пример

```typescript
import { Injectable } from '@nestjs/common';
import { PaymentsService } from 'uz-pay-sdk';

@Injectable()
export class YourService {
  constructor(private readonly paymentsService: PaymentsService) {}

  async createPayment() {
    const paymentData = {
      amount: 50000, // сумма в тийинах (500.00 UZS)
      orderId: 'order-123',
      description: 'Покупка товара',
      returnUrl: 'https://yoursite.com/success',
      cancelUrl: 'https://yoursite.com/cancel'
    };

    // Создание платежа через Payme
    const payment = await this.paymentsService.create('payme', paymentData);
    return payment;
  }

  async checkPayment(transactionId: string) {
    // Проверка статуса платежа
    const status = await this.paymentsService.check('payme', { transactionId });
    return status;
  }

  async getProviders() {
    // Получение доступных провайдеров
    return this.paymentsService.getAvailableProviders();
    // Вернет: ['payme', 'click', 'uzcard', 'humo', 'apelsin']
  }

  async getProviderInfo(provider: string) {
    // Информация о провайдере
    return this.paymentsService.getProviderInfo(provider);
  }
}
```

### Работа с разными провайдерами

```typescript
// Payme
const paymePayment = await this.paymentsService.create('payme', paymentData);

// Click  
const clickPayment = await this.paymentsService.create('click', paymentData);

// UzCard (поддерживает отмену)
const uzcardPayment = await this.paymentsService.create('uzcard', paymentData);
await this.paymentsService.cancel('uzcard', { transactionId: '123' });

// Humo (мультивалютный)
const humoPayment = await this.paymentsService.create('humo', {
  ...paymentData,
  currency: 'TJS' // или 'UZS'
});

// Apelsin
const apelsinPayment = await this.paymentsService.create('apelsin', paymentData);
```

## 📊 API Reference

### PaymentsService

#### Методы

- `create(provider, data)` - Создание платежа
- `check(provider, data)` - Проверка статуса платежа  
- `cancel(provider, data)` - Отмена платежа (поддерживается не всеми)
- `getAvailableProviders()` - Список доступных провайдеров
- `getProviderInfo(provider)` - Информация о провайдере

#### Провайдеры

| Провайдер | create | check | cancel | Валюты |
|-----------|--------|-------|--------|--------|
| payme     | ✅     | ✅    | ❌     | UZS    |
| click     | ✅     | ✅    | ❌     | UZS    |
| uzcard    | ✅     | ✅    | ✅     | UZS    |
| humo      | ✅     | ✅    | ✅     | UZS, TJS |
| apelsin   | ✅     | ✅    | ✅     | UZS    |

## 🔍 Логирование

Библиотека включает профессиональную систему логирования:

```typescript
// Логи сохраняются в папку logs/
// - combined.log - все логи
// - error.log - только ошибки  
// - payments.log - логи платежей
// - Ротация по дням

// Чувствительные данные автоматически маскируются
```

## 🏗️ Архитектура

Библиотека построена на паттерне Driver:

```
PaymentsService
    ├── PaymeDriver
    ├── ClickDriver  
    ├── UzcardDriver
    ├── HumoDriver
    └── ApelsinDriver
```

Каждый драйвер реализует интерфейс `PaymentDriverInterface` для единообразного API.

## 🧪 Тестирование

```bash
# Запуск демо
cd example && npx ts-node demo.ts

# Юнит тесты
npm test

# E2E тесты
npm run test:e2e
```

## 🤝 Вклад в развитие

1. Fork проект
2. Создайте feature ветку
3. Сделайте коммит изменений  
4. Push в ветку
5. Откройте Pull Request

## 📄 Лицензия

MIT License - см. файл [LICENSE](LICENSE)

## 🛠️ Технологии

- NestJS 10+
- TypeScript 5+  
- Winston Logger
- RxJS
- Reflect Metadata

---

**UZ Pay SDK** - делаем интеграцию с платежными системами Узбекистана простой и надежной! 🇺🇿✨
