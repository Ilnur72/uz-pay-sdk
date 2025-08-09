export interface PaymentConfig {
  baseUrl: string;
  apiKey: string;
  timeout?: number;
}

export interface CreatePaymentData {
  provider: 'payme' | 'click' | 'uzcard' | 'humo' | 'apelsin';
  amount: number;
  orderId: string;
  description?: string;
  phoneNumber?: string;
  returnUrl?: string;
  currency?: string;
}

export interface PaymentResponse {
  success: boolean;
  transactionId?: string;
  paymentUrl?: string;
  error?: string;
  message?: string;
}

export interface PaymentStatus {
  status: 'pending' | 'success' | 'failed' | 'cancelled';
  transactionId: string;
  amount?: number;
  provider?: string;
  updatedAt?: string;
}

export class UzPayReactNative {
  private config: PaymentConfig;

  constructor(config: PaymentConfig) {
    this.config = config;
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort(),
      this.config.timeout || 30000,
    );

    try {
      const response = await fetch(`${this.config.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': this.config.apiKey,
          ...options.headers,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData: any = await response.json().catch(() => ({}));
        throw new Error(
          `HTTP ${response.status}: ${errorData.error || 'Network error'}`,
        );
      }

      return (await response.json()) as T;
    } catch (err: any) {
      clearTimeout(timeoutId);

      if (err.name === 'AbortError') {
        throw new Error('Request timeout');
      }

      throw err;
    }
  }

  async createPayment(
    paymentData: CreatePaymentData,
  ): Promise<PaymentResponse> {
    return this.makeRequest<PaymentResponse>('/payments', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  }

  async checkPaymentStatus(
    transactionId: string,
    provider: string,
  ): Promise<PaymentStatus> {
    return this.makeRequest<PaymentStatus>(
      `/payments/status/${provider}/${transactionId}`,
    );
  }

  async cancelPayment(
    transactionId: string,
    provider: string,
  ): Promise<PaymentResponse> {
    return this.makeRequest<PaymentResponse>(
      `/payments/cancel/${provider}/${transactionId}`,
      { method: 'POST' },
    );
  }

  async getAvailableProviders(): Promise<string[]> {
    const result = await this.makeRequest<{ providers: string[] }>(
      '/payments/providers',
    );
    return result.providers;
  }
}
