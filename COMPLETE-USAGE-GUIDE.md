# 🎯 UZ Pay SDK - Dasturchilar uchun to'liq qo'llanma

## Nega UZ Pay SDK?

**Muammo**: O'zbekistondagi har bir bank o'zining alohida API'siga ega - Payme, Click, UzCard, Humo, Apelsin. Har birini alohida integratsiya qilish juda murakkab va vaqt talab etadi.

**Yechim**: **uz-pay-sdk** - bitta API orqali barchasi! ✨

```bash
npm install uz-pay-sdk
```

---

## 🚀 5 daqiqada ishga tushirish

### 1. O'rnatish
```bash
npm install uz-pay-sdk @nestjs/config
```

### 2. .env fayli
```env
# Haqiqiy kalitlaringizni qo'ying
PAYME_MERCHANT_ID=your_merchant_id
PAYME_SECRET_KEY=your_secret_key
PAYME_ENDPOINT=https://checkout.paycom.uz

CLICK_MERCHANT_ID=your_merchant_id
CLICK_SECRET_KEY=your_secret_key
# ... boshqa banklar
```

### 3. Modul qo'shish
```typescript
// app.module.ts
import { PaymentsModule } from 'uz-pay-sdk';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PaymentsModule // ← Bu qator yetarli!
  ],
})
export class AppModule {}
```

### 4. Ishlatish
```typescript
// any.service.ts
import { PaymentsService } from 'uz-pay-sdk';

@Injectable()
export class ShopService {
  constructor(private payments: PaymentsService) {}

  async buyProduct() {
    // Istalgan bankni tanlang!
    const payment = await this.payments.create('payme', {
      amount: 50000, // 500 so'm (tiyin'da)
      orderId: 'order-123',
      description: 'Mahsulot sotib olish'
    });
    
    // Foydalanuvchini to'lov sahifasiga yo'naltiring
    return payment.paymentUrl;
  }
}
```

**Tayyor!** 🎉

---

## 💻 Real loyiha misollar

### E-commerce do'kon
```typescript
@Injectable()
export class ShopService {
  constructor(private payments: PaymentsService) {}

  async checkout(cart: CartItem[], paymentMethod: string) {
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    
    const payment = await this.payments.create(paymentMethod, {
      amount: total * 100, // tiyin'ga
      orderId: `order-${Date.now()}`,
      description: `${cart.length}ta mahsulot sotib olish`,
      returnUrl: 'https://myshop.uz/success',
      cancelUrl: 'https://myshop.uz/cancel'
    });

    return {
      paymentUrl: payment.paymentUrl,
      orderId: payment.transactionId
    };
  }
}
```

### Subscription xizmati
```typescript
async subscribeUser(userId: string, planId: string) {
  const plans = {
    basic: 19900, // 199 so'm/oy
    premium: 49900, // 499 so'm/oy  
    enterprise: 99900 // 999 so'm/oy
  };

  const payment = await this.payments.create('click', {
    amount: plans[planId],
    orderId: `sub-${userId}-${planId}`,
    description: `${planId.toUpperCase()} rejasi - 1 oylik obuna`
  });

  return payment;
}
```

### Xayriya platform
```typescript
async donate(amount: number, cause: string, donorName: string) {
  // Har qanday summa qabul qilish
  const minAmount = 1000; // 10 so'm
  if (amount < minAmount) {
    throw new Error(`Minimal summa ${minAmount/100} so'm`);
  }

  const payment = await this.payments.create('uzcard', {
    amount: amount,
    orderId: `donation-${Date.now()}`,
    description: `${donorName} - ${cause} uchun xayriya`
  });

  return payment;
}
```

---

## 📊 Barcha banklar qo'llab-quvvatlash jadvali

| Bank | To'lov yaratish | Holat tekshirish | Bekor qilish | Valyutalar |
|------|----------------|------------------|--------------|------------|
| **Payme** | ✅ | ✅ | ❌ | UZS |
| **Click** | ✅ | ✅ | ❌ | UZS |  
| **UzCard** | ✅ | ✅ | ✅ | UZS |
| **Humo** | ✅ | ✅ | ✅ | UZS, TJS |
| **Apelsin** | ✅ | ✅ | ✅ | UZS |

---

## 🎮 Controller misollari

```typescript
@Controller('payments')
export class PaymentsController {
  constructor(private payments: PaymentsService) {}

  @Post('create')
  async create(@Body() dto: CreatePaymentDto) {
    const payment = await this.payments.create(dto.provider, {
      amount: dto.amount,
      orderId: dto.orderId,
      description: dto.description
    });
    
    return { success: true, data: payment };
  }

  @Get('check/:provider/:transactionId')
  async check(@Param('provider') provider: string, @Param('transactionId') id: string) {
    const status = await this.payments.check(provider, { transactionId: id });
    return { success: true, data: status };
  }

  @Get('providers')
  getProviders() {
    return this.payments.getAvailableProviders();
    // Qaytaradi: ['payme', 'click', 'uzcard', 'humo', 'apelsin']
  }
}
```

---

## 🌐 Frontend bilan birga ishlash

### React/Next.js
```javascript
// Checkout sahifasi
const handlePayment = async (paymentMethod) => {
  const response = await fetch('/api/payments/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      provider: paymentMethod, // 'payme', 'click', etc.
      amount: totalAmount,
      orderId: orderId,
      description: 'Buyurtma to\'lovi'
    })
  });

  const result = await response.json();
  
  if (result.success) {
    // To'lov sahifasiga yo'naltirish
    window.location.href = result.data.paymentUrl;
  }
};

