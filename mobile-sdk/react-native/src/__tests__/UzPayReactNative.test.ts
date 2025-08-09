import { UzPayReactNative } from '../index';

// Mock fetch globally
global.fetch = jest.fn();

describe('UzPayReactNative', () => {
  let uzPay: UzPayReactNative;
  const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

  beforeEach(() => {
    uzPay = new UzPayReactNative({
      baseUrl: 'https://test.com',
      apiKey: 'test-key',
    });
    mockFetch.mockClear();
  });

  describe('createPayment', () => {
    it('should create payment successfully', async () => {
      const mockResponse = {
        success: true,
        transactionId: 'test-123',
        paymentUrl: 'https://payment.url',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await uzPay.createPayment({
        provider: 'payme',
        amount: 50000,
        orderId: 'ORDER_123',
      });

      expect(result).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        'https://test.com/payments',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': 'test-key',
          },
        }),
      );
    });

    it('should handle API error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ error: 'Invalid data' }),
      } as Response);

      await expect(
        uzPay.createPayment({
          provider: 'payme',
          amount: 50000,
          orderId: 'ORDER_123',
        }),
      ).rejects.toThrow('HTTP 400: Invalid data');
    });

    it('should handle network error', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(
        uzPay.createPayment({
          provider: 'payme',
          amount: 50000,
          orderId: 'ORDER_123',
        }),
      ).rejects.toThrow('Network error');
    });
  });

  describe('checkPaymentStatus', () => {
    it('should check payment status successfully', async () => {
      const mockStatus = {
        status: 'success',
        transactionId: 'test-123',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockStatus,
      } as Response);

      const result = await uzPay.checkPaymentStatus('test-123', 'payme');

      expect(result).toEqual(mockStatus);
      expect(mockFetch).toHaveBeenCalledWith(
        'https://test.com/payments/status/payme/test-123',
        expect.objectContaining({
          method: 'GET',
          headers: {
            'X-API-Key': 'test-key',
          },
        }),
      );
    });
  });

  describe('cancelPayment', () => {
    it('should cancel payment successfully', async () => {
      const mockResponse = {
        success: true,
        transactionId: 'test-123',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await uzPay.cancelPayment('test-123', 'payme');

      expect(result).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        'https://test.com/payments/cancel/payme/test-123',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'X-API-Key': 'test-key',
          },
        }),
      );
    });
  });

  describe('getAvailableProviders', () => {
    it('should get available providers successfully', async () => {
      const mockProviders = ['payme', 'click', 'uzcard'];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ providers: mockProviders }),
      } as Response);

      const result = await uzPay.getAvailableProviders();

      expect(result).toEqual(mockProviders);
      expect(mockFetch).toHaveBeenCalledWith(
        'https://test.com/payments/providers',
        expect.objectContaining({
          method: 'GET',
          headers: {
            'X-API-Key': 'test-key',
          },
        }),
      );
    });
  });
});
