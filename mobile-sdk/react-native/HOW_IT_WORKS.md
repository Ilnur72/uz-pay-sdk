# 📱 UZ Pay Mobile SDK - Qanday ishlaydi?

## 🚀 O'rnatish

```bash
npm install @uz-pay/react-native-sdk
```

## 🎯 1. Oddiy foydalanish (Hook bilan)

```javascript
import React, { useState } from 'react';
import { View, Button, Text, Alert } from 'react-native';
import { useUzPay } from '@uz-pay/react-native-sdk';

export default function PaymentScreen() {
  const [amount, setAmount] = useState('50000'); // 500 so'm
  const [orderId, setOrderId] = useState('ORDER_001');

  // Hook'dan foydalanish
  const { createPayment, loading, error, paymentResult } = useUzPay({
    baseUrl: 'https://your-uzpay-server.com',
    apiKey: 'your-api-key',
    timeout: 30000 // 30 sekund
  });

  const handlePayment = async () => {
    try {
      const result = await createPayment({
        provider: 'payme',
        amount: parseInt(amount), // tiyin'da (50000 = 500 so'm)
        orderId: orderId,
        description: 'Mahsulot sotib olish'
      });

      if (result.success && result.paymentUrl) {
        Alert.alert('Muvaffaqiyat', 'To\'lov yaratildi!');
        // paymentUrl'ni WebView'da ochish yoki browser'ga yuborish
        console.log('To\'lov URL:', result.paymentUrl);
      } else {
        Alert.alert('Xato', result.error || 'To\'lov yaratilmadi');
      }
    } catch (error) {
      Alert.alert('Xato', error.message);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Summa: {amount} tiyin</Text>
      <Text>Buyurtma: {orderId}</Text>
      
      <Button 
        title={loading ? "Ishlanmoqda..." : "Payme orqali to'lash"} 
        onPress={handlePayment}
        disabled={loading}
      />
      
      {error && <Text style={{ color: 'red' }}>Xato: {error}</Text>}
      
      {paymentResult && (
        <Text style={{ color: 'green' }}>
          Status: {paymentResult.success ? 'Muvaffaqiyat' : 'Xato'}
        </Text>
      )}
    </View>
  );
}
```

## 🎯 2. Bevosita sinf foydalanish

```javascript
import { UzPayReactNative } from '@uz-pay/react-native-sdk';

const uzPay = new UzPayReactNative({
  baseUrl: 'https://api.uzpay.com',
  apiKey: 'your-secret-key',
  timeout: 25000
});

// To'lov yaratish
async function createPayment() {
  const payment = await uzPay.createPayment({
    provider: 'click',
    amount: 75000, // 750 so'm
    orderId: 'ORD_123',
    phoneNumber: '+998901234567', // Click uchun kerak
    description: 'Online xarid'
  });
  
  console.log('To\'lov natijasi:', payment);
  return payment;
}

// To'lov holatini tekshirish
async function checkStatus(transactionId) {
  const status = await uzPay.checkPaymentStatus(transactionId, 'click');
  console.log('Holat:', status.status); // 'pending', 'success', 'failed'
  return status;
}

// To'lovni bekor qilish
async function cancelPayment(transactionId) {
  const result = await uzPay.cancelPayment(transactionId, 'click');
  console.log('Bekor qilish:', result);
  return result;
}
```

## 🎯 3. WebView bilan to'lov sahifasi

```javascript
import React from 'react';
import { WebView } from 'react-native-webview';

export default function PaymentWebView({ paymentUrl, onPaymentComplete }) {
  
  const handleNavigationStateChange = (navState) => {
    // URL o'zgarishini kuzatish
    if (navState.url.includes('success')) {
      onPaymentComplete(true, 'To\'lov muvaffaqiyatli!');
    } else if (navState.url.includes('cancel') || navState.url.includes('error')) {
      onPaymentComplete(false, 'To\'lov bekor qilindi yoki xato');
    }
  };

  return (
    <WebView
      source={{ uri: paymentUrl }}
      onNavigationStateChange={handleNavigationStateChange}
      startInLoadingState={true}
      style={{ flex: 1 }}
    />
  );
}

// Foydalanish:
function MainScreen() {
  const [paymentUrl, setPaymentUrl] = useState(null);
  const { createPayment } = useUzPay(config);

  const startPayment = async () => {
    const result = await createPayment({
      provider: 'uzcard',
      amount: 100000, // 1000 so'm
      orderId: 'ORDER_456'
    });
    
    if (result.paymentUrl) {
      setPaymentUrl(result.paymentUrl);
    }
  };

  const onPaymentComplete = (success, message) => {
    setPaymentUrl(null);
    Alert.alert(success ? 'Muvaffaqiyat' : 'Xato', message);
  };

  if (paymentUrl) {
    return (
      <PaymentWebView 
        paymentUrl={paymentUrl}
        onPaymentComplete={onPaymentComplete}
      />
    );
  }

  return (
    <View>
      <Button title="UzCard orqali to'lash" onPress={startPayment} />
    </View>
  );
}
```

## 🎯 4. Barcha provayderlar bilan ishlash

