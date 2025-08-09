import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { EcommerceService } from './ecommerce.service';

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

@Controller('shop')
export class EcommerceController {
  constructor(private readonly ecommerceService: EcommerceService) {}

  /**
   * Buyurtma yaratish va to'lov boshlash
   * POST /shop/orders
   */
  @Post('orders')
  async createOrder(@Body() createOrderDto: CreateOrderDto) {
    try {
      const result = await this.ecommerceService.createOrder(createOrderDto);

      return {
        success: true,
        data: result,
        message: "Buyurtma yaratildi, to'lovga o'ting",
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message,
          timestamp: new Date().toISOString(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * Buyurtma holatini tekshirish
   * GET /shop/orders/:orderId/status
   */
  @Get('orders/:orderId/status')
  async checkOrderStatus(@Param('orderId') orderId: string) {
    try {
      const result = await this.ecommerceService.checkOrderStatus(orderId);
      return result;
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message,
          timestamp: new Date().toISOString(),
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  /**
   * Buyurtmani bekor qilish
   * DELETE /shop/orders/:orderId
   */
  @Delete('orders/:orderId')
  async cancelOrder(@Param('orderId') orderId: string) {
    try {
      const result = await this.ecommerceService.cancelOrder(orderId);
      return result;
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message,
          timestamp: new Date().toISOString(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * Barcha buyurtmalar ro'yxati
   * GET /shop/orders
   */
  @Get('orders')
  getAllOrders() {
    const orders = this.ecommerceService.getAllOrders();
    return {
      success: true,
      data: orders,
      count: orders.length,
    };
  }

  /**
   * Statistika
   * GET /shop/statistics
   */
  @Get('statistics')
  getStatistics() {
    const stats = this.ecommerceService.getStatistics();
    return {
      success: true,
      data: stats,
    };
  }

  /**
   * Mavjud to'lov usullari
   * GET /shop/payment-methods
   */
  @Get('payment-methods')
  getPaymentMethods() {
    const methods = this.ecommerceService.getPaymentMethods();
    return {
      success: true,
      data: methods,
      message: "Mavjud to'lov usullari",
    };
  }

  /**
   * To'lov muvaffaqiyatli yakunlangandan so'ng
   * GET /shop/payment/success
   */
  @Get('payment/success')
  async paymentSuccess(@Param('orderId') orderId: string) {
    if (!orderId) {
      throw new HttpException(
        'Order ID talab qilinadi',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      // Buyurtma holatini tekshirish
      const result = await this.ecommerceService.checkOrderStatus(orderId);

      if (result.order.status === 'paid') {
        return {
          success: true,
          message: "To'lov muvaffaqiyatli amalga oshirildi!",
          order: result.order,
        };
      } else {
        return {
          success: false,
          message: "To'lov hali tasdiqlanmagan, biroz kuting...",
          order: result.order,
        };
      }
    } catch (error) {
      return {
        success: false,
        message: "To'lov holatini tekshirishda xatolik yuz berdi",
        error: error.message,
      };
    }
  }

  /**
   * To'lov bekor qilingandan so'ng
   * GET /shop/payment/cancel
   */
  @Get('payment/cancel')
  async paymentCancel(@Param('orderId') orderId: string) {
    if (!orderId) {
      throw new HttpException(
        'Order ID talab qilinadi',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      // Buyurtmani bekor qilish
      const result = await this.ecommerceService.cancelOrder(orderId);

      return {
        success: true,
        message: "To'lov bekor qilindi",
        order: result.order,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Buyurtmani bekor qilishda xatolik',
        error: error.message,
      };
    }
  }
}
