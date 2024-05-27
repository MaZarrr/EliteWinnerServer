import { CoreOutput } from "src/common/dto/output.dto";
import { Payment } from "../entities/payment.entity";


export class GetPayment extends CoreOutput {
    payments?: Payment[]
}