```javascript
const PaymentProviders = () => {
  const { createPayment, loading } = useUzPay(config);

  const payWithPayme = () => createPayment({
    provider: 'payme',
    amount: 50000,
    orderId: 'PAY_001'
  });

  const payWithClick = () => createPayment({
    provider: 'click', 
    amount: 75000,
    orderId: 'CLI_001',
    phoneNumber: '+998901234567' // Click uchun majburiy
  });

  const payWithUzCard = () => createPayment({
    provider: 'uzcard',
    amount: 100000,
    orderId: 'UZC_001'
  });

  const payWithHumo = () => createPayment({
    provider: 'humo',
    amount: 25000,
    orderId: 'HUM_001',
    currency: 'UZS'
  });

  const payWithApelsin = () => createPayment({
    provider: 'apelsin',
    amount: 150000,
    orderId: 'APE_001',
    returnUrl: 'myapp://payment-success' // Apelsin uchun
  });

  return (
    <View style={{ padding: 20 }}>
      <Button title="Payme" onPress={payWithPayme} disabled={loading} />
      <Button title="Click" onPress={payWithClick} disabled={loading} />
      <Button title="UzCard" onPress={payWithUzCard} disabled={loading} />
      <Button title="Humo" onPress={payWithHumo} disabled={loading} />
      <Button title="Apelsin" onPress={payWithApelsin} disabled={loading} />
    </View>
  );
};
```

## 🎯 5. Xatoliklar bilan ishlash

```javascript
const handlePaymentWithErrorHandling = async () => {
  const { createPayment } = useUzPay(config);
  
  try {
    const result = await createPayment({
      provider: 'payme',
      amount: 50000,
      orderId: 'ORDER_ERROR_TEST'
    });

    if (result.success) {
      // Muvaffaqiyatli to'lov
      console.log('To\'lov yaratildi:', result.paymentUrl);
    } else {
      // Server xatosi
      console.error('Server xatosi:', result.error);
    }
  } catch (error) {
    // Tarmoq yoki boshqa xatolik
    if (error.message.includes('timeout')) {
      Alert.alert('Xato', 'Server javob bermadi. Qaytadan urinib ko\'ring.');
    } else if (error.message.includes('Network')) {
      Alert.alert('Xato', 'Internet aloqasini tekshiring.');
    } else {
      Alert.alert('Xato', error.message);
    }
  }
};
```

## 🎯 6. Real vaqtda status kuzatish

```javascript
const usePaymentTracking = (transactionId, provider) => {
  const [status, setStatus] = useState('pending');
  const { checkPaymentStatus } = useUzPay(config);

  useEffect(() => {
    if (!transactionId) return;

    const interval = setInterval(async () => {
      try {
        const result = await checkPaymentStatus(transactionId, provider);
        setStatus(result.status);
        
        // Agar to'lov tugagan bo'lsa, kuzatishni to'xtatish
        if (result.status === 'success' || result.status === 'failed') {
          clearInterval(interval);
        }
      } catch (error) {
        console.error('Status tekshirishda xato:', error);
      }
    }, 3000); // Har 3 sekundda tekshirish

    return () => clearInterval(interval);
  }, [transactionId, provider]);

  return status;
};

// Foydalanish
const PaymentTracker = ({ transactionId, provider }) => {
  const status = usePaymentTracking(transactionId, provider);
  
  const getStatusText = () => {
    switch(status) {
      case 'pending': return 'Kutilmoqda...';
      case 'success': return 'Muvaffaqiyatli ✅';
      case 'failed': return 'Muvaffaqiyatsiz ❌';
      case 'cancelled': return 'Bekor qilindi 🚫';
      default: return 'Noma\'lum holat';
    }
  };

  return (
    <Text style={{ fontSize: 18 }}>
      To'lov holati: {getStatusText()}
    </Text>
  );
};
```

## 🎯 7. TypeScript bilan to'liq tipizatsiya

```typescript
import { 
  UzPayReactNative, 
  useUzPay, 
  PaymentConfig,
  CreatePaymentData,
  PaymentResponse 
} from '@uz-pay/react-native-sdk';

interface MyPaymentConfig extends PaymentConfig {
  userId?: string;
  customField?: string;
}

const PaymentComponent: React.FC = () => {
  const config: PaymentConfig = {
    baseUrl: 'https://api.uzpay.com',
    apiKey: process.env.UZPAY_API_KEY || '',
    timeout: 30000
  };

  const { createPayment, loading, error } = useUzPay(config);

  const handlePayment = async (data: CreatePaymentData): Promise<void> => {
    const result: PaymentResponse = await createPayment(data);
    
    if (result.success) {
      console.log('Payment URL:', result.paymentUrl);
      console.log('Transaction ID:', result.transactionId);
    }
  };

  return (
    <View>
      <Button 
        title="To'lov qilish"
        onPress={() => handlePayment({
          provider: 'payme',
          amount: 50000,
          orderId: 'ORD_' + Date.now(),
          description: 'Test to\'lovi'
        })}
        disabled={loading}
      />
    </View>
  );
};
```

## 🚀 Asosiy xususiyatlari:

1. **Oson foydalanish** - useUzPay hook orqali
2. **TypeScript qo'llab-quvvatlash** - to'liq tipizatsiya
3. **5 ta provayderlar** - Payme, Click, UzCard, Humo, Apelsin
4. **WebView integratsiya** - to'lov sahifalari uchun
5. **Real-time tracking** - to'lov holatini kuzatish
6. **Xatoliklar boshqaruvi** - professional error handling
7. **Timeout boshqaruvi** - server javob kutish vaqti

**Mobile SDK tayyor va ishlatishga yaroqli!** 📱✅
