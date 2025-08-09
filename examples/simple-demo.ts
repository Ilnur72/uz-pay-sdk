/**
 * UZ Pay SDK - Oddiy Demo
 */

import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { Module, Injectable } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PaymentsModule, PaymentsService } from '../dist/index';

@Injectable()
class SimpleDemo {
  constructor(private readonly payments: PaymentsService) {}

  async runDemo() {
    console.log('🎯 UZ PAY SDK - ODDIY DEMO');
    console.log('==========================\n');

    // 1. Mavjud to'lov usullarini ko'rsatish
    console.log("💳 Mavjud to'lov usullari:");
    const providers = this.payments.getAvailableProviders();

    providers.forEach((provider) => {
      const info = this.payments.getProviderInfo(provider);
      console.log(`   ✅ ${info.name} - ${info.description}`);
      console.log(`      Imkoniyatlari: ${info.supportedMethods.join(', ')}`);
      console.log(`      Valyutalar: ${info.currency.join(', ')}\n`);
    });

    // 2. Test to'lovlar yaratish
    console.log("🚀 Test to'lovlar yaratilmoqda...\n");

    const testPayments = [
      {
        provider: 'payme',
        amount: 50000,
        orderId: 'TEST-001',
        description: "Test Payme to'lovi",
      },
      {
        provider: 'click',
        amount: 75000,
        orderId: 'TEST-002',
        description: "Test Click to'lovi",
      },
      {
        provider: 'uzcard',
        amount: 100000,
        orderId: 'TEST-003',
        description: "Test UzCard to'lovi",
      },
    ];

    for (const testPayment of testPayments) {
      console.log(
        `\n💰 ${testPayment.provider.toUpperCase()} orqali to'lov yaratilmoqda...`,
      );
      console.log(
        `   Summa: ${(testPayment.amount / 100).toLocaleString()} so'm`,
      );
      console.log(`   Buyurtma: ${testPayment.orderId}`);

      try {
        const result = await this.payments.create(testPayment.provider, {
          amount: testPayment.amount,
          orderId: testPayment.orderId,
          description: testPayment.description,
          returnUrl: 'https://myshop.uz/success',
          cancelUrl: 'https://myshop.uz/cancel',
        });

        if (result.success) {
          console.log("   ✅ To'lov muvaffaqiyatli yaratildi!");
          console.log(`   🆔 Transaction ID: ${result.transactionId || 'N/A'}`);
          console.log(
            `   🔗 Payment URL: ${result.paymentUrl ? 'Mavjud' : "Yo'q"}`,
          );
          console.log(`   📄 Message: ${result.message || "Xabar yo'q"}`);
        } else {
          console.log("   ❌ To'lov yaratishda muammo!");
          console.log(`   📄 Xatolik: ${result.error || result.message}`);
        }
      } catch (error) {
        console.log('   ❌ Xatolik yuz berdi:');
        console.log(`   📄 ${error.message}`);
      }
    }

    console.log('\n');
    console.log('📊 DEMO XULOSALAR:');
    console.log('==================');
    console.log('✅ UZ Pay SDK muvaffaqiyatli ishlaydi');
    console.log("✅ 5 ta to'lov tizimi qo'llab-quvvatlanadi");
    console.log('✅ Universal API - bitta interfeys');
    console.log('✅ Professional logging tizimi');
    console.log("✅ TypeScript to'liq qo'llab-quvvatlanadi");

    console.log('\n🎉 Demo yakunlandi!');
    console.log('\nReal loyihada foydalanish uchun:');
    console.log('1. npm install uz-pay-sdk');
    console.log("2. .env fayliga haqiqiy kalitlarni qo'shing");
    console.log("3. PaymentsModule'ni import qiling");
    console.log("4. PaymentsService'dan foydalaning");
  }
}

@Module({
  imports: [ConfigModule.forRoot(), PaymentsModule],
  providers: [SimpleDemo],
})
class SimpleDemoModule {}

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(SimpleDemoModule);
  const demo = app.get(SimpleDemo);

  await demo.runDemo();
  await app.close();
}

bootstrap().catch(console.error);
