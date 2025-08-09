/**
 * UZ Pay SDK - Universal payment library for Uzbekistan banks
 * Supports: Payme, Click, UzCard, Humo, Apelsin
 */

// Core module
export { PaymentsModule } from './payments/payments.module';
export { PaymentsService } from './payments/payments.service';
export { PaymentsController } from './payments/payments.controller';

// Webhook module
export { WebhookModule } from './webhooks/webhook.module';
export { WebhookService } from './webhooks/webhook.service';
export { WebhookController } from './webhooks/webhook.controller';
export type { WebhookPayload, WebhookEvent } from './webhooks/webhook.service';

// Drivers
export { PaymeDriver } from './payments/drivers/payme.driver';
export { ClickDriver } from './payments/drivers/click.driver';

// Interfaces
export { PaymentDriver } from './payments/interfaces/payment-driver.interface';

// Logger
export { logger as mainLogger } from './logger/logger.config';
export { HttpLoggingInterceptor } from './logger/http-logging.interceptor';

// Types and Enums
export interface PaymentProvider {
  payme: 'payme';
  click: 'click';
  uzcard: 'uzcard';
  humo: 'humo';
  apelsin: 'apelsin';
}

export interface PaymentResponse {
  success: boolean;
  transactionId?: string;
  paymentUrl?: string;
  amount?: number;
  status?: string;
  error?: string;
  message?: string;
  data?: any;
}

export interface PaymentStatus {
  PENDING: 'pending';
  SUCCESS: 'success';
  FAILED: 'failed';
  CANCELLED: 'cancelled';
  REFUNDED: 'refunded';
}

// Configuration interfaces
export interface PaymentConfig {
  payme: {
    merchantId: string;
    key: string;
    apiUrl: string;
  };
  click: {
    serviceId: string;
    merchantId: string;
    secretKey: string;
    apiUrl: string;
  };
  uzcard: {
    terminalId: string;
    terminalUserId: string;
    serviceId: string;
    apiUrl: string;
  };
  humo: {
    merchantId: string;
    secretKey: string;
    apiUrl: string;
  };
  apelsin: {
    terminalKey: string;
    password: string;
    apiUrl: string;
  };
}

/**
 * Quick start configuration helper
 */
export interface UzPayConfig {
  // Environment configuration
  nodeEnv?: 'development' | 'production';
  logLevel?: 'debug' | 'info' | 'warn' | 'error';

  // Payment providers configuration
  providers: Partial<PaymentConfig>;
}
