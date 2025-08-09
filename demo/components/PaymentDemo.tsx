'use client';

import { useState } from 'react';
import { PaymentsService } from 'uz-pay-sdk';
import { CreditCard, Loader2, CheckCircle, XCircle } from 'lucide-react';

interface PaymentProvider {
  id: string;
  name: string;
  logo: string;
  color: string;
}

const providers: PaymentProvider[] = [
  { id: 'payme', name: 'Payme', logo: '💳', color: 'bg-blue-500' },
  { id: 'click', name: 'Click', logo: '🏦', color: 'bg-green-500' },
  { id: 'uzcard', name: 'UzCard', logo: '💎', color: 'bg-purple-500' },
  { id: 'humo', name: 'Humo', logo: '🌟', color: 'bg-yellow-500' },
  { id: 'apelsin', name: 'Apelsin', logo: '🍊', color: 'bg-orange-500' }
];

export default function PaymentDemo() {
  const [selectedProvider, setSelectedProvider] = useState<string>('');
  const [amount, setAmount] = useState<number>(50000);
  const [orderId, setOrderId] = useState<string>(`ORDER_${Date.now()}`);
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<any>(null);
  
  const payments = new PaymentsService();

  const handlePayment = async () => {
    if (!selectedProvider) return;
    
    setLoading(true);
    setResult(null);

    try {
      const payment = await payments.create({
        provider: selectedProvider,
        amount: amount,
        orderId: orderId,
        description: `Demo payment via ${selectedProvider}`,
        returnUrl: `${window.location.origin}/success`,
        cancelUrl: `${window.location.origin}/cancel`
      });

      setResult({
        success: true,
        payment,
        message: 'Payment created successfully!'
      });

      // In real app, redirect user to payment.paymentUrl
      window.open(payment.paymentUrl, '_blank');

    } catch (error: any) {
      setResult({
        success: false,
        error: error.message,
        message: 'Payment creation failed!'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              🚀 UZ Pay SDK Demo
            </h1>
            <p className="text-gray-600">
              Test all payment providers with one simple API
            </p>
          </div>

          {/* Payment Amount */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Amount (in tiyin)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="50000 (500 UZS)"
            />
            <p className="text-sm text-gray-500 mt-1">
              Amount in UZS: {(amount / 100).toLocaleString()} UZS
            </p>
          </div>

          {/* Order ID */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Order ID
            </label>
            <input
              type="text"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="ORDER_123"
            />
          </div>

          {/* Payment Providers */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Choose Payment Provider
            </label>
            <div className="grid grid-cols-5 gap-4">
              {providers.map((provider) => (
                <button
                  key={provider.id}
                  onClick={() => setSelectedProvider(provider.id)}
                  className={`
                    relative p-4 rounded-lg border-2 transition-all duration-200
                    ${selectedProvider === provider.id
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                    }
                  `}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-1">{provider.logo}</div>
                    <div className="text-xs font-medium text-gray-700">
                      {provider.name}
                    </div>
                  </div>
                  {selectedProvider === provider.id && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-3 h-3 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Create Payment Button */}
          <button
            onClick={handlePayment}
            disabled={!selectedProvider || loading}
            className={`
              w-full py-3 px-6 rounded-lg font-medium text-white transition-all duration-200
              ${!selectedProvider || loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl'
              }
            `}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Creating Payment...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Create Payment
              </div>
            )}
          </button>

          {/* Result Display */}
          {result && (
            <div className={`
              mt-6 p-4 rounded-lg border
              ${result.success 
                ? 'bg-green-50 border-green-200' 
                : 'bg-red-50 border-red-200'
              }
            `}>
              <div className="flex items-center">
                {result.success ? (
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600 mr-2" />
                )}
                <span className={`font-medium ${
                  result.success ? 'text-green-800' : 'text-red-800'
                }`}>
                  {result.message}
                </span>
              </div>
              
              {result.success && result.payment && (
                <div className="mt-3 text-sm text-green-700">
                  <p><strong>Payment ID:</strong> {result.payment.id}</p>
                  <p><strong>Status:</strong> {result.payment.status}</p>
                  <p><strong>Provider:</strong> {selectedProvider}</p>
                </div>
              )}
              
              {!result.success && result.error && (
                <div className="mt-2 text-sm text-red-700">
                  <strong>Error:</strong> {result.error}
                </div>
              )}
            </div>
          )}
        </div>

        {/* SDK Code Example */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            💻 SDK Code Example
          </h2>
          <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
{`import { PaymentsService } from 'uz-pay-sdk';

const payments = new PaymentsService();

const payment = await payments.create({
  provider: '${selectedProvider || 'payme'}',
  amount: ${amount},
  orderId: '${orderId}',
  description: 'Demo payment',
  returnUrl: 'https://yoursite.com/success'
});

console.log('Payment URL:', payment.paymentUrl);`}
          </pre>
        </div>
      </div>
    </div>
  );
}
