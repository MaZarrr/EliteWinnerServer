import { Body, Controller, Post } from "@nestjs/common"
import { PaymentService } from "./payments.service";
import { CreatePayment, PaymentOutput } from "./dtos/create-payment.dto";
import { AuthUser } from "src/auth/auth-user.decorator";
import { Role } from "src/auth/role.decorator";
import { User } from "src/users/enities/user.entity";
import { GetPayment } from "./dtos/get-payments.dto";

@Controller()
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    ) {}
    
    @Post('createPayment')
    @Role(['Client'])
    async createPayment(@AuthUser() user: User, @Body() createPayment: CreatePayment): Promise<PaymentOutput> {
        return this.paymentService.createPayment(user, createPayment);
    }

    @Post('getPayments')
    @Role(['Client'])
    async getPayment(@AuthUser() user: User): Promise<GetPayment> {
        return this.paymentService.getPayments(user)
    }

}