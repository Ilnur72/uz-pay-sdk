/**
 * UZ Pay SDK - Real Demo
 * Bu fayl dasturchilar uchun real misol
 */

import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { Module, Injectable } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

// Kutubxonani import qilamiz
import { PaymentsModule, PaymentsService } from '../dist/index';

// E-commerce demo service
@Injectable()
class OnlineShopService {
  private orders: any[] = [];

  constructor(private readonly payments: PaymentsService) {}

  // Mahsulot ro'yxati (demo)
  getProducts() {
    return [
      {
        id: 1,
        name: 'Samsung Galaxy S24',
        price: 12000000,
        description: 'Yangi smartfon',
      }, // 12,000,000 tiyin = 120,000 so'm
      {
        id: 2,
        name: 'iPhone 15 Pro',
        price: 15000000,
        description: 'Apple telefoni',
      },
      {
        id: 3,
        name: 'MacBook Air M2',
        price: 25000000,
        description: 'Noutbuk',
      },
      {
        id: 4,
        name: 'AirPods Pro',
        price: 3000000,
        description: 'Wireless quloqchin',
      },
      { id: 5, name: 'Apple Watch', price: 8000000, description: 'Smart soat' },
    ];
  }

  // Buyurtma yaratish
  async createOrder(
    productId: number,
    quantity: number,
    customerName: string,
    paymentMethod: string,
  ) {
    const products = this.getProducts();
    const product = products.find((p) => p.id === productId);

    if (!product) {
      throw new Error('Mahsulot topilmadi');
    }

    const orderId = `ORDER-${Date.now()}`;
    const totalAmount = product.price * quantity;

    console.log(`\n🛒 Yangi buyurtma yaratilmoqda:`);
    console.log(`   📦 Mahsulot: ${product.name}`);
    console.log(`   🔢 Miqdori: ${quantity}ta`);
    console.log(`   💰 Narx: ${(totalAmount / 100).toLocaleString()} so'm`);
    console.log(`   👤 Mijoz: ${customerName}`);
    console.log(`   💳 To'lov usuli: ${paymentMethod.toUpperCase()}`);

    const order = {
      orderId,
      productId,
      productName: product.name,
      quantity,
      unitPrice: product.price,
      totalAmount,
      customerName,
      paymentMethod,
      status: 'pending',
      createdAt: new Date(),
    };

    this.orders.push(order);

    try {
      // To'lov yaratish
      const paymentResult = await this.payments.create(paymentMethod, {
        amount: totalAmount,
        orderId,
        description: `Buyurtma: ${product.name} x${quantity}`,
        returnUrl: `https://myshop.uz/success?order=${orderId}`,
        cancelUrl: `https://myshop.uz/cancel?order=${orderId}`,
      });

      console.log(`   ✅ To'lov yaratildi!`);
      console.log(`   🔗 To'lov URL: ${paymentResult.paymentUrl || 'N/A'}`);
      console.log(
        `   🆔 Transaction ID: ${paymentResult.transactionId || 'N/A'}`,
      );

      // Buyurtmani yangilash
      order.status = 'payment_created';
      order.transactionId = paymentResult.transactionId;
      order.paymentUrl = paymentResult.paymentUrl;

      return {
        success: true,
        order,
        payment: paymentResult,
      };
    } catch (error) {
      console.log(`   ❌ To'lov yaratishda xatolik: ${error.message}`);

      // Buyurtmani bekor qilish
      const orderIndex = this.orders.findIndex((o) => o.orderId === orderId);
      if (orderIndex > -1) {
        this.orders.splice(orderIndex, 1);
      }

      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Buyurtma holatini tekshirish
  async checkOrder(orderId: string) {
    const order = this.orders.find((o) => o.orderId === orderId);

    if (!order) {
      throw new Error('Buyurtma topilmadi');
    }

    if (!order.transactionId) {
      return {
        order,
        paymentStatus: null,
        message: "To'lov hali yaratilmagan",
      };
    }

    try {
      const paymentStatus = await this.payments.check(order.paymentMethod, {
        transactionId: order.transactionId,
      });

      console.log(`\n🔍 Buyurtma holati tekshirilmoqda:`);
      console.log(`   🆔 Order ID: ${orderId}`);
      console.log(
        `   📊 To'lov holati: ${JSON.stringify(paymentStatus, null, 2)}`,
      );

      // Buyurtma holatini yangilash
      if (
        paymentStatus.status === 'completed' ||
        paymentStatus.status === 'success'
      ) {
        order.status = 'paid';
      } else if (
        paymentStatus.status === 'failed' ||
        paymentStatus.status === 'cancelled'
      ) {
        order.status = 'cancelled';
      }

      return {
        order,
        paymentStatus,
        message: 'Holat yangilandi',
      };
    } catch (error) {
      console.log(`   ❌ Xatolik: ${error.message}`);
      return {
        order,
        paymentStatus: null,
        error: error.message,
      };
    }
  }

  // Barcha buyurtmalar
  getOrders() {
    return this.orders;
  }

  // Statistika
  getStatistics() {
    const totalOrders = this.orders.length;
    const paidOrders = this.orders.filter((o) => o.status === 'paid').length;
    const pendingOrders = this.orders.filter(
      (o) => o.status === 'pending' || o.status === 'payment_created',
    ).length;
    const cancelledOrders = this.orders.filter(
      (o) => o.status === 'cancelled',
    ).length;
    const totalRevenue = this.orders
      .filter((o) => o.status === 'paid')
      .reduce((sum, o) => sum + o.totalAmount, 0);

    return {
      totalOrders,
      paidOrders,
      pendingOrders,
      cancelledOrders,
      totalRevenue: totalRevenue / 100, // so'mga o'tkazish
      averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders / 100 : 0,
    };
  }
}

// Demo script
@Injectable()
class DemoRunner {
  constructor(
    private readonly shop: OnlineShopService,
    private readonly payments: PaymentsService,
  ) {}

  async runDemo() {
    console.log('🎯 UZ PAY SDK - E-COMMERCE DEMO');
    console.log('================================\n');

    // 1. To'lov provayderlarini ko'rsatish
    console.log("📋 Mavjud to'lov usullari:");
    const providers = this.payments.getAvailableProviders();

    for (const provider of providers) {
      const info = this.payments.getProviderInfo(provider);
      console.log(`   💳 ${info.name} - ${info.description}`);
      console.log(`      Imkoniyatlari: ${info.supportedMethods.join(', ')}`);
      console.log(`      Valyutalar: ${info.currency.join(', ')}\n`);
    }

    // 2. Mahsulotlarni ko'rsatish
    console.log("🛍️  Do'kon mahsulotlari:");
    const products = this.shop.getProducts();
    products.forEach((product) => {
      console.log(
        `   ${product.id}. ${product.name} - ${(
          product.price / 100
        ).toLocaleString()} so'm`,
      );
      console.log(`      ${product.description}\n`);
    });

    // 3. Demo buyurtmalar yaratish
    const demoOrders = [
      {
        productId: 1,
        quantity: 1,
        customer: 'Alisher Nazarov',
        method: 'payme',
      },
      {
        productId: 3,
        quantity: 1,
        customer: 'Sevara Karimova',
        method: 'click',
      },
      {
        productId: 4,
        quantity: 2,
        customer: 'Jasur Abdullayev',
        method: 'uzcard',
      },
    ];

    console.log('🚀 Demo buyurtmalar yaratilmoqda...\n');

    for (const demoOrder of demoOrders) {
      try {
        const result = await this.shop.createOrder(
          demoOrder.productId,
          demoOrder.quantity,
          demoOrder.customer,
          demoOrder.method,
        );

        if (result.success) {
          console.log('   ✅ Buyurtma muvaffaqiyatli yaratildi!\n');
        } else {
          console.log('   ❌ Buyurtma yaratishda muammo:', result.error, '\n');
        }
      } catch (error) {
        console.log('   ❌ Xatolik:', error.message, '\n');
      }

      // Biroz kutish
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    // 4. Statistika
    const stats = this.shop.getStatistics();
    console.log("📊 Do'kon statistikasi:");
    console.log(`   📦 Jami buyurtmalar: ${stats.totalOrders}ta`);
    console.log(`   ✅ To'langan: ${stats.paidOrders}ta`);
    console.log(`   ⏳ Kutilmoqda: ${stats.pendingOrders}ta`);
    console.log(`   ❌ Bekor qilingan: ${stats.cancelledOrders}ta`);
    console.log(
      `   💰 Jami daromad: ${stats.totalRevenue.toLocaleString()} so'm`,
    );
    console.log(
      `   📈 O'rtacha buyurtma: ${stats.averageOrderValue.toLocaleString()} so'm\n`,
    );

    // 5. Buyurtmalar ro'yxati
    console.log("📝 Buyurtmalar ro'yxati:");
    const orders = this.shop.getOrders();
    orders.forEach((order, index) => {
      console.log(`   ${index + 1}. ${order.orderId}`);
      console.log(`      🏷️  ${order.productName} x${order.quantity}`);
      console.log(`      👤 ${order.customerName}`);
      console.log(`      💳 ${order.paymentMethod.toUpperCase()}`);
      console.log(`      📊 Status: ${order.status}`);
      console.log(`      ⏰ ${order.createdAt.toLocaleString()}\n`);
    });

    console.log('🎉 Demo yakunlandi!');
    console.log('\nReal loyihada:');
    console.log('- Database (MongoDB/PostgreSQL) ishlatiladi');
    console.log("- Webhooklar orqali to'lov holatini avtomatik yangilanadi");
    console.log("- Frontend React/Vue/Angular bilan bog'lanadi");
    console.log("- Email/SMS notificationlar qo'shiladi");
  }
}

// Main module
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    PaymentsModule,
  ],
  providers: [OnlineShopService, DemoRunner],
})
class DemoAppModule {}

// Bootstrap
async function bootstrap() {
  const app = await NestFactory.createApplicationContext(DemoAppModule);
  const demo = app.get(DemoRunner);

  await demo.runDemo();
  await app.close();
}

bootstrap().catch(console.error);
