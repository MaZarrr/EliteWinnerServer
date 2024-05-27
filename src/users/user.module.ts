import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './enities/user.entity';
import { Verification } from './enities/verification.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { Groups } from './enities/groups.entity';
import { TableService } from 'src/tableService/table.service';
import { Contest } from './enities/contest.entity';
import { ServicesModule } from 'src/services/services.module';
import { Contests } from './enities/contests.entity';


@Module({
  imports: [TypeOrmModule.forFeature([User, Verification, Groups, Contest, Contests]), ServicesModule],
  providers: [UserService, TableService ],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}

