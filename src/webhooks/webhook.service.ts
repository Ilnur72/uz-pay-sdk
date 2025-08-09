import { Injectable } from '@nestjs/common';
import { logger, paymentLogger } from '../logger/logger.config';
import { WebhookPayload } from './webhook.controller';
import * as crypto from 'crypto';

// Re-export for external use
export { WebhookPayload } from './webhook.controller';

export interface WebhookEvent {
  id: string;
  type:
    | 'payment.success'
    | 'payment.failed'
    | 'payment.cancelled'
    | 'payment.pending';
  data: WebhookPayload;
  timestamp: string;
  processed: boolean;
}

@Injectable()
export class WebhookService {
  private readonly webhookEvents: WebhookEvent[] = []; // In production, use database

  async processWebhook(webhookData: WebhookPayload): Promise<void> {
    const eventId = this.generateEventId();

    const event: WebhookEvent = {
      id: eventId,
      type: `payment.${webhookData.status}` as WebhookEvent['type'],
      data: webhookData,
      timestamp: webhookData.timestamp,
      processed: false,
    };

    // Save webhook event (in production, save to database)
    this.webhookEvents.push(event);

    logger.info('Webhook event created', {
      eventId,
      provider: webhookData.provider,
      transactionId: webhookData.transactionId,
      orderId: webhookData.orderId,
      status: webhookData.status,
    });

    paymentLogger.info('WEBHOOK_RECEIVED', {
      eventId,
      provider: webhookData.provider,
      transactionId: webhookData.transactionId,
      orderId: webhookData.orderId,
      status: webhookData.status,
      amount: webhookData.amount,
    });

    // Process the webhook
    await this.handleWebhookEvent(event);
  }

  private async handleWebhookEvent(event: WebhookEvent): Promise<void> {
    try {
      // Business logic based on webhook type
      switch (event.type) {
        case 'payment.success':
          await this.handleSuccessfulPayment(event.data);
          break;
        case 'payment.failed':
          await this.handleFailedPayment(event.data);
          break;
        case 'payment.cancelled':
          await this.handleCancelledPayment(event.data);
          break;
        case 'payment.pending':
          await this.handlePendingPayment(event.data);
          break;
      }

      // Mark as processed
      event.processed = true;

      paymentLogger.info('WEBHOOK_PROCESSED', {
        eventId: event.id,
        type: event.type,
        provider: event.data.provider,
        transactionId: event.data.transactionId,
      });
    } catch (error) {
      logger.error('Webhook processing failed', {
        eventId: event.id,
        error: error.message,
        stack: error.stack,
      });

      paymentLogger.error('WEBHOOK_PROCESSING_ERROR', {
        eventId: event.id,
        error: error.message,
        provider: event.data.provider,
        transactionId: event.data.transactionId,
      });

      throw error;
    }
  }

  private async handleSuccessfulPayment(data: WebhookPayload): Promise<void> {
    logger.info('Processing successful payment', {
      provider: data.provider,
      transactionId: data.transactionId,
      orderId: data.orderId,
      amount: data.amount,
    });

    // TODO: Update order status in database
    // TODO: Send confirmation email/SMS
    // TODO: Trigger fulfillment process
    // TODO: Update analytics
  }

  private async handleFailedPayment(data: WebhookPayload): Promise<void> {
    logger.info('Processing failed payment', {
      provider: data.provider,
      transactionId: data.transactionId,
      orderId: data.orderId,
    });

    // TODO: Update order status
    // TODO: Send failure notification
    // TODO: Log for reconciliation
  }

  private async handleCancelledPayment(data: WebhookPayload): Promise<void> {
    logger.info('Processing cancelled payment', {
      provider: data.provider,
      transactionId: data.transactionId,
      orderId: data.orderId,
    });

    // TODO: Update order status
    // TODO: Release reserved inventory
    // TODO: Send cancellation notification
  }

  private async handlePendingPayment(data: WebhookPayload): Promise<void> {
    logger.info('Processing pending payment', {
      provider: data.provider,
      transactionId: data.transactionId,
      orderId: data.orderId,
    });

    // TODO: Set timeout for payment confirmation
    // TODO: Schedule status check job
  }

  // Signature validation methods
  validatePaymeSignature(payload: any, signature: string): boolean {
    try {
      // Payme signature validation logic
      const secretKey = process.env.PAYME_SECRET_KEY || 'default-secret';
      const expectedSignature = crypto
        .createHmac('sha256', secretKey)
        .update(JSON.stringify(payload))
        .digest('hex');

      return signature === expectedSignature;
    } catch (error) {
      logger.error('Payme signature validation failed', {
        error: error.message,
      });
      return false;
    }
  }

  validateClickSignature(payload: any, signature: string): boolean {
    try {
      // Click signature validation logic
      const secretKey = process.env.CLICK_SECRET_KEY || 'default-secret';
      const expectedSignature = crypto
        .createHash('md5')
        .update(
          `${payload.click_trans_id}${payload.service_id}${secretKey}${payload.merchant_trans_id}${payload.amount}${payload.action}${payload.sign_time}`,
        )
        .digest('hex');

      return signature === expectedSignature;
    } catch (error) {
      logger.error('Click signature validation failed', {
        error: error.message,
      });
      return false;
    }
  }

  // Utility methods
  private generateEventId(): string {
    return `webhook_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Query methods for monitoring
  getWebhookEvents(limit = 50): WebhookEvent[] {
    return this.webhookEvents
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      )
      .slice(0, limit);
  }

  getUnprocessedEvents(): WebhookEvent[] {
    return this.webhookEvents.filter((event) => !event.processed);
  }

  getEventsByProvider(provider: string): WebhookEvent[] {
    return this.webhookEvents.filter(
      (event) => event.data.provider === provider,
    );
  }

  getEventsByOrderId(orderId: string): WebhookEvent[] {
    return this.webhookEvents.filter((event) => event.data.orderId === orderId);
  }
}
