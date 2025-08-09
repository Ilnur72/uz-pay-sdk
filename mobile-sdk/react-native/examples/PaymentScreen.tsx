import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useUzPay } from '@uz-pay/react-native-sdk';

const PaymentScreen: React.FC = () => {
  const [amount, setAmount] = useState('');
  const [orderId, setOrderId] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<string>('payme');

  const { createPayment, loading, error, paymentResult } = useUzPay({
    baseUrl: 'https://your-uzpay-server.com',
    apiKey: 'your-api-key',
    timeout: 30000,
  });

  const providers = [
    { id: 'payme', name: 'Payme', color: '#00AAFF' },
    { id: 'click', name: 'Click', color: '#FF6B35' },
    { id: 'uzcard', name: 'UzCard', color: '#4CAF50' },
    { id: 'humo', name: 'Humo', color: '#9C27B0' },
    { id: 'apelsin', name: 'Apelsin', color: '#FF9800' },
  ];

  const handlePayment = async () => {
    if (!amount || !orderId) {
      Alert.alert('Ошибка', 'Пожалуйста, заполните все поля');
      return;
    }

    if (selectedProvider === 'click' && !phoneNumber) {
      Alert.alert('Ошибка', 'Для Click требуется номер телефона');
      return;
    }

    try {
      const paymentData: any = {
        provider: selectedProvider,
        amount: parseInt(amount) * 100, // Convert to tiyin
        orderId: orderId,
        description: `Платеж по заказу ${orderId}`,
      };

      if (phoneNumber && selectedProvider === 'click') {
        paymentData.phoneNumber = phoneNumber;
      }

      if (selectedProvider === 'apelsin') {
        paymentData.returnUrl = 'yourapp://payment-success';
      }

      const result = await createPayment(paymentData);

      if (result.success && result.paymentUrl) {
        Alert.alert('Платеж создан', 'Переходим к оплате...', [
          {
            text: 'OK',
            onPress: () => {
              // Здесь можно открыть WebView или внешний браузер
              console.log('Payment URL:', result.paymentUrl);
            },
          },
        ]);
      }
    } catch (err: any) {
      Alert.alert('Ошибка', err.message);
    }
  };

  const clearForm = () => {
    setAmount('');
    setOrderId('');
    setPhoneNumber('');
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>UZ Pay - Оплата</Text>

      {/* Provider Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Выберите способ оплаты:</Text>
        <View style={styles.providersContainer}>
          {providers.map((provider) => (
            <TouchableOpacity
              key={provider.id}
              style={[
                styles.providerButton,
                {
                  backgroundColor:
                    selectedProvider === provider.id
                      ? provider.color
                      : '#F5F5F5',
                },
              ]}
              onPress={() => setSelectedProvider(provider.id)}
            >
              <Text
                style={[
                  styles.providerText,
                  {
                    color: selectedProvider === provider.id ? 'white' : 'black',
                  },
                ]}
              >
                {provider.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Amount Input */}
      <View style={styles.section}>
        <Text style={styles.label}>Сумма (UZS):</Text>
        <TextInput
          style={styles.input}
          value={amount}
          onChangeText={setAmount}
          placeholder="Введите сумму"
          keyboardType="numeric"
        />
      </View>

      {/* Order ID Input */}
      <View style={styles.section}>
        <Text style={styles.label}>ID заказа:</Text>
        <TextInput
          style={styles.input}
          value={orderId}
          onChangeText={setOrderId}
          placeholder="Введите ID заказа"
        />
      </View>

      {/* Phone Number Input (for Click) */}
      {selectedProvider === 'click' && (
        <View style={styles.section}>
          <Text style={styles.label}>Номер телефона:</Text>
          <TextInput
            style={styles.input}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            placeholder="+998901234567"
            keyboardType="phone-pad"
          />
        </View>
      )}

      {/* Error Display */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* Payment Result */}
      {paymentResult && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>Результат:</Text>
          <Text style={styles.resultText}>
            Статус: {paymentResult.success ? 'Успех' : 'Ошибка'}
          </Text>
          {paymentResult.transactionId && (
            <Text style={styles.resultText}>
              ID транзакции: {paymentResult.transactionId}
            </Text>
          )}
        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={handlePayment}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>Оплатить</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={clearForm}
          disabled={loading}
        >
          <Text style={[styles.buttonText, { color: '#007AFF' }]}>
            Очистить
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    color: '#555',
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#F9F9F9',
  },
  providersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  providerButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  providerText: {
    fontSize: 14,
    fontWeight: '600',
  },
  errorContainer: {
    backgroundColor: '#FFE6E6',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 14,
  },
  resultContainer: {
    backgroundColor: '#E8F5E8',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E7D32',
    marginBottom: 8,
  },
  resultText: {
    color: '#2E7D32',
    fontSize: 14,
    marginBottom: 4,
  },
  buttonContainer: {
    gap: 12,
    marginTop: 20,
  },
  button: {
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#007AFF',
  },
  secondaryButton: {
    backgroundColor: '#F0F0F0',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});

export default PaymentScreen;
