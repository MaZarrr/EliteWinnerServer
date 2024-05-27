import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";
import { IsNumber, IsString } from "class-validator";
import { CoreEntity } from "src/common/enities/core.entity";
import { User } from "src/users/enities/user.entity";
import { Column, Entity, ManyToOne, RelationId } from "typeorm";

@InputType('OrderInputType', {  isAbstract: true })
@ObjectType()
@Entity()
export class Payment extends CoreEntity {
    
    @Field(type => String)
    @Column(type => String)
    @IsString()
    transactionId: string;

    @Field(type => User)
    @ManyToOne(
        type => User,
        user => user.payments,
    )
    user: User;

    @RelationId((payment: Payment) => payment.user)
    @IsNumber()
    userId: number;

    // @Field(type => Restaurant)
    // @ManyToOne(type => Restaurant)
    // restaurant: Restaurant;

    // @RelationId((order: Payment ) => order.user)
    // user_id: number
    
}