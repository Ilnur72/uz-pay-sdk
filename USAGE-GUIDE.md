# UZ Pay SDK - Dasturchilar uchun qo'llanma

## 📦 1. O'rnatish

```bash
# NPM orqali o'rnatish
npm install uz-pay-sdk

# Yoki Yarn orqali
yarn add uz-pay-sdk
```

## 🚀 2. NestJS loyihasida ishlatish

### .env faylini yaratish
```env
# Payme sozlamalari
PAYME_MERCHANT_ID=your_payme_merchant_id
PAYME_SECRET_KEY=your_payme_secret_key
PAYME_ENDPOINT=https://checkout.paycom.uz

# Click sozlamalari
CLICK_MERCHANT_ID=your_click_merchant_id
CLICK_SECRET_KEY=your_click_secret_key
CLICK_ENDPOINT=https://api.click.uz

# UzCard sozlamalari
UZCARD_MERCHANT_ID=your_uzcard_merchant_id
UZCARD_SECRET_KEY=your_uzcard_secret_key
UZCARD_ENDPOINT=https://api.uzcard.uz

# Humo sozlamalari
HUMO_MERCHANT_ID=your_humo_merchant_id
HUMO_SECRET_KEY=your_humo_secret_key
HUMO_ENDPOINT=https://api.humo.tj

# Apelsin sozlamalari
APELSIN_MERCHANT_ID=your_apelsin_merchant_id
APELSIN_SECRET_KEY=your_apelsin_secret_key
APELSIN_ENDPOINT=https://api.apelsin.uz
```

### App Module'ga qo'shish
```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PaymentsModule } from 'uz-pay-sdk';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PaymentsModule, // UZ Pay SDK moduli
  ],
})
export class AppModule {}
```

## 💻 3. Service'da ishlatish

```typescript
// orders.service.ts
import { Injectable } from '@nestjs/common';
import { PaymentsService } from 'uz-pay-sdk';

@Injectable()
export class OrdersService {
  constructor(
    private readonly paymentsService: PaymentsService
  ) {}

  // To'lov yaratish
  async createPayment(orderData: any) {
    try {
      const paymentData = {
        amount: orderData.total * 100, // tiyin'ga o'tkazish (1 so'm = 100 tiyin)
        orderId: orderData.id,
        description: `Buyurtma #${orderData.id} uchun to'lov`,
        returnUrl: 'https://myshop.uz/payment/success',
        cancelUrl: 'https://myshop.uz/payment/cancel'
      };

      // Payme orqali to'lov
      const paymeResult = await this.paymentsService.create('payme', paymentData);
      
      // Yoki Click orqali
      // const clickResult = await this.paymentsService.create('click', paymentData);
      
      return paymeResult;
    } catch (error) {
      throw new Error(`To'lov yaratishda xatolik: ${error.message}`);
    }
  }

  // To'lov holatini tekshirish
  async checkPaymentStatus(provider: string, transactionId: string) {
    try {
      const result = await this.paymentsService.check(provider, {
        transactionId
      });
      return result;
    } catch (error) {
      throw new Error(`To'lov holatini tekshirishda xatolik: ${error.message}`);
    }
  }

  // To'lovni bekor qilish (faqat ba'zi provayderlar uchun)
  async cancelPayment(provider: string, transactionId: string) {
    try {
      if (['uzcard', 'humo', 'apelsin'].includes(provider)) {
        const result = await this.paymentsService.cancel(provider, {
          transactionId
        });
        return result;
      } else {
        throw new Error(`${provider} to'lovni bekor qilishni qo'llab-quvvatlamaydi`);
      }
    } catch (error) {
      throw new Error(`To'lovni bekor qilishda xatolik: ${error.message}`);
    }
  }

  // Mavjud to'lov provayderlarini olish
  getAvailableProviders() {
    return this.paymentsService.getAvailableProviders();
    // Qaytaradi: ['payme', 'click', 'uzcard', 'humo', 'apelsin']
  }

  // Provayder haqida ma'lumot
  getProviderInfo(provider: string) {
    return this.paymentsService.getProviderInfo(provider);
  }
}
```

## 🎮 4. Controller'da ishlatish

```typescript
// payments.controller.ts
import { Controller, Post, Get, Body, Param, Query } from '@nestjs/common';
import { OrdersService } from './orders.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly ordersService: OrdersService) {}

  // To'lov yaratish endpoint'i
  @Post('create')
  async createPayment(@Body() createPaymentDto: any) {
    const result = await this.ordersService.createPayment(createPaymentDto);
    return {
      success: true,
      data: result,
      message: 'To\'lov muvaffaqiyatli yaratildi'
    };
  }

  // To'lov holatini tekshirish
  @Get('check/:provider/:transactionId')
  async checkPayment(
    @Param('provider') provider: string,
    @Param('transactionId') transactionId: string
  ) {
    const result = await this.ordersService.checkPaymentStatus(provider, transactionId);
    return {
      success: true,
      data: result
    };
  }

  // To'lovni bekor qilish
  @Post('cancel/:provider/:transactionId')
  async cancelPayment(
    @Param('provider') provider: string,
    @Param('transactionId') transactionId: string
  ) {
    const result = await this.ordersService.cancelPayment(provider, transactionId);
    return {
      success: true,
      data: result,
      message: 'To\'lov bekor qilindi'
    };
  }

  // Mavjud provayderlar
  @Get('providers')
  getProviders() {
    return {
      success: true,
      data: this.ordersService.getAvailableProviders()
    };
  }

  // Provayder ma'lumotlari
  @Get('providers/:name')
  getProviderInfo(@Param('name') name: string) {
    return {
      success: true,
      data: this.ordersService.getProviderInfo(name)
    };
  }
}
```

## 🌐 5. Frontend bilan integratsiya

```typescript
// Frontend'dan foydalanish (Angular/React/Vue)

