import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PaymeDriver } from './drivers/payme.driver';
import { PaymentsController } from './payments.controller';
import { ClickDriver } from './drivers/click.driver';
import { UzcardDriver } from './drivers/uzcard.driver';
import { HumoDriver } from './drivers/humo.driver';
import { ApelsinDriver } from './drivers/apelsin.driver';
import { PaymentsService } from './payments.service';
import { PaymentConfigService } from '../config/payment-config.service';

@Module({
  imports: [ConfigModule],
  controllers: [PaymentsController],
  providers: [
    PaymentsService,
    PaymentConfigService,
    PaymeDriver,
    ClickDriver,
    UzcardDriver,
    HumoDriver,
    ApelsinDriver,
  ],
  exports: [PaymentsService],
})
export class PaymentsModule {}
