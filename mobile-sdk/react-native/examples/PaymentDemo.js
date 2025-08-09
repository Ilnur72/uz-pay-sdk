import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';

// UZ Pay SDK import qilish
// import { useUzPay } from '@uz-pay/react-native-sdk';

// Demo uchun mock hook
const useUzPay = (config) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paymentResult, setPaymentResult] = useState(null);

  const createPayment = async (paymentData) => {
    setLoading(true);
    setError(null);

    // Demo: 2 sekund kutish
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const mockResult = {
      success: true,
      paymentUrl: 'https://checkout.paycom.uz/demo/payment',
      transactionId: 'TXN_' + Date.now(),
      message: "To'lov muvaffaqiyatli yaratildi",
    };

    setPaymentResult(mockResult);
    setLoading(false);
    return mockResult;
  };

  return { createPayment, loading, error, paymentResult };
};

const PaymentDemo = () => {
  const { createPayment, loading, error, paymentResult } = useUzPay({
    baseUrl: 'https://api.uzpay.com',
    apiKey: 'demo-key-123',
    timeout: 30000,
  });

  const handlePaymePayment = async () => {
    try {
      const result = await createPayment({
        provider: 'payme',
        amount: 50000, // 500 so'm
        orderId: 'ORDER_' + Date.now(),
        description: "Demo to'lovi - Payme",
      });

      if (result.success) {
        Alert.alert(
          'Muvaffaqiyat!',
          `To'lov yaratildi!\nTransaction ID: ${result.transactionId}`,
          [
            {
              text: 'OK',
              onPress: () => console.log('Payment URL:', result.paymentUrl),
            },
          ],
        );
      }
    } catch (err) {
      Alert.alert('Xato', err.message);
    }
  };

  const handleClickPayment = async () => {
    try {
      const result = await createPayment({
        provider: 'click',
        amount: 75000, // 750 so'm
        orderId: 'CLICK_' + Date.now(),
        phoneNumber: '+998901234567',
        description: "Demo to'lovi - Click",
      });

      if (result.success) {
        Alert.alert(
          'Muvaffaqiyat!',
          `Click to'lov yaratildi!\nTelefon: +998901234567`,
        );
      }
    } catch (err) {
      Alert.alert('Xato', err.message);
    }
  };

  const handleUzCardPayment = async () => {
    try {
      const result = await createPayment({
        provider: 'uzcard',
        amount: 100000, // 1000 so'm
        orderId: 'UZC_' + Date.now(),
        description: "Demo to'lovi - UzCard",
      });

      if (result.success) {
        Alert.alert(
          'Muvaffaqiyat!',
          `UzCard to'lov yaratildi!\nMilliy to'lov tizimi`,
        );
      }
    } catch (err) {
      Alert.alert('Xato', err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🇺🇿 UZ Pay Mobile SDK Demo</Text>
      <Text style={styles.subtitle}>O'zbekiston to'lov tizimlari</Text>

      <View style={styles.buttonContainer}>
        <Button
          title={loading ? 'Ishlanmoqda...' : "💳 Payme (500 so'm)"}
          onPress={handlePaymePayment}
          disabled={loading}
          color="#00AAFF"
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title={loading ? 'Ishlanmoqda...' : "📱 Click (750 so'm)"}
          onPress={handleClickPayment}
          disabled={loading}
          color="#FF6B35"
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title={loading ? 'Ishlanmoqda...' : "🏦 UzCard (1000 so'm)"}
          onPress={handleUzCardPayment}
          disabled={loading}
          color="#4CAF50"
        />
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>❌ Xato: {error}</Text>
        </View>
      )}

      {paymentResult && (
        <View style={styles.successContainer}>
          <Text style={styles.successTitle}>✅ Muvaffaqiyat!</Text>
          <Text style={styles.successText}>
            Status: {paymentResult.success ? 'Yaratildi' : 'Xato'}
          </Text>
          <Text style={styles.successText}>
            ID: {paymentResult.transactionId}
          </Text>
          <Text style={styles.successText}>
            URL: {paymentResult.paymentUrl}
          </Text>
        </View>
      )}

      <Text style={styles.footer}>
        SDK Version: @uz-pay/react-native-sdk@1.0.0
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
  },
  buttonContainer: {
    marginVertical: 10,
    borderRadius: 8,
    overflow: 'hidden',
  },
  errorContainer: {
    backgroundColor: '#FFE6E6',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  errorText: {
    color: '#D32F2F',
    textAlign: 'center',
    fontSize: 16,
  },
  successContainer: {
    backgroundColor: '#E8F5E8',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  successTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
    textAlign: 'center',
    marginBottom: 10,
  },
  successText: {
    color: '#2E7D32',
    fontSize: 14,
    marginBottom: 5,
  },
  footer: {
    textAlign: 'center',
    marginTop: 30,
    color: '#999',
    fontSize: 12,
  },
});

export default PaymentDemo;
