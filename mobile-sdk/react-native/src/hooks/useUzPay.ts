// This hook will be available when React is installed as peer dependency
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

// This hook requires React to be installed
export const useUzPay = (config: PaymentConfig) => {
  // Import React hooks dynamically when available
  let useState: any, useCallback: any;

  try {
    const React = require('react');
    useState = React.useState;
    useCallback = React.useCallback;
  } catch (error) {
    throw new Error(
      'React is required as a peer dependency to use useUzPay hook. Install React first or use UzPayReactNative class directly.',
    );
  }

  const [loading, setLoading] = (useState as any)(false);
  const [error, setError] = (useState as any)(null);
  const [paymentResult, setPaymentResult] = (useState as any)(null);

  const makeRequest = useCallback(
    async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
      const controller = new AbortController();
      const timeoutId = setTimeout(
        () => controller.abort(),
        config.timeout || 30000,
      );

      try {
        const response = await fetch(`${config.baseUrl}${endpoint}`, {
          ...options,
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': config.apiKey,
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
    },
    [config.baseUrl, config.apiKey, config.timeout],
  );

  const createPayment = useCallback(
    async (paymentData: CreatePaymentData): Promise<PaymentResponse> => {
      setLoading(true);
      setError(null);

      try {
        const result = (await (makeRequest as any)('/payments', {
          method: 'POST',
          body: JSON.stringify(paymentData),
        })) as PaymentResponse;

        setPaymentResult(result);
        return result;
      } catch (err: any) {
        const errorMessage = err.message || 'Payment creation failed';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [makeRequest],
  );

  const checkPaymentStatus = useCallback(
    async (transactionId: string, provider: string): Promise<PaymentStatus> => {
      setLoading(true);
      setError(null);

      try {
        const result = (await (makeRequest as any)(
          `/payments/status/${provider}/${transactionId}`,
        )) as PaymentStatus;
        return result;
      } catch (err: any) {
        const errorMessage = err.message || 'Status check failed';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [makeRequest],
  );

  const cancelPayment = useCallback(
    async (
      transactionId: string,
      provider: string,
    ): Promise<PaymentResponse> => {
      setLoading(true);
      setError(null);

      try {
        const result = (await (makeRequest as any)(
          `/payments/cancel/${provider}/${transactionId}`,
          { method: 'POST' },
        )) as PaymentResponse;
        return result;
      } catch (err: any) {
        const errorMessage = err.message || 'Payment cancellation failed';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [makeRequest],
  );

  const getAvailableProviders = useCallback(async (): Promise<string[]> => {
    try {
      const result = (await (makeRequest as any)('/payments/providers')) as {
        providers: string[];
      };
      return result.providers;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to get providers';
      setError(errorMessage);
      throw err;
    }
  }, [makeRequest]);

  return {
    // Methods
    createPayment,
    checkPaymentStatus,
    cancelPayment,
    getAvailableProviders,

    // State
    loading,
    error,
    paymentResult,
  };
};
