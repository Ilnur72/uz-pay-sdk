# UZ Pay SDK - Универсал to'lov API

Ўзбекистондаги барча банклар учун биргина API орқали to'lov қилиш имкониятини беради.

## Қўллаб-қувватланувчи провайдерлар

- **Payme** - Payme to'lov тизими
- **Click** - Click to'lov тизими  
- **UzCard** - UzCard to'lov тизими
- **Humo** - Humo to'lov тизими
- **Apelsin** - Apelsin (IPAKYULI) to'lov тизими

## Ўрнатиш

```bash
npm install
npm run start:dev
```

## API Endpoints

### 1. Провайдерлар ҳақида маълумот

```http
GET /payments/providers
```

**Жавоб:**
```json
{
  "providers": ["payme", "click", "uzcard", "humo", "apelsin"],
  "message": "Mavjud to'lov provayderlari"
}
```

### 2. Конкрет провайдер ҳақида маълумот

```http
GET /payments/providers/{provider}
```

**Мисол:**
```http
GET /payments/providers/payme
```

**Жавоб:**
```json
{
  "name": "Payme",
  "description": "Payme to'lov tizimi",
  "supportedMethods": ["create", "check"],
  "currency": ["UZS"]
}
```

### 3. To'lov яратиш (Универсал)

```http
POST /payments/create
```

**Request Body:**
```json
{
  "provider": "payme",
  "orderId": "12345",
  "amount": 100000,
  "description": "Mahsulot sotib olish",
  "returnUrl": "https://yoursite.com/return"
}
```

**Payme учун мисол:**
```json
{
  "provider": "payme",
  "orderId": "order_123",
  "amount": 50000
}
```

**Click учун мисол:**
```json
{
  "provider": "click", 
  "orderId": "order_456",
  "amount": 75000,
  "phoneNumber": "+998901234567"
}
```

**UzCard учун мисол:**
```json
{
  "provider": "uzcard",
  "orderId": "order_789", 
  "amount": 100000,
  "cardNumber": "8600123456789012"
}
```

**Humo учун мисол:**
```json
{
  "provider": "humo",
  "orderId": "order_101",
  "amount": 25000,
  "currency": "UZS"
}
```

**Apelsin учун мисол:**
```json
{
  "provider": "apelsin",
  "orderId": "order_202",
  "amount": 150000,
  "description": "Online to'lov",
  "returnUrl": "https://mysite.com/success"
}
```

### 4. To'lov статусини текшириш

```http
POST /payments/check
```

**Request Body:**
```json
{
  "provider": "payme",
  "transactionId": "transaction_12345"
}
```

### 5. To'lovни бекор қилиш

```http
POST /payments/cancel
```

**Request Body:**
```json
{
  "provider": "uzcard",
  "transactionId": "transaction_67890",
  "amount": 50000
}
```

## Архитектура

Проект **Driver Pattern** архитектурасида қурилган:

```
src/payments/
├── interfaces/
│   └── payment-driver.interface.ts  # Умумий интерфейс
├── drivers/                         # Ҳар бир банк учун драйвер
│   ├── payme.driver.ts
│   ├── click.driver.ts
│   ├── uzcard.driver.ts
│   ├── humo.driver.ts
│   └── apelsin.driver.ts
├── dto/
│   └── payment.dto.ts               # DTO лар
├── payments.service.ts              # Асосий сервис
├── payments.controller.ts           # API controller
└── payments.module.ts               # NestJS модуль
```

## Янги банк қўшиш

Янги банк қўшиш учун:

1. `PaymentDriver` интерфейсини implement қилувчи янги драйвер яратинг:

```typescript
import { Injectable } from '@nestjs/common';
import { PaymentDriver } from '../interfaces/payment-driver.interface';

@Injectable()
export class NewBankDriver implements PaymentDriver {
  async createPayment(data: any): Promise<any> {
    // Банк API'си билан интеграция
  }

  async checkPayment(data: any): Promise<any> {
    // Статус текшириш
  }

  async cancelPayment?(data: any): Promise<any> {
    // Бекор қилиш (ихтиёрий)
  }
}
```

2. `PaymentsService`га янги провайдерни қўшинг
3. `PaymentsModule`га янги драйверни provider сифатида қўшинг

## Хуллосалар

Бу SDK орқали сиз:
- ✅ Барча банклар учун бир хил API ишлатасиз
- ✅ Янги банкларни осон қўша оласиз  
- ✅ Кодни қайта ишлатиш имкониятига эгасиз
- ✅ Типизация ва хатоларни бошқариш мавжуд
- ✅ NestJS ecosystem бilan интеграция

**Демак, жавоб: ҲА! Ўзбекистондаги ҳар турли банклар учун биргина универсал API орқали to'lov қилиш мумкин!** 🎉
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ yarn install
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
# uz-pay-sdk
