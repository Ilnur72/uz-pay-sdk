import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymeDriver } from 'src/payments/drivers/payme.driver';
import { PaymentsController } from './payments.controller';
import { ClickDriver } from './drivers/click.driver';

@Module({
  controllers: [PaymentsController],
  providers: [PaymentsService, PaymeDriver, ClickDriver],
  exports: [PaymentsService],
})
export class PaymentsModule {}
