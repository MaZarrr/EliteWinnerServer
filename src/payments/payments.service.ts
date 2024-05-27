import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Payment } from "./entities/payment.entity";
import { LessThan, Repository } from "typeorm";
import { CreatePayment, PaymentOutput } from "./dtos/create-payment.dto";
import { User } from "src/users/enities/user.entity";
import { GetPayment } from "./dtos/get-payments.dto";
import { Cron, Interval } from "@nestjs/schedule";

@Injectable()
export class PaymentService {
    constructor(
        @InjectRepository(Payment)
        private readonly payments: Repository<Payment>,
        @InjectRepository(User)
        private readonly users: Repository<User>
    ){}

    async createPayment(user: User, createPayment: CreatePayment): Promise<PaymentOutput> {
        try {
            // if(!restaurant) {
            //     return {
            //         ok: false,
            //         error: 'Такого ресторана нет.'
            //     }
            // }
            // if(restaurant.ownerId !== user.id) {
            //     return {
            //         ok: false,
            //         error: 'Вам не разрешается этого делать.'
            //     }
            // }
            console.log("createPayment__", createPayment);
            
            await this.payments.save((
                this.payments.create({
                    transactionId: createPayment.transactionId,
                    user
                })
            ))

            user.isPromoted = true;
            const date = new Date();
            date.setDate(date.getDate() + 30);
            user.promotedUntil = date;
            this.users.save(user);
            return {
                ok: true
            }
        } catch (error) {
            return {
                ok: false,
                error: "Не удалось произвести оплату." + error
            }
        }
    }

    async getPayments(user: User): Promise<GetPayment> {
        try {
            const payments = await this.payments.find({ where: { userId: user.id } });
            console.log("payments__", payments);
            return {
                ok: true,
                payments
            }
        } catch (error) {
            return {
                ok: false,
                error: 'Не удалось загрузить платежи, попробуйте позже.'
            }
        }
    }

    // @Interval(50000)
    async checkPromotedContests() {
        const users = await this.users.find({ where: { 
            isPromoted: true, 
            promotedUntil: LessThan(new Date()) 
        } });
        console.log("checkPromotedContests__", users);
        
        users.forEach(async ( user ) => {
            user.isPromoted = false;   
            user.promotedUntil = null;
            await this.users.save(user);
        })
    }
}