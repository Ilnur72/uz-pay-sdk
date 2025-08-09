# 🚀 UZ PAY SDK - LIVE DEMO

## 📱 **DEMO URL:** 

### **Local Demo:** 
Open `demo.html` in your browser for interactive demo

### **GitHub Pages (Coming Soon):**
- **URL:** https://ilnur72.github.io/uz-pay-sdk
- **Deploy Command:** `gh-pages` branch

---

## 🎯 **DEMO FEATURES:**

### ✅ **IMPLEMENTED:**
- **Interactive Payment Tester** - Real-time code generation
- **Provider Comparison Table** - Speed & success rates
- **Code Generator** - Copy-paste ready code
- **Responsive Design** - Works on mobile & desktop

### 🎮 **HOW TO USE:**
1. Open `demo.html` in browser
2. Select payment provider (Payme, Click, UzCard, etc.)
3. Enter amount and order ID
4. See generated code in real-time
5. Click "Create Payment" for simulation

### 💻 **GENERATED CODE EXAMPLE:**
```typescript
import { PaymentsService } from 'uz-pay-sdk';

const payments = new PaymentsService();

const payment = await payments.create({
  provider: 'payme',
  amount: 50000,
  orderId: 'ORDER_123',
  description: 'Demo payment'
});

console.log('Payment URL:', payment.paymentUrl);
```

---

## 🌐 **DEPLOYMENT OPTIONS:**

### **1. GitHub Pages (Recommended)**
```bash
# Create gh-pages branch
git checkout -b gh-pages
git add demo.html
git commit -m "Add live demo"
git push origin gh-pages
```

### **2. Vercel (Advanced)**
```bash
# Deploy to Vercel
npx vercel --prod
```

### **3. Netlify (One-click)**
Drag & drop `demo.html` to netlify.app

---

## 📊 **DEMO ANALYTICS:**

Track these metrics:
- Page views
- Provider selection distribution  
- Code copy events
- GitHub/NPM link clicks
- Mobile vs desktop usage

**DEMO TAYYOR! Browser'da ochib ko'ring! 🎉**
