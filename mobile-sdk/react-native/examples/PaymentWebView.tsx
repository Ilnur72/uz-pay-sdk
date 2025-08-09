import React from 'react';
import { WebView } from 'react-native-webview';
import { View, StyleSheet, Alert } from 'react-native';

interface PaymentWebViewProps {
  paymentUrl: string;
  onPaymentComplete: (success: boolean) => void;
  onClose: () => void;
}

const PaymentWebView: React.FC<PaymentWebViewProps> = ({
  paymentUrl,
  onPaymentComplete,
  onClose,
}) => {
  const handleNavigationStateChange = (navState: any) => {
    const { url } = navState;

    // Check for success patterns
    if (
      url.includes('success') ||
      url.includes('payment-complete') ||
      url.includes('payment-success') ||
      url.includes('status=success')
    ) {
      onPaymentComplete(true);
      return;
    }

    // Check for error/cancel patterns
    if (
      url.includes('cancel') ||
      url.includes('error') ||
      url.includes('failed') ||
      url.includes('status=error') ||
      url.includes('status=cancelled')
    ) {
      onPaymentComplete(false);
      return;
    }

    // Check for timeout
    if (url.includes('timeout')) {
      Alert.alert('Время вышло', 'Время для оплаты истекло');
      onPaymentComplete(false);
      return;
    }
  };

  const handleError = (error: any) => {
    console.error('WebView Error:', error);
    Alert.alert('Ошибка', 'Произошла ошибка при загрузке страницы оплаты');
    onPaymentComplete(false);
  };

  const handleHttpError = (event: any) => {
    console.error('HTTP Error:', event.nativeEvent);
    if (event.nativeEvent.statusCode >= 400) {
      Alert.alert('Ошибка сети', 'Не удалось загрузить страницу оплаты');
      onPaymentComplete(false);
    }
  };

  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: paymentUrl }}
        onNavigationStateChange={handleNavigationStateChange}
        onError={handleError}
        onHttpError={handleHttpError}
        startInLoadingState
        scalesPageToFit
        javaScriptEnabled
        domStorageEnabled
        allowsBackForwardNavigationGestures
        style={styles.webview}
        userAgent="UzPayMobileSDK/1.0.0"
        injectedJavaScript={`
          // Add any custom JavaScript here
          window.ReactNativeWebView = window.ReactNativeWebView || {};
          
          // Listen for payment events
          window.addEventListener('message', function(event) {
            if (event.data.type === 'payment_complete') {
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'payment_result',
                success: event.data.success
              }));
            }
          });
          
          true; // Required for injectedJavaScript
        `}
        onMessage={(event) => {
          try {
            const data = JSON.parse(event.nativeEvent.data);
            if (data.type === 'payment_result') {
              onPaymentComplete(data.success);
            }
          } catch (error) {
            console.error('Error parsing message:', error);
          }
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  webview: {
    flex: 1,
  },
});

export default PaymentWebView;
