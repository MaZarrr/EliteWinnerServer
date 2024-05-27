import { Field, InputType, Int, ObjectType, PickType } from "@nestjs/graphql";
import { Payment } from "../entities/payment.entity";
import { CoreOutput } from "src/common/dto/output.dto";

@InputType()
export class CreatePaymentInput extends PickType(Payment, [
    'transactionId',
    'user'
]) {}


@ObjectType()
export class CreatePaymentOutput extends CoreOutput {}

export class CreatePayment extends PickType(Payment, [
    'transactionId',
    'user'
]){}

export class PaymentOutput extends CoreOutput {}