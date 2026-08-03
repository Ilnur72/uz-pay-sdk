# uz-pay-sdk

Unified TypeScript SDK for Uzbekistan payment providers. One API and one set of types for **Payme, Click, Uzcard, Humo and Apelsin**, with webhook signature verification, request tracing and structured logging.

[![npm version](https://img.shields.io/npm/v/uz-pay-sdk.svg)](https://www.npmjs.com/package/uz-pay-sdk)
[![license](https://img.shields.io/npm/l/uz-pay-sdk.svg)](./LICENSE)

## Why

Every payment provider in Uzbekistan ships its own request format, error codes and webhook contract. Integrating four or five of them means four or five sets of adapters, retry rules and reconciliation logic scattered through the application.

This SDK puts a single driver interface in front of all of them, so application code does not change when a provider is added, swapped or removed.

## Install

```bash
npm install uz-pay-sdk
```

## Usage

```ts
import { PaymentsService } from 'uz-pay-sdk';

const payments = new PaymentsService(config);

const payment = await payments.create('payme', {
  amount: 50000,        // in tiyin
  orderId: 'ORDER_123',
});

if (payment.success) {
  // payment.paymentUrl, payment.transactionId
}

const status = await payments.check('payme', payment.transactionId);
await payments.cancel('payme', payment.transactionId);
```

The same three calls work for every provider — only the first argument changes.

### NestJS

```ts
import { Module } from '@nestjs/common';
import { PaymentsModule, WebhookModule } from 'uz-pay-sdk';

@Module({ imports: [PaymentsModule, WebhookModule] })
export class AppModule {}
```

## Architecture

```text
                        application code
                                |
                                v
                   +------------------------+
                   |    PaymentsService     |  create / check / cancel
                   +-----------+------------+
                               |  PaymentDriver interface
      +----------+-------------+-------------+----------+
      v          v             v             v          v
    Payme      Click        Uzcard         Humo      Apelsin
   driver     driver        driver        driver      driver

   provider callback --> WebhookService --> signature check --> handler
```

Adding a provider means implementing `PaymentDriver` and registering it. Nothing above the interface changes.

## What is in the box

| Area | Detail |
| --- | --- |
| Providers | Payme, Click, Uzcard, Humo and Apelsin drivers behind one interface |
| Webhooks | `WebhookService` with signature verification and typed `WebhookPayload` / `WebhookEvent` |
| Types | `PaymentProvider`, `PaymentResponse`, `PaymentStatus`, `PaymentConfig`, `UzPayConfig` |
| Tracing | A request id is generated for every payment call and carried through the logs |
| Logging | Winston logger with rotation, an HTTP logging interceptor and sanitisation of sensitive fields |
| Extras | Caching, analytics and persistence modules for transaction history |
| Tests | Unit tests for the drivers and the payments service |

## Configuration

Copy `.env.example` and fill in only the providers you actually use:

```bash
cp .env.example .env
```

Each provider needs its merchant or service identifiers, a secret key and an API base URL. Credentials are never written to the logs.

## Mobile

`mobile-sdk/react-native` contains a companion React Native client that talks to the same backend contract.

## Examples

Runnable snippets live in `examples/`.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md). Issues and pull requests are welcome, especially additional provider drivers.

## License

MIT — see [LICENSE](./LICENSE).