// To'lov tugmalari
<div className="payment-methods">
  <button onClick={() => handlePayment('payme')}>
    💳 Payme orqali to'lash
  </button>
  <button onClick={() => handlePayment('click')}>
    💳 Click orqali to'lash  
  </button>
  <button onClick={() => handlePayment('uzcard')}>
    💳 UzCard orqali to'lash
  </button>
</div>
```

### Vue.js
```vue
<template>
  <div>
    <h2>To'lov usulini tanlang</h2>
    <div class="payment-buttons">
      <button v-for="method in paymentMethods" :key="method.id" 
              @click="pay(method.id)">
        {{ method.name }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      paymentMethods: []
    }
  },
  
  async mounted() {
    // Mavjud to'lov usullarini olish
    const response = await fetch('/api/payments/providers');
    const result = await response.json();
    this.paymentMethods = result.data;
  },
  
  methods: {
    async pay(provider) {
      const response = await fetch('/api/payments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider,
          amount: this.cartTotal,
          orderId: this.orderId
        })
      });
      
      const result = await response.json();
      if (result.success) {
        window.location.href = result.data.paymentUrl;
      }
    }
  }
}
</script>
```

---

## 🔒 Xavfsizlik va best practices

### 1. Environment o'zgaruvchilarini himoyalash
```typescript
// config/payment.config.ts
export const paymentConfig = {
  payme: {
    merchantId: process.env.PAYME_MERCHANT_ID,
    secretKey: process.env.PAYME_SECRET_KEY,
    // Hech qachon frontend'ga yuborilmasin!
  }
};
```

### 2. Input validatsiya
```typescript
import { IsNumber, IsString, IsIn } from 'class-validator';

export class CreatePaymentDto {
  @IsNumber()
  @Min(100) // Minimal 1 so'm
  amount: number;

  @IsString()
  @Length(1, 100)
  orderId: string;

  @IsIn(['payme', 'click', 'uzcard', 'humo', 'apelsin'])
  provider: string;
}
```

### 3. Error handling
```typescript
try {
  const payment = await this.payments.create(provider, data);
  return { success: true, data: payment };
} catch (error) {
  this.logger.error(`Payment creation failed: ${error.message}`, { provider, data });
  
  return { 
    success: false, 
    message: 'To\'lov yaratishda xatolik yuz berdi' 
  };
}
```

---

## 📈 Monitoring va analytics

```typescript
@Injectable()
export class PaymentAnalytics {
  constructor(private payments: PaymentsService) {}

  async getStats(startDate: Date, endDate: Date) {
    const providers = this.payments.getAvailableProviders();
    
    const stats = {};
    for (const provider of providers) {
      stats[provider] = {
        totalTransactions: 0,
        successfulPayments: 0,
        failedPayments: 0,
        totalAmount: 0
      };
    }

    return stats;
  }

  // Most popular payment method
  getMostPopularProvider() {
    // Your analytics logic
  }

  // Revenue by provider
  getRevenueByProvider() {
    // Your analytics logic
  }
}
```

---

## 🐛 Debugging va logging

SDK avtomatik ravishda barcha amallarni log qiladi:

```
logs/
├── combined.log      # Barcha loglar
├── error.log         # Faqat xatoliklar  
├── payments.log      # To'lov amaliyotlari
└── payments-2024-08-08.log # Kunlik loglar
```

Log formatlar:
```json
{
  "level": "info",
  "message": "Payment creation completed",
  "service": "uz-pay-sdk", 
  "requestId": "req_1234567890_abc123",
  "provider": "payme",
  "duration": "245ms",
  "success": true,
  "timestamp": "2024-08-08 18:00:47"
}
```

---

## 🔧 Advanced foydalanish

### Custom webhook handler
```typescript
@Controller('webhooks')
export class WebhooksController {
  constructor(private payments: PaymentsService) {}

  @Post('payment-status')
  async handlePaymentWebhook(@Body() webhook: any) {
    // Webhook signature tekshirish
    // To'lov holatini yangilash
    // Email/SMS yuborish
    // Database yangilash
  }
}
```

### Batch payments
```typescript
async processBulkPayments(payments: PaymentRequest[]) {
  const results = [];
  
  for (const payment of payments) {
    try {
      const result = await this.payments.create(payment.provider, payment.data);
      results.push({ ...payment, result, status: 'success' });
    } catch (error) {
      results.push({ ...payment, error: error.message, status: 'failed' });
    }
  }
  
  return results;
}
```

### Retry mechanism
```typescript
async createPaymentWithRetry(provider: string, data: any, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await this.payments.create(provider, data);
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      
      // Exponential backoff
      await this.delay(Math.pow(2, i) * 1000);
    }
  }
}

private delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
```

---

## 📞 Yordam va qo'llab-quvvatlash

- **NPM**: https://www.npmjs.com/package/uz-pay-sdk
- **GitHub**: https://github.com/Ilnur72/uz-pay-sdk  
- **Issues**: https://github.com/Ilnur72/uz-pay-sdk/issues
- **Email**: umirbayev72@gmail.com

### Tez-tez so'raladigan savollar

**Q: Qaysi NestJS versiyasida ishlaydi?**
A: NestJS 9+ va 10+ da to'liq ishlaydi.

**Q: Test muhitida qanday qilib sinovdan o'tkazaman?**
A: `.env.test` faylida test kalitlarini ishlating yoki mock'lar qo'llang.

**Q: Production'da webhook'lar kerakmi?**
A: Ha, to'lov holatini real-time yangilash uchun webhook'lar kerak.

**Q: Bir vaqtda bir nechta bank bilan ishlay olamanmi?**
A: Ha, har bir to'lov uchun turli provayderlar tanlashingiz mumkin.

---

**UZ Pay SDK** - O'zbekiston to'lov tizimlarini oson integratsiya qilish uchun! 🇺🇿

Dasturlashni oddiylashtiring, biznes logikaga e'tibor bering! ✨
