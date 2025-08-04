import {
  Controller,
  Post,
  Body,
  BadRequestException,
  Get,
  Param,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get('providers')
  getProviders() {
    return {
      providers: this.paymentsService.getAvailableProviders(),
      message: "Mavjud to'lov provayderlari",
    };
  }

  @Get('providers/:provider')
  getProviderInfo(@Param('provider') provider: string) {
    const info = this.paymentsService.getProviderInfo(provider);
    if (!info) {
      throw new BadRequestException(`Noma'lum provider: ${provider}`);
    }
    return info;
  }

  @Post('create')
  async createPayment(@Body() body: any) {
    const { provider, ...data } = body;
    if (!provider) {
      throw new BadRequestException('provider majburiy');
    }

    const availableProviders = this.paymentsService.getAvailableProviders();
    if (!availableProviders.includes(provider)) {
      throw new BadRequestException(
        `Qo'llab-quvvatlanmaydigan provider: ${provider}. Mavjud providerlar: ${availableProviders.join(
          ', ',
        )}`,
      );
    }

    return this.paymentsService.create(provider, data);
  }

  @Post('check')
  async checkPayment(@Body() body: any) {
    const { provider, ...data } = body;
    if (!provider) {
      throw new BadRequestException('provider majburiy');
    }

    const availableProviders = this.paymentsService.getAvailableProviders();
    if (!availableProviders.includes(provider)) {
      throw new BadRequestException(
        `Qo'llab-quvvatlanmaydigan provider: ${provider}. Mavjud providerlar: ${availableProviders.join(
          ', ',
        )}`,
      );
    }

    return this.paymentsService.check(provider, data);
  }

  @Post('cancel')
  async cancelPayment(@Body() body: any) {
    const { provider, ...data } = body;
    if (!provider) {
      throw new BadRequestException('provider majburiy');
    }

    const availableProviders = this.paymentsService.getAvailableProviders();
    if (!availableProviders.includes(provider)) {
      throw new BadRequestException(
        `Qo'llab-quvvatlanmaydigan provider: ${provider}. Mavjud providerlar: ${availableProviders.join(
          ', ',
        )}`,
      );
    }

    return this.paymentsService.cancel(provider, data);
  }
}
