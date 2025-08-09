import { Injectable, BadRequestException } from '@nestjs/common';
import { PaymentsService } from 'uz-pay-sdk';

interface CreateOrderDto {
  customerName: string;
  customerPhone: string;
  items: Array<{
    name: string;
    price: number;
    quantity: number;
  }>;
  paymentProvider: 'payme' | 'click' | 'uzcard' | 'humo' | 'apelsin';
}

interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  items: any[];
  total: number;
  status: 'pending' | 'paid' | 'cancelled';
  paymentProvider: string;
  transactionId?: string;
  paymentUrl?: string;
  createdAt: Date;
}

@Injectable()
export class EcommerceService {
  private orders: Map<string, Order> = new Map();

  constructor(private readonly paymentsService: PaymentsService) {}

  // Buyurtma yaratish va to'lov boshlash
  async createOrder(createOrderDto: CreateOrderDto) {
    // Umumiy summani hisoblash
    const total = createOrderDto.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    // Buyurtma ID yaratish
    const orderId = `order-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    // Buyurtmani saqlash
    const order: Order = {
      id: orderId,
      customerName: createOrderDto.customerName,
      customerPhone: createOrderDto.customerPhone,
      items: createOrderDto.items,
      total,
      status: 'pending',
      paymentProvider: createOrderDto.paymentProvider,
      createdAt: new Date(),
    };

    this.orders.set(orderId, order);

    try {
      // To'lov yaratish
      const paymentData = {
        amount: total * 100, // tiyin'ga o'tkazish
        orderId: orderId,
        description: `Buyurtma #${orderId} - ${createOrderDto.customerName}`,
        returnUrl: `https://myshop.uz/payment/success?orderId=${orderId}`,
        cancelUrl: `https://myshop.uz/payment/cancel?orderId=${orderId}`,
      };

      console.log(
        `${createOrderDto.paymentProvider} orqali to'lov yaratilmoqda...`,
      );

      const paymentResult = await this.paymentsService.create(
        createOrderDto.paymentProvider,
        paymentData,
      );

      if (paymentResult.success) {
        // Buyurtmani yangilash
        order.transactionId = paymentResult.transactionId;
        order.paymentUrl = paymentResult.paymentUrl;
        this.orders.set(orderId, order);

        return {
          success: true,
          orderId,
          total,
          paymentUrl: paymentResult.paymentUrl,
          transactionId: paymentResult.transactionId,
          message: `To'lov ${createOrderDto.paymentProvider} orqali yaratildi`,
        };
      } else {
        throw new Error(paymentResult.message || "To'lov yaratishda xatolik");
      }
    } catch (error) {
      // Buyurtmani bekor qilish
      this.orders.delete(orderId);

      throw new BadRequestException({
        success: false,
        message: `To'lov yaratishda xatolik: ${error.message}`,
        provider: createOrderDto.paymentProvider,
      });
    }
  }

  // Buyurtma holatini tekshirish
  async checkOrderStatus(orderId: string) {
    const order = this.orders.get(orderId);

    if (!order) {
      throw new BadRequestException('Buyurtma topilmadi');
    }

    if (!order.transactionId) {
      return {
        success: true,
        order: order,
        paymentStatus: null,
        message: "To'lov hali yaratilmagan",
      };
    }

    try {
      // To'lov holatini tekshirish
      const paymentStatus = await this.paymentsService.check(
        order.paymentProvider,
        { transactionId: order.transactionId },
      );

      // To'lov holati bo'yicha buyurtmani yangilash
      if (
        paymentStatus.status === 'completed' ||
        paymentStatus.status === 'success'
      ) {
        order.status = 'paid';
      } else if (
        paymentStatus.status === 'cancelled' ||
        paymentStatus.status === 'failed'
      ) {
        order.status = 'cancelled';
      }

      this.orders.set(orderId, order);

      return {
        success: true,
        order: order,
        paymentStatus: paymentStatus,
        message: 'Buyurtma holati yangilandi',
      };
    } catch (error) {
      return {
        success: false,
        order: order,
        paymentStatus: null,
        message: `To'lov holatini tekshirishda xatolik: ${error.message}`,
      };
    }
  }

  // Buyurtmani bekor qilish
  async cancelOrder(orderId: string) {
    const order = this.orders.get(orderId);

    if (!order) {
      throw new BadRequestException('Buyurtma topilmadi');
    }

    if (order.status === 'paid') {
      throw new BadRequestException(
        "To'langan buyurtmani bekor qilib bo'lmaydi",
      );
    }

    try {
      // Agar to'lov yaratilgan bo'lsa va bekor qilish mumkin bo'lsa
      if (
        order.transactionId &&
        ['uzcard', 'humo', 'apelsin'].includes(order.paymentProvider)
      ) {
        const cancelResult = await this.paymentsService.cancel(
          order.paymentProvider,
          { transactionId: order.transactionId },
        );

        if (cancelResult.success) {
          order.status = 'cancelled';
          this.orders.set(orderId, order);

          return {
            success: true,
            order: order,
            message: "Buyurtma va to'lov bekor qilindi",
          };
        }
      }

      // Faqat buyurtmani bekor qilish
      order.status = 'cancelled';
      this.orders.set(orderId, order);

      return {
        success: true,
        order: order,
        message: 'Buyurtma bekor qilindi',
      };
    } catch (error) {
      throw new BadRequestException({
        success: false,
        message: `Buyurtmani bekor qilishda xatolik: ${error.message}`,
      });
    }
  }

  // Barcha buyurtmalar ro'yxati
  getAllOrders() {
    return Array.from(this.orders.values()).map((order) => ({
      id: order.id,
      customerName: order.customerName,
      total: order.total,
      status: order.status,
      paymentProvider: order.paymentProvider,
      createdAt: order.createdAt,
    }));
  }

  // Statistika
  getStatistics() {
    const orders = Array.from(this.orders.values());

    return {
      totalOrders: orders.length,
      paidOrders: orders.filter((o) => o.status === 'paid').length,
      pendingOrders: orders.filter((o) => o.status === 'pending').length,
      cancelledOrders: orders.filter((o) => o.status === 'cancelled').length,
      totalRevenue: orders
        .filter((o) => o.status === 'paid')
        .reduce((sum, o) => sum + o.total, 0),
      providerStats: {
        payme: orders.filter((o) => o.paymentProvider === 'payme').length,
        click: orders.filter((o) => o.paymentProvider === 'click').length,
        uzcard: orders.filter((o) => o.paymentProvider === 'uzcard').length,
        humo: orders.filter((o) => o.paymentProvider === 'humo').length,
        apelsin: orders.filter((o) => o.paymentProvider === 'apelsin').length,
      },
    };
  }

  // Mavjud to'lov usullarini olish
  getPaymentMethods() {
    const providers = this.paymentsService.getAvailableProviders();

    return providers.map((provider) => {
      const info = this.paymentsService.getProviderInfo(provider);
      return {
        id: provider,
        name: info.name,
        description: info.description,
        supportedMethods: info.supportedMethods,
        currencies: info.currency,
      };
    });
  }
}
