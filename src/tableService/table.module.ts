import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { Verification } from './enities/verification.entity';
// import { UserService } from './user.service';
// import { UserController } from './user.controller';
// import { Groups } from './enities/groups.entity';
import { TableService } from './table.service';


@Module({
  providers: [TableService],
  imports: [TableService]
})
export class TableModule {}