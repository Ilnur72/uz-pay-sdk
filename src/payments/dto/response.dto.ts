export class PaymentSuccessResponse {
  provider: string;
  transactionId: string;
  status: string;
  paymentUrl?: string;
  amount?: number;
  currency?: string;
  orderId?: string;
  message?: string;
}

export class PaymentErrorResponse {
  statusCode: number;
  message: string;
  error: string;
  timestamp: string;
  path: string;
}

export class ProvidersListResponse {
  providers: string[];
  message: string;
}

export class ProviderInfoResponse {
  name: string;
  description: string;
  supportedMethods: string[];
  currency: string[];
  requiredFields?: string[];
  optionalFields?: string[];
}
