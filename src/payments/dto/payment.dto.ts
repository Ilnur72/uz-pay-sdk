import { IsString, IsNumber, IsOptional, IsIn, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePaymentDto {
  @ApiProperty({
    description: 'Payment provider',
    enum: ['payme', 'click', 'uzcard', 'humo', 'apelsin'],
    example: 'payme',
  })
  @IsString()
  @IsIn(['payme', 'click', 'uzcard', 'humo', 'apelsin'])
  provider: 'payme' | 'click' | 'uzcard' | 'humo' | 'apelsin';

  @ApiProperty({
    description: 'Payment amount in UZS tiyin (1 UZS = 100 tiyin)',
    minimum: 1,
    example: 50000,
  })
  @IsNumber()
  @Min(1)
  amount: number;

  @ApiProperty({
    description: 'Unique order identifier',
    example: 'ORDER_123456',
  })
  @IsString()
  orderId: string;

  @ApiPropertyOptional({
    description: 'Payment description',
    example: 'Payment for order #123456',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Currency code',
    example: 'UZS',
  })
  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsString()
  returnUrl?: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  cardNumber?: string;
}

export class CheckPaymentDto {
  @IsString()
  @IsIn(['payme', 'click', 'uzcard', 'humo', 'apelsin'])
  provider: string;

  @IsString()
  transactionId: string;
}

export class CancelPaymentDto {
  @IsString()
  @IsIn(['payme', 'click', 'uzcard', 'humo', 'apelsin'])
  provider: string;

  @IsString()
  transactionId: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  amount?: number;
}

export interface PaymentResponse {
  provider: string;
  transactionId: string;
  status: string;
  paymentUrl?: string;
  amount?: number;
  currency?: string;
  orderId?: string;
  message?: string;
}

export interface ProviderConfig {
  name: string;
  description: string;
  supportedMethods: string[];
  currency: string[];
  requiredFields: string[];
  optionalFields: string[];
}
