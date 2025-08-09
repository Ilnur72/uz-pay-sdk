# 📱 Mobile SDK Test

Bu fayl mobile SDK'ni test qilish uchun yaratilgan.

## Test qilish

```bash
cd mobile-sdk/react-native
npm run build
npm test  # Agar testlar mavjud bo'lsa
```

## SDK Import Test

```typescript
// Test import
import { UzPayReactNative, useUzPay } from '@uz-pay/react-native-sdk';

const config = {
  baseUrl: 'https://api.uzpay.com',
  apiKey: 'test-key'
};

const uzPay = new UzPayReactNative(config);
console.log('SDK yaratildi');

// React Hook test (React mavjud bo'lganda)
// const { createPayment } = useUzPay(config);
```

## Paket tafsilotlari

- **Nom**: @uz-pay/react-native-sdk
- **Versiya**: 1.0.0
- **Asosiy fayl**: dist/index.js
- **Type declarations**: dist/index.d.ts
- **Peer dependencies**: React >=16.8.0, React Native >=0.60.0

## NPM'ga e'lon qilish uchun tayyor!

```bash
npm publish
```
