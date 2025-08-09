# 📱 UZ Pay React Native SDK

React Native SDK для универсального платежного шлюза Узбекистана.

## 🚀 Установка

```bash
npm install @uz-pay/react-native-sdk
# или
yarn add @uz-pay/react-native-sdk
```

## 📋 Требования

- React Native >= 0.60.0
- React >= 16.8.0
- iOS 11.0+ / Android API 21+

## 🔧 Настройка

### Базовая настройка

```typescript
import { UzPayReactNative, useUzPay } from '@uz-pay/react-native-sdk';

const config = {
  baseUrl: 'https://your-uzpay-server.com',
  apiKey: 'your-api-key',
  timeout: 30000 // optional, default 30s
};
```

### Использование с React Hook

```typescript
import React from 'react';
import { View, Button, Text, Alert } from 'react-native';
import { useUzPay } from '@uz-pay/react-native-sdk';

const PaymentScreen = () => {
  const { createPayment, loading, error } = useUzPay({
    baseUrl: 'https://your-server.com',
    apiKey: 'your-api-key'
  });

  const handlePayment = async () => {
    try {
      const result = await createPayment({
        provider: 'payme',
        amount: 50000, // 500 UZS in tiyin
        orderId: 'ORDER_123',
        description: 'Product purchase'
      });

      if (result.success && result.paymentUrl) {
        // Open payment URL in WebView or external browser
        Alert.alert('Success', 'Payment created successfully!');
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View>
      <Button 
        title={loading ? "Creating..." : "Pay with Payme"} 
        onPress={handlePayment}
        disabled={loading}
      />
      {error && <Text style={{color: 'red'}}>{error}</Text>}
    </View>
  );
};

export default PaymentScreen;
```

### Использование класса SDK

```typescript
import { UzPayReactNative } from '@uz-pay/react-native-sdk';

const uzPay = new UzPayReactNative({
  baseUrl: 'https://your-server.com',
  apiKey: 'your-api-key'
});

// Создание платежа
const createPayment = async () => {
  const result = await uzPay.createPayment({
    provider: 'click',
    amount: 100000,
    orderId: 'ORDER_456',
    phoneNumber: '+998901234567'
  });
  
  console.log('Payment result:', result);
};

// Проверка статуса
const checkStatus = async () => {
  const status = await uzPay.checkPaymentStatus('transaction_id', 'payme');
  console.log('Payment status:', status.status);
};

// Отмена платежа
const cancelPayment = async () => {
  const result = await uzPay.cancelPayment('transaction_id', 'payme');
  console.log('Cancellation result:', result);
};
```

## 💳 Поддерживаемые провайдеры

### Payme
```typescript
const paymePayment = {
  provider: 'payme',
  amount: 50000,
  orderId: 'ORDER_123'
};
```

### Click
```typescript
const clickPayment = {
  provider: 'click',
  amount: 75000,
  orderId: 'ORDER_456',
  phoneNumber: '+998901234567'
};
```

### UzCard
```typescript
const uzcardPayment = {
  provider: 'uzcard',
  amount: 100000,
  orderId: 'ORDER_789'
};
```

### Humo
```typescript
const humoPayment = {
  provider: 'humo',
  amount: 25000,
  orderId: 'ORDER_101',
  currency: 'UZS'
};
```

### Apelsin
```typescript
const apelsinPayment = {
  provider: 'apelsin',
  amount: 150000,
  orderId: 'ORDER_202',
  returnUrl: 'yourapp://payment-success'
};
```

## 🔄 Обработка результатов

### Успешный платеж
```typescript
const { createPayment } = useUzPay(config);

const result = await createPayment(paymentData);

if (result.success && result.paymentUrl) {
  // Перенаправить пользователя на paymentUrl
  // Использовать WebView или внешний браузер
  Linking.openURL(result.paymentUrl);
}
```

### Обработка ошибок
```typescript
const { createPayment, error } = useUzPay(config);

try {
  const result = await createPayment(paymentData);
} catch (err) {
  console.error('Payment failed:', err.message);
  Alert.alert('Ошибка', err.message);
}

// Или использовать error из хука
if (error) {
  Alert.alert('Ошибка', error);
}
```

