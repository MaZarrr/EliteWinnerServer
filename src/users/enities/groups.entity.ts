import {
    Field,
    InputType,
    ObjectType,
    // registerEnumType,
  } from '@nestjs/graphql';
  import { CoreEntity } from 'src/common/enities/core.entity';
  import { Column, Entity, ManyToOne } from 'typeorm';
  import { IsBoolean, IsEmail, IsEnum, IsNumber, IsPhoneNumber, IsString } from 'class-validator';
  // import { User } from './user.entity';
  
  // паранормальное явление
  @InputType('GroupsInputType', { isAbstract: true })
  @ObjectType()
  @Entity()
  export class Groups extends CoreEntity {
  
    @Column({ nullable: false } )
    @Field((type) => String)
    @IsString()
    group_id: string

    // @Column({ nullable: false } )
    // @Field((type) => String)
    // @IsString()
    // user_id: string

    @Column({ nullable: true } )
    @Field((type) => String)
    @IsString()
    access_token: string

    @Column({ nullable: false } )
    @Field((type) => Number)
    @IsNumber()
    user_id: number

    @Column({  nullable: false } )
    @Field((type) => String)
    @IsString()
    name: string

    @Column()
    @Field((type) => Boolean)
    @IsBoolean()
    has_photo: boolean

    @Column()
    @Field((type) => String)
    @IsString()
    photo_200: string
  
    // @ManyToOne(() => User, (user) => user.groups)
    // userId: User
  }