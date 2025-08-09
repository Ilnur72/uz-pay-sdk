import {
  Controller,
  Post,
  Body,
  BadRequestException,
  Get,
  Param,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
  ApiParam,
} from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import {
  CreatePaymentDto,
  CheckPaymentDto,
  CancelPaymentDto,
} from './dto/payment.dto';

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @ApiOperation({ summary: 'Get all available payment providers' })
  @ApiResponse({
    status: 200,
    description: 'List of available payment providers',
    schema: {
      type: 'object',
      properties: {
        providers: {
          type: 'array',
          items: { type: 'string' },
          example: ['payme', 'click', 'uzcard', 'humo', 'apelsin'],
        },
        message: { type: 'string', example: "Mavjud to'lov provayderlari" },
      },
    },
  })
  @Get('providers')
  getProviders() {
    return {
      providers: this.paymentsService.getAvailableProviders(),
      message: "Mavjud to'lov provayderlari",
    };
  }

  @ApiOperation({ summary: 'Get information about specific payment provider' })
  @ApiParam({
    name: 'provider',
    enum: ['payme', 'click', 'uzcard', 'humo', 'apelsin'],
  })
  @ApiResponse({
    status: 200,
    description: 'Provider information',
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Payme' },
        description: { type: 'string', example: 'Payme payment system' },
        currencies: {
          type: 'array',
          items: { type: 'string' },
          example: ['UZS'],
        },
        minAmount: { type: 'number', example: 1000 },
        maxAmount: { type: 'number', example: 100000000 },
      },
    },
  })
  @ApiBadRequestResponse({ description: 'Unknown provider' })
  @Get('providers/:provider')
  getProviderInfo(@Param('provider') provider: string) {
    const info = this.paymentsService.getProviderInfo(provider);
    if (!info) {
      throw new BadRequestException(`Noma'lum provider: ${provider}`);
    }
    return info;
  }

  @Post('create')
  async createPayment(@Body() createPaymentDto: CreatePaymentDto) {
    const { provider, ...data } = createPaymentDto;
    return this.paymentsService.create(provider, data);
  }

  @Post('check')
  async checkPayment(@Body() checkPaymentDto: CheckPaymentDto) {
    const { provider, ...data } = checkPaymentDto;
    return this.paymentsService.check(provider, data);
  }

  @Post('cancel')
  async cancelPayment(@Body() cancelPaymentDto: CancelPaymentDto) {
    const { provider, ...data } = cancelPaymentDto;
    return this.paymentsService.cancel(provider, data);
  }
}
