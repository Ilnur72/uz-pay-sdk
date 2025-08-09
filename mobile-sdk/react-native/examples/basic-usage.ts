import { UzPayReactNative } from '@uz-pay/react-native-sdk';

// Простой пример использования класса SDK
const example1 = async () => {
  const uzPay = new UzPayReactNative({
    baseUrl: 'https://your-uzpay-server.com',
    apiKey: 'your-api-key',
    timeout: 30000,
  });

  try {
    // 1. Создание платежа
    const payment = await uzPay.createPayment({
      provider: 'payme',
      amount: 50000, // 500 UZS в тийинах
      orderId: 'ORDER_123',
      description: 'Покупка товара',
    });

    console.log('Payment created:', payment);

    if (payment.success && payment.paymentUrl) {
      // Перенаправить пользователя на payment.paymentUrl
      // В React Native можно использовать WebView или Linking.openURL()
      console.log('Redirect to:', payment.paymentUrl);
    }

    // 2. Проверка статуса платежа
    if (payment.transactionId) {
      const status = await uzPay.checkPaymentStatus(
        payment.transactionId,
        'payme',
      );
      console.log('Payment status:', status.status);
    }
  } catch (error) {
    console.error('Payment error:', error.message);
  }
};

// Пример с разными провайдерами
const example2 = async () => {
  const uzPay = new UzPayReactNative({
    baseUrl: 'https://api.uzpay.com',
    apiKey: process.env.UZPAY_API_KEY || '',
  });

  // Payme платеж
  const paymePayment = await uzPay.createPayment({
    provider: 'payme',
    amount: 100000,
    orderId: 'PAYME_001',
  });

  // Click платеж (требует номер телефона)
  const clickPayment = await uzPay.createPayment({
    provider: 'click',
    amount: 75000,
    orderId: 'CLICK_001',
    phoneNumber: '+998901234567',
  });

  // UzCard платеж
  const uzcardPayment = await uzPay.createPayment({
    provider: 'uzcard',
    amount: 150000,
    orderId: 'UZCARD_001',
  });

  // Apelsin платеж (с return URL)
  const apelsinPayment = await uzPay.createPayment({
    provider: 'apelsin',
    amount: 200000,
    orderId: 'APELSIN_001',
    returnUrl: 'myapp://payment-success',
  });

  console.log('All payments created');
};

// Пример обработки ошибок
const example3 = async () => {
  const uzPay = new UzPayReactNative({
    baseUrl: 'https://api.uzpay.com',
    apiKey: 'invalid-key',
  });

  try {
    await uzPay.createPayment({
      provider: 'payme',
      amount: 50000,
      orderId: 'ORDER_ERROR',
    });
  } catch (error) {
    if (error.message.includes('HTTP 401')) {
      console.error('Authentication error: Invalid API key');
    } else if (error.message.includes('HTTP 400')) {
      console.error('Bad request: Check payment data');
    } else if (error.message.includes('timeout')) {
      console.error('Request timeout: Server is slow');
    } else {
      console.error('Unknown error:', error.message);
    }
  }
};

// Пример получения доступных провайдеров
const example4 = async () => {
  const uzPay = new UzPayReactNative({
    baseUrl: 'https://api.uzpay.com',
    apiKey: 'your-api-key',
  });

  try {
    const providers = await uzPay.getAvailableProviders();
    console.log('Available providers:', providers);
    // Output: ['payme', 'click', 'uzcard', 'humo', 'apelsin']

    // Создать платеж только если провайдер доступен
    if (providers.includes('payme')) {
      const payment = await uzPay.createPayment({
        provider: 'payme',
        amount: 50000,
        orderId: 'CONDITIONAL_001',
      });
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
};

// Экспорт примеров
export { example1, example2, example3, example4 };
