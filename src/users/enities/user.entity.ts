import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { CoreEntity } from 'src/common/enities/core.entity';
import * as bcrypt from 'bcrypt';
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { InternalServerErrorException } from '@nestjs/common';
import { IsBoolean, IsEmail, isEmail, IsEnum, IsNumber, IsPhoneNumber, IsString } from 'class-validator';
// import { Payment } from 'src/payments/entities/payments.entity';
import { Groups } from './groups.entity';
import { Payment } from 'src/payments/entities/payment.entity';

export enum UserRole {
  Client = 'Client',
  Owner = 'Owner',
  Delivery = 'Delivery'
}

// registerEnumType(UserRole, { name: 'UserRole' });

@InputType('UserInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class User extends CoreEntity {

  @Column({ unique: true, nullable: false } )
  @Field((type) => String)
  @IsString()
  access_token: string

  // @PrimaryColumn({ unique: true })
  @Column({ unique: true, nullable: false } )
  @Field((type) => Number)
  @IsNumber()
  userUid: Number

  @Column({ unique: true, nullable: false } )
  @Field((type) => String)
  @IsString()
  userHash: string

  @Column({ nullable: false } )
  @Field((type) => String)
  @IsString()
  first_name: string

  @Column({ nullable: true } )
  @Field((type) => String)
  @IsString()
  last_name: string

  @Column({ nullable: false } )
  @Field((type) => String)
  @IsString()
  photo_100: string

  @Column({ nullable: false } )
  @Field((type) => Boolean)
  @IsBoolean()
  can_access_closed: boolean

  @Column({ nullable: false } )
  @Field((type) => Boolean)
  @IsBoolean()
  is_closed: boolean

  @Column({ nullable: false } )
  @Field((type) => Number)
  @IsNumber()
  contest_count_test: number // количество первых бесплатных розыгрышей для проведения

  @Column({ type: 'enum', enum: UserRole })
  @Field((type) => UserRole)
  @IsEnum(UserRole)
  role: UserRole;

  @Field(type => [Payment])
  @OneToMany((type) => Payment, (payment) => payment.user, { eager: true })
  payments: Payment[]

  @Column({ default: false })
  @Field((type) => Boolean, { defaultValue: false })
  @IsBoolean()
  isPromoted: boolean

  @Column({ nullable: true })
  @Field(type => Date, { nullable: true })
  promotedUntil: Date


  // =======================================================
  // =======================================================
  // =======================================================

  // @Column({ nullable: false } )
  // @Field((type) => Number)
  // @IsNumber()
  // contest_count_all: number

  // @OneToMany(() => Groups, (groups) => groups.userId)
  // groups: Groups[]
  
  // @Column({ unique: true, nullable: true, default: '' })
  // @Field((type) => String)
  // @IsPhoneNumber()
  // phone?: string;

  // @Column({ unique: true, nullable: true, default: ''})
  // @Field((type) => String)
  // @IsEmail()
  // email: string;

  // @Column({ select: false, nullable: true, default: '' })
  // @Field((type) => String, { nullable: true })
  // @IsString()
  // password?: string;

  // @Column({ nullable: true, default: ''  })
  // // @Column({ select: false })
  // @Field((type) => String)
  // @IsString()
  // passwordEmail: string;

  // @Column({ type: 'enum', enum: UserRole, default: UserRole.Client })
  // @Field((type) => UserRole)
  // @IsEnum(UserRole)
  // role: UserRole;

  // @Column({ default: false })
  // @Field((type) => Boolean)
  // @IsBoolean()
  // verified: boolean;
  // // email или телефон при регистрации // !!!

  // @Field(type => [Payment])
  // @OneToMany(type => Payment, payment => payment.user, { eager: true })
  // payments: Payment[]

  // @BeforeInsert()
  // @BeforeUpdate()
  // async hashPassword(): Promise<void> {
  //   if (this.password) {
  //     try {
  //       this.password = await bcrypt.hash(this.password, 10);
  //     } catch (error) {
  //       throw new InternalServerErrorException();
  //     }
  //   }
  // }

  // @BeforeInsert()
  // @BeforeUpdate()
  // async hashPasswordEmail(): Promise<void> {
  //   if (this.passwordEmail) {
  //     try {
  //       this.passwordEmail = await bcrypt.hash(this.passwordEmail, 10);
  //     } catch (error) {
  //       throw new InternalServerErrorException();
  //     }
  //   }
  // }

  // async checkEmailPassword(aPassword: string): Promise<boolean> {
  //   try {
  //     const ok = await bcrypt.compare(aPassword, this.passwordEmail);
  //     return ok;
  //   } catch (error) {
  //     throw new InternalServerErrorException();
  //   }
  // }

  // async checkCodePassword(code: string): Promise<boolean> {
  //   try {
  //     const ok = await bcrypt.compare(code, this.password);
  //     return ok;
  //   } catch (error) {
  //     throw new InternalServerErrorException();
  //   }
  // }
}
