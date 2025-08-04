import { Module } from '@nestjs/common';
import { PaymeDriver } from 'src/payments/drivers/payme.driver';
import { PaymentsController } from './payments.controller';
import { ClickDriver } from './drivers/click.driver';
import { UzcardDriver } from './drivers/uzcard.driver';
import { HumoDriver } from './drivers/humo.driver';
import { PaymentsService } from './payments.service';

@Module({
  controllers: [PaymentsController],
  providers: [
    PaymentsService,
    PaymeDriver,
    ClickDriver,
    UzcardDriver,
    HumoDriver,
  ],
  exports: [PaymentsService],
})
export class PaymentsModule {}
