import {
    Field,
    InputType,
    ObjectType,
    registerEnumType,
  } from '@nestjs/graphql';
  import { CoreEntity } from 'src/common/enities/core.entity';
  import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
  import { IsBoolean, IsEmail, IsEnum, IsNumber, IsPhoneNumber, IsString } from 'class-validator';
  import { User } from './user.entity';
  // паранормальное явление
  @InputType('ContestInputType', { isAbstract: true })
  @ObjectType()
  @Entity()
  export class Contest {
    
    @PrimaryGeneratedColumn()
    @Field((type) => Number)
    id: number;

    @Column({ nullable: false } )
    @Field((type) => Number)
    @IsNumber()
    userkey: number

    @Column({ nullable: false, unique: true } )
    @Field((type) => String)
    @IsString()
    contest_id: string

    @Column({ nullable: false } )
    @Field((type) => Number)
    @IsNumber()
    user_id: number

    @Column()
    @Field((type) => Number)
    @IsNumber()
    group_id: number

    @Column({ nullable: false } )
    @Field((type) => String)
    @IsString()
    type: string

    @Column({ nullable: false } )
    @Field((type) => String)
    @IsString()
    first_name: string

    @Column({ nullable: false } )
    @Field((type) => String)
    @IsString()
    last_name: string

    @Column()
    @Field((type) => Number)
    @IsNumber()
    prizes_count: number

    @Column({ nullable: false } )
    @Field((type) => String)
    @IsString()
    wall_id: string

    @Column({ nullable: false } )
    @Field((type) => String)
    @IsString()
    contest_type: string

    @Column({ nullable: false } )
    @Field((type) => String)
    @IsString()
    user_photo: string

    @Column({ nullable: false } )
    @Field((type) => Boolean)
    @IsString()
    loadingWinner: string
    
    @Column()
    @Field((type) => Boolean)
    @IsBoolean()
    can_access_closed: boolean

    @Column()
    @Field((type) => Boolean)
    @IsBoolean()
    is_closed: boolean

  }