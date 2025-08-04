export interface PaymentDriver {
  createPayment(data: any): Promise<any>;
  checkPayment(data: any): Promise<any>;
  cancelPayment?(data: any): Promise<any>;
}
