import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { Module, Injectable } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PaymentsModule, PaymentsService } from '../dist/index';

@Injectable()
class ExamplePaymentService {
  constructor(private readonly paymentsService: PaymentsService) {}

  async demonstratePayments() {
    console.log('🚀 UZ Pay SDK Demo started...');
    console.log('');

    try {
      console.log('📋 Available payment providers:');
      const providers = this.paymentsService.getAvailableProviders();
      console.log(providers);
      console.log('');

      for (const provider of providers) {
        console.log(`ℹ️  ${provider} provider info:`);
        try {
          const info = this.paymentsService.getProviderInfo(provider);
          console.log(JSON.stringify(info, null, 2));
        } catch (error) {
          console.log(`❌ Error getting ${provider} info:`, error.message);
        }
        console.log('');
      }

      console.log('💳 Demo payment operations:');
      const paymentData = {
        amount: 50000,
        orderId: `order-${Date.now()}`,
        description: 'Demo payment for testing',
        returnUrl: 'https://example.com/return',
        cancelUrl: 'https://example.com/cancel',
      };

      console.log('Payment data example:', paymentData);
      console.log('');
      console.log(
        'Note: Actual payment operations require proper environment configuration (.env file)',
      );
      console.log('For testing, you can try:');
      console.log('- paymentsService.create("payme", paymentData)');
      console.log('- paymentsService.check("payme", { transactionId: "123" })');
      console.log(
        '- paymentsService.cancel("uzcard", { transactionId: "123" })',
      );
    } catch (error) {
      console.error('❌ Demo error:', error.message);
    }

    console.log('✅ Demo completed!');
  }
}

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '../.env',
    }),
    PaymentsModule,
  ],
  providers: [ExamplePaymentService],
})
class ExampleAppModule {}

async function bootstrap() {
  console.log('🎯 UZ Pay SDK Library Example');
  console.log('');

  const app = await NestFactory.createApplicationContext(ExampleAppModule);
  const exampleService = app.get(ExamplePaymentService);
  await exampleService.demonstratePayments();
  await app.close();
}

bootstrap().catch((error) => {
  console.error('Bootstrap error:', error);
  process.exit(1);
});
