import {
    Field,
    InputType,
    ObjectType,
  } from '@nestjs/graphql';
  import { CoreEntity } from 'src/common/enities/core.entity';
  import { Column, Entity } from 'typeorm';
  import { IsBoolean, IsNumber, IsString } from 'class-validator';


  // паранормальное явление
  @InputType('ContestsInputType', { isAbstract: true })
  @ObjectType()
  @Entity()
  export class Contests extends CoreEntity {

    @Column({ nullable: false } )
    @Field((type) => String)
    @IsString()
    contest_id: string

    @Column({ nullable: false } )
    @Field((type) => Number)
    @IsNumber()
    user_id: number

    @Column({ nullable: false } )
    @Field((type) => Number)
    @IsNumber()
    prizes_count: number

    @Column()
    @Field((type) => String)
    @IsString()
    prize_name: string
             
    @Column({ nullable: false } )
    @Field((type) => Number)
    @IsNumber()
    ownerId: number

    @Column()
    @Field((type) => Number)
    @IsNumber()
    group_id: number

    @Column()
    @Field((type) => String)
    @IsString()
    wall_id: string

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