// To'lov yaratish
const createPayment = async (orderData) => {
  const response = await fetch('/api/payments/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      total: 50000, // 500 so'm
      id: 'order-123',
      items: ['Mahsulot 1', 'Mahsulot 2']
    })
  });
  
  const result = await response.json();
  
  if (result.success && result.data.paymentUrl) {
    // Foydalanuvchini to'lov sahifasiga yo'naltirish
    window.location.href = result.data.paymentUrl;
  }
};

// To'lov holatini tekshirish
const checkPayment = async (provider, transactionId) => {
  const response = await fetch(`/api/payments/check/${provider}/${transactionId}`);
  const result = await response.json();
  return result.data;
};
```

## 📊 6. Provayderlar bo'yicha imkoniyatlar

| Provayder | Yaratish | Tekshirish | Bekor qilish | Valyutalar |
|-----------|----------|------------|--------------|------------|
| **Payme** | ✅ | ✅ | ❌ | UZS |
| **Click** | ✅ | ✅ | ❌ | UZS |
| **UzCard** | ✅ | ✅ | ✅ | UZS |
| **Humo** | ✅ | ✅ | ✅ | UZS, TJS |
| **Apelsin** | ✅ | ✅ | ✅ | UZS |

## 🔍 7. Logging

SDK avtomatik ravishda barcha amallarni log qiladi:
- `logs/combined.log` - barcha loglar
- `logs/error.log` - faqat xatoliklar
- `logs/payments.log` - to'lov amaliyotlari

## 💡 8. Misollar

```typescript
// Turli provayderlar bilan ishlash
const providers = ['payme', 'click', 'uzcard', 'humo', 'apelsin'];

for (const provider of providers) {
  try {
    console.log(`${provider} orqali to'lov yaratilmoqda...`);
    
    const result = await paymentsService.create(provider, {
      amount: 25000, // 250 so'm
      orderId: `order-${Date.now()}`,
      description: `${provider} orqali test to'lov`
    });
    
    console.log(`${provider} natijasi:`, result);
    
    // To'lov holatini tekshirish
    if (result.transactionId) {
      const status = await paymentsService.check(provider, {
        transactionId: result.transactionId
      });
      console.log(`${provider} holati:`, status);
    }
    
  } catch (error) {
    console.error(`${provider} xatolik:`, error.message);
  }
}
```

## 🛡️ 9. Xavfsizlik

- Barcha kalitlar `.env` faylida saqlanadi
- Log'larda maxfiy ma'lumotlar maskalanadi
- HTTPS protokoli majburiy
- Input validatsiya avtomatik

## 📞 10. Yordam

- **GitHub**: https://github.com/Ilnur72/uz-pay-sdk
- **NPM**: https://www.npmjs.com/package/uz-pay-sdk
- **Issues**: https://github.com/Ilnur72/uz-pay-sdk/issues

---

**uz-pay-sdk** - O'zbekiston to'lov tizimlarini oson integratsiya qilish uchun! 🇺🇿✨
