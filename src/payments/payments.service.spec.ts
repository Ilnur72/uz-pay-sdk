import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsService } from './payments.service';
import { PaymeDriver } from './drivers/payme.driver';
import { ClickDriver } from './drivers/click.driver';
import { UzcardDriver } from './drivers/uzcard.driver';
import { HumoDriver } from './drivers/humo.driver';
import { ApelsinDriver } from './drivers/apelsin.driver';

describe('PaymentsService', () => {
  let service: PaymentsService;

  // Mock drivers
  const mockPaymeDriver = {
    createPayment: jest.fn(),
    checkPayment: jest.fn(),
  };

  const mockClickDriver = {
    createPayment: jest.fn(),
    checkPayment: jest.fn(),
  };

  const mockUzcardDriver = {
    createPayment: jest.fn(),
    checkPayment: jest.fn(),
    cancelPayment: jest.fn(),
  };

  const mockHumoDriver = {
    createPayment: jest.fn(),
    checkPayment: jest.fn(),
    cancelPayment: jest.fn(),
  };

  const mockApelsinDriver = {
    createPayment: jest.fn(),
    checkPayment: jest.fn(),
    cancelPayment: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentsService,
        { provide: PaymeDriver, useValue: mockPaymeDriver },
        { provide: ClickDriver, useValue: mockClickDriver },
        { provide: UzcardDriver, useValue: mockUzcardDriver },
        { provide: HumoDriver, useValue: mockHumoDriver },
        { provide: ApelsinDriver, useValue: mockApelsinDriver },
      ],
    }).compile();

    service = module.get<PaymentsService>(PaymentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
