import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsService } from '../payments.service';
import { PaymeDriver } from '../drivers/payme.driver';
import { ClickDriver } from '../drivers/click.driver';
import { UzcardDriver } from '../drivers/uzcard.driver';
import { HumoDriver } from '../drivers/humo.driver';
import { ApelsinDriver } from '../drivers/apelsin.driver';

describe('PaymentsService', () => {
  let service: PaymentsService;
  let paymeDriver: PaymeDriver;
  let clickDriver: ClickDriver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentsService,
        {
          provide: PaymeDriver,
          useValue: {
            createPayment: jest.fn(),
            checkPayment: jest.fn(),
          },
        },
        {
          provide: ClickDriver,
          useValue: {
            createPayment: jest.fn(),
            checkPayment: jest.fn(),
          },
        },
        {
          provide: UzcardDriver,
          useValue: {
            createPayment: jest.fn(),
            checkPayment: jest.fn(),
            cancelPayment: jest.fn(),
          },
        },
        {
          provide: HumoDriver,
          useValue: {
            createPayment: jest.fn(),
            checkPayment: jest.fn(),
            cancelPayment: jest.fn(),
          },
        },
        {
          provide: ApelsinDriver,
          useValue: {
            createPayment: jest.fn(),
            checkPayment: jest.fn(),
            cancelPayment: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PaymentsService>(PaymentsService);
    paymeDriver = module.get<PaymeDriver>(PaymeDriver);
    clickDriver = module.get<ClickDriver>(ClickDriver);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAvailableProviders', () => {
    it('should return all available providers', () => {
      const providers = service.getAvailableProviders();
      expect(providers).toEqual([
        'payme',
        'click',
        'uzcard',
        'humo',
        'apelsin',
      ]);
    });
  });

  describe('getProviderInfo', () => {
    it('should return provider info for payme', () => {
      const info = service.getProviderInfo('payme');
      expect(info).toEqual({
        name: 'Payme',
        description: "Payme to'lov tizimi",
        supportedMethods: ['create', 'check'],
        currency: ['UZS'],
      });
    });

    it('should return null for unknown provider', () => {
      const info = service.getProviderInfo('unknown');
      expect(info).toBeNull();
    });
  });

  describe('create', () => {
    it('should call payme driver for payme provider', async () => {
      const mockData = { orderId: 'test', amount: 1000 };
      const mockResponse = { success: true };

      jest.spyOn(paymeDriver, 'createPayment').mockResolvedValue(mockResponse);

      const result = await service.create('payme', mockData);

      expect(paymeDriver.createPayment).toHaveBeenCalledWith(mockData);
      expect(result).toEqual(mockResponse);
    });

    it('should throw error for unknown provider', async () => {
      await expect(service.create('unknown', {})).rejects.toThrow(
        "Qo'llab-quvvatlanmaydigan provider: unknown",
      );
    });
  });

  describe('cancel', () => {
    it('should throw error for payme (unsupported)', async () => {
      await expect(service.cancel('payme', {})).rejects.toThrow(
        'Payme uchun bekor qilish funksiyasi mavjud emas',
      );
    });
  });
});