## 📱 Интеграция с WebView

```typescript
import { WebView } from 'react-native-webview';

const PaymentWebView = ({ paymentUrl, onPaymentComplete }) => {
  const handleNavigationStateChange = (navState) => {
    // Отследить успешное завершение платежа
    if (navState.url.includes('success') || navState.url.includes('payment-complete')) {
      onPaymentComplete(true);
    }
    
    if (navState.url.includes('cancel') || navState.url.includes('error')) {
      onPaymentComplete(false);
    }
  };

  return (
    <WebView
      source={{ uri: paymentUrl }}
      onNavigationStateChange={handleNavigationStateChange}
      startInLoadingState
      scalesPageToFit
    />
  );
};
```

## 🔍 Мониторинг статуса платежа

```typescript
import { useEffect, useState } from 'react';

const usePaymentStatus = (transactionId: string, provider: string) => {
  const [status, setStatus] = useState('pending');
  const { checkPaymentStatus } = useUzPay(config);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const result = await checkPaymentStatus(transactionId, provider);
        setStatus(result.status);
        
        if (result.status === 'success' || result.status === 'failed') {
          clearInterval(interval);
        }
      } catch (error) {
        console.error('Status check failed:', error);
      }
    }, 3000); // Check every 3 seconds

    return () => clearInterval(interval);
  }, [transactionId, provider]);

  return status;
};
```

## 🛡️ Безопасность

- Никогда не храните API ключи в коде приложения
- Используйте переменные окружения или secure storage
- Валидируйте все входящие данные
- Используйте HTTPS для всех запросов

```typescript
import { MMKV } from 'react-native-mmkv';

// Secure storage for API key
const storage = new MMKV();

const getApiKey = () => {
  return storage.getString('uzpay.api.key');
};

const config = {
  baseUrl: 'https://your-server.com',
  apiKey: getApiKey(),
};
```

## 📊 TypeScript поддержка

SDK полностью типизирован:

```typescript
import type { 
  PaymentConfig,
  CreatePaymentData,
  PaymentResponse,
  PaymentStatus 
} from '@uz-pay/react-native-sdk';

const config: PaymentConfig = {
  baseUrl: 'https://api.uzpay.com',
  apiKey: 'key',
  timeout: 30000
};

const paymentData: CreatePaymentData = {
  provider: 'payme',
  amount: 50000,
  orderId: 'ORDER_123'
};
```

## 📚 API Reference

### UzPayReactNative

| Метод | Параметры | Возвращает | Описание |
|-------|-----------|------------|----------|
| `createPayment` | `CreatePaymentData` | `Promise<PaymentResponse>` | Создать платеж |
| `checkPaymentStatus` | `transactionId, provider` | `Promise<PaymentStatus>` | Проверить статус |
| `cancelPayment` | `transactionId, provider` | `Promise<PaymentResponse>` | Отменить платеж |
| `getAvailableProviders` | - | `Promise<string[]>` | Получить провайдеров |

### useUzPay Hook

| Свойство | Тип | Описание |
|----------|-----|----------|
| `createPayment` | `function` | Создать платеж |
| `checkPaymentStatus` | `function` | Проверить статус |
| `cancelPayment` | `function` | Отменить платеж |
| `loading` | `boolean` | Состояние загрузки |
| `error` | `string\|null` | Текст ошибки |
| `paymentResult` | `PaymentResponse\|null` | Результат платежа |

## 🤝 Вклад в проект

Мы приветствуем вклад в развитие проекта! Пожалуйста, ознакомьтесь с [CONTRIBUTING.md](../../CONTRIBUTING.md).

## 📄 Лицензия

MIT License - смотрите [LICENSE](../../LICENSE) файл.

## 🆘 Поддержка

- 📖 [Документация](https://github.com/Ilnur72/uz-pay-sdk)
- 🐛 [Сообщить об ошибке](https://github.com/Ilnur72/uz-pay-sdk/issues)
- 📧 Email: umirbayev72@gmail.com

---

**Сделано с ❤️ в Узбекистане**
