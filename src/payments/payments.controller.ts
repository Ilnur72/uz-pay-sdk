import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create')
  async createPayment(@Body() body: any) {
    const { provider, ...data } = body;
    if (!provider) {
      throw new BadRequestException('provider majburiy');
    }
    return this.paymentsService.create(provider, data);
  }

  @Post('check')
  async checkPayment(@Body() body: any) {
    const { provider, ...data } = body;
    if (!provider) {
      throw new BadRequestException('provider majburiy');
    }
    return this.paymentsService.check(provider, data);
  }
}
