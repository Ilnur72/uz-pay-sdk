/**
 * Example: How to use uz-pay-sdk in your NestJS application
 */

import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

// Import from the library (in real use: import from 'uz-pay-sdk')
import { 
  PaymentsModule, 
  PaymentsService 
} from '../dist/index';

// Your service that uses the payment SDK
class ExamplePaymentService {
  constructor(private readonly paymentsService: PaymentsService) {}

  async demonstratePayments() {
    import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { Module, Injectable } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

// Import from the library (in real use: import from 'uz-pay-sdk')
import { 
  PaymentsModule, 
  PaymentsService 
} from '../dist/index';

// Your service that uses the payment SDK
@Injectable()
class ExamplePaymentService {
  constructor(private readonly paymentsService: PaymentsService) {}

  async demonstratePayments() {
    console.log('🚀 UZ Pay SDK Demo started...
');

    try {
      // 1. Get available providers
      console.log('📋 Available payment providers:');
      const providers = this.paymentsService.getAvailableProviders();
      console.log(providers);
      console.log('');

      // 2. Get provider info
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

      // 3. Demo payment operations simulation
      console.log('💳 Demo payment operations:');
      const paymentData = {
        amount: 50000, // 500.00 UZS in tiyin
        orderId: `order-${Date.now()}`,
        description: 'Demo payment for testing',
        returnUrl: 'https://example.com/return',
        cancelUrl: 'https://example.com/cancel'
      };

      console.log('Payment data example:', paymentData);
      console.log('
Note: Actual payment operations require proper environment configuration (.env file)');
      console.log('For testing, you can try:');
      console.log('- paymentsService.create("payme", paymentData)');
      console.log('- paymentsService.check("payme", { transactionId: "123" })');
      console.log('- paymentsService.cancel("uzcard", { transactionId: "123" })');
      console.log('');

    } catch (error) {
      console.error('❌ Demo error:', error.message);
    }

    console.log('✅ Demo completed!');
  }
}

    try {
      // 1. Get available providers
      console.log('📋 Available payment providers:');
      const providers = this.paymentsService.getAvailableProviders();
      console.log(providers);
      console.log('');

      // 2. Get provider info
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

      // 3. Demo payment creation simulation
      console.log('💳 Demo payment operations:');
      const paymentData = {
        amount: 50000, // 500.00 UZS in tiyin
        orderId: `order-${Date.now()}`,
        description: 'Demo payment for testing',
        returnUrl: 'https://example.com/return',
        cancelUrl: 'https://example.com/cancel'
      };

      console.log('Payment data example:', paymentData);
      console.log('\nNote: Actual payment operations require proper environment configuration (.env file)');
      console.log('For testing, you can try:');
      console.log('- paymentsService.create("payme", paymentData)');
      console.log('- paymentsService.check("payme", { transactionId: "123" })');
      console.log('- paymentsService.cancel("uzcard", { transactionId: "123" })');
      console.log('');

    } catch (error) {
      console.error('❌ Demo error:', error.message);
    }

    console.log('✅ Demo completed!');
  }
}

// Main application module
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '../.env' // Use parent directory .env
    }),
    PaymentsModule
  ],
  providers: [ExamplePaymentService]
})
class ExampleAppModule {}

// Bootstrap the application
async function bootstrap() {
  console.log('🎯 UZ Pay SDK Library Example\n');
  
  const app = await NestFactory.createApplicationContext(ExampleAppModule);
  
  const exampleService = app.get(ExamplePaymentService);
  await exampleService.demonstratePayments();
  
  await app.close();
}

// Run the example
bootstrap().catch(error => {
  console.error('Bootstrap error:', error);
  process.exit(1);
});
