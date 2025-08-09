import {
  Controller,
  Post,
  Body,
  Headers,
  BadRequestException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { logger } from '../logger/logger.config';
import { WebhookService } from './webhook.service';

export interface WebhookPayload {
  provider: string;
  transactionId: string;
  orderId: string;
  amount: number;
  status: 'success' | 'failed' | 'pending' | 'cancelled';
  timestamp: string;
  signature?: string;
}

@Controller('webhooks')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Post('payme')
  @HttpCode(HttpStatus.OK)
  async handlePaymeWebhook(
    @Body() payload: any,
    @Headers('x-signature') signature: string,
  ) {
    logger.info('Payme webhook received', {
      transactionId: payload.transaction?.id,
      state: payload.transaction?.state,
    });

    try {
      // Payme signature validation
      const isValid = this.webhookService.validatePaymeSignature(
        payload,
        signature,
      );

      if (!isValid) {
        throw new BadRequestException('Invalid signature');
      }

      const webhookData: WebhookPayload = {
        provider: 'payme',
        transactionId: payload.transaction?.id,
        orderId: payload.transaction?.account?.order_id,
        amount: payload.transaction?.amount,
        status: this.mapPaymeStatus(payload.transaction?.state),
        timestamp: new Date().toISOString(),
      };

      await this.webhookService.processWebhook(webhookData);

      return { success: true };
    } catch (error) {
      logger.error('Payme webhook processing failed', {
        error: error.message,
        payload: JSON.stringify(payload, null, 2),
      });
      throw error;
    }
  }

  @Post('click')
  @HttpCode(HttpStatus.OK)
  async handleClickWebhook(
    @Body() payload: any,
    @Headers('x-signature') signature: string,
  ) {
    logger.info('Click webhook received', {
      clickTransId: payload.click_trans_id,
      merchantTransId: payload.merchant_trans_id,
      action: payload.action,
    });

    try {
      // Click signature validation
      const isValid = this.webhookService.validateClickSignature(
        payload,
        signature,
      );

      if (!isValid) {
        throw new BadRequestException('Invalid signature');
      }

      const webhookData: WebhookPayload = {
        provider: 'click',
        transactionId: payload.click_trans_id,
        orderId: payload.merchant_trans_id,
        amount: payload.amount,
        status: this.mapClickStatus(payload.action),
        timestamp: new Date().toISOString(),
      };

      await this.webhookService.processWebhook(webhookData);

      return { success: true };
    } catch (error) {
      logger.error('Click webhook processing failed', {
        error: error.message,
        payload: JSON.stringify(payload, null, 2),
      });
      throw error;
    }
  }

  @Post('uzcard')
  @HttpCode(HttpStatus.OK)
  async handleUzcardWebhook(
    @Body() payload: any,
    @Headers('authorization') authorization: string,
  ) {
    logger.info('UzCard webhook received', {
      transactionId: payload.transaction_id,
      orderId: payload.order_id,
      status: payload.status,
    });

    try {
      const webhookData: WebhookPayload = {
        provider: 'uzcard',
        transactionId: payload.transaction_id,
        orderId: payload.order_id,
        amount: payload.amount,
        status: this.mapUzcardStatus(payload.status),
        timestamp: new Date().toISOString(),
      };

      await this.webhookService.processWebhook(webhookData);

      return { success: true };
    } catch (error) {
      logger.error('UzCard webhook processing failed', {
        error: error.message,
        payload: JSON.stringify(payload, null, 2),
      });
      throw error;
    }
  }

  @Post('humo')
  @HttpCode(HttpStatus.OK)
  async handleHumoWebhook(@Body() payload: any) {
    logger.info('Humo webhook received', {
      transactionId: payload.transaction_id,
      orderId: payload.order_id,
    });

    try {
      const webhookData: WebhookPayload = {
        provider: 'humo',
        transactionId: payload.transaction_id,
        orderId: payload.order_id,
        amount: payload.amount,
        status: this.mapHumoStatus(payload.status),
        timestamp: new Date().toISOString(),
      };

      await this.webhookService.processWebhook(webhookData);

      return { success: true };
    } catch (error) {
      logger.error('Humo webhook processing failed', {
        error: error.message,
        payload: JSON.stringify(payload, null, 2),
      });
      throw error;
    }
  }

  @Post('apelsin')
  @HttpCode(HttpStatus.OK)
  async handleApelsinWebhook(@Body() payload: any) {
    logger.info('Apelsin webhook received', {
      transactionId: payload.transaction_id,
      orderId: payload.order_id,
    });

    try {
      const webhookData: WebhookPayload = {
        provider: 'apelsin',
        transactionId: payload.transaction_id,
        orderId: payload.order_id,
        amount: payload.amount,
        status: this.mapApelsinStatus(payload.status),
        timestamp: new Date().toISOString(),
      };

      await this.webhookService.processWebhook(webhookData);

      return { success: true };
    } catch (error) {
      logger.error('Apelsin webhook processing failed', {
        error: error.message,
        payload: JSON.stringify(payload, null, 2),
      });
      throw error;
    }
  }

  // Status mapping methods
  private mapPaymeStatus(state: number): WebhookPayload['status'] {
    switch (state) {
      case 2:
        return 'success';
      case -1:
      case -2:
        return 'cancelled';
      case 1:
        return 'pending';
      default:
        return 'failed';
    }
  }

  private mapClickStatus(action: number): WebhookPayload['status'] {
    switch (action) {
      case 1:
        return 'success';
      case 0:
        return 'failed';
      default:
        return 'pending';
    }
  }

  private mapUzcardStatus(status: string): WebhookPayload['status'] {
    switch (status?.toLowerCase()) {
      case 'success':
      case 'completed':
        return 'success';
      case 'failed':
      case 'error':
        return 'failed';
      case 'cancelled':
        return 'cancelled';
      default:
        return 'pending';
    }
  }

  private mapHumoStatus(status: string): WebhookPayload['status'] {
    return this.mapUzcardStatus(status); // Same logic
  }

  private mapApelsinStatus(status: string): WebhookPayload['status'] {
    return this.mapUzcardStatus(status); // Same logic
  }
}
