export interface CreatePaymentDto {
  provider: 'payme' | 'click' | 'uzcard' | 'humo' | 'apelsin';
  amount: number;
  orderId: string;
  description?: string;
  currency?: string;
  returnUrl?: string;
  phoneNumber?: string;
  cardNumber?: string;
}

export interface CheckPaymentDto {
  provider: string;
  transactionId: string;
}

export interface CancelPaymentDto {
  provider: string;
  transactionId: string;
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
