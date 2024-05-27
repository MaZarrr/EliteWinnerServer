import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { PaymentService } from './payments.service';
import { PaymentController } from './payments.controller';
import { User } from 'src/users/enities/user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Payment, User])],
    providers: [PaymentService], // PaymentResolver
    controllers: [PaymentController]
})
export class PaymentsModule {}
