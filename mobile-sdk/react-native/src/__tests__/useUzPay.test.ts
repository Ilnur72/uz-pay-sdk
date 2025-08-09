import { renderHook, act } from '@testing-library/react-hooks';
import { useUzPay } from '../hooks/useUzPay';

// Mock fetch globally
global.fetch = jest.fn();

describe('useUzPay', () => {
  const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

  beforeEach(() => {
    mockFetch.mockClear();
  });

  it('should initialize with correct config', () => {
    const config = {
      baseUrl: 'https://test.com',
      apiKey: 'test-key',
    };

    const { result } = renderHook(() => useUzPay(config));

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.paymentResult).toBe(null);
  });

  it('should create payment and update state', async () => {
    const mockResponse = {
      success: true,
      transactionId: 'test-123',
      paymentUrl: 'https://payment.url',
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    } as Response);

    const { result } = renderHook(() =>
      useUzPay({
        baseUrl: 'https://test.com',
        apiKey: 'test-key',
      }),
    );

    await act(async () => {
      const paymentResult = await result.current.createPayment({
        provider: 'payme',
        amount: 50000,
        orderId: 'ORDER_123',
      });
      expect(paymentResult).toEqual(mockResponse);
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.paymentResult).toEqual(mockResponse);
  });

  it('should handle error and update error state', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() =>
      useUzPay({
        baseUrl: 'https://test.com',
        apiKey: 'test-key',
      }),
    );

    await act(async () => {
      try {
        await result.current.createPayment({
          provider: 'payme',
          amount: 50000,
          orderId: 'ORDER_123',
        });
      } catch (error) {
        // Expected error
      }
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe('Network error');
  });

  it('should set loading state during request', async () => {
    let resolvePromise: (value: any) => void;
    const promise = new Promise((resolve) => {
      resolvePromise = resolve;
    });

    mockFetch.mockReturnValueOnce(promise as any);

    const { result } = renderHook(() =>
      useUzPay({
        baseUrl: 'https://test.com',
        apiKey: 'test-key',
      }),
    );

    act(() => {
      result.current.createPayment({
        provider: 'payme',
        amount: 50000,
        orderId: 'ORDER_123',
      });
    });

    expect(result.current.loading).toBe(true);

    act(() => {
      resolvePromise!({
        ok: true,
        json: async () => ({ success: true }),
      });
    });

    await act(async () => {
      await promise;
    });

    expect(result.current.loading).toBe(false);
  });
});
