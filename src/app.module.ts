import {
  Module,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './users/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/enities/user.entity';
import { Verification } from './users/enities/verification.entity';
import { Groups } from './users/enities/groups.entity';
import { JwtModule } from './jwt/jwt.module';
import { AuthModule } from './auth/auth.module';
// import { Contest } from './users/enities/contest.entity';
// import { EventEmitterModule } from '@nestjs/event-emitter';
// import { GraphQLModule } from '@nestjs/graphql';
// import { ConfigModule } from '@nestjs/config';
// import { MailModule } from './mail/mail.module';
// import { SmsModule } from './sms/sms.module';
// import { ScheduleModule } from '@nestjs/schedule';
// import { MailerModule } from '@nestjs-modules/mailer';
// import { ApolloDriver, ApolloDriverConfig  } from '@nestjs/apollo';
import { PaymentsModule } from './payments/payments.module';
import { Payment } from './payments/entities/payment.entity';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      database: 'postgres',
      username: 'postgres',
      password: '1q2w3e4r5t',
      entities: [User, Verification, Groups, Payment ],
      synchronize: true,
      autoLoadEntities: true,
      logging: true,
      // logging: process.env.NODE_ENV !== 'prod' &&  process.env.NODE_ENV !== 'test',
    }),
    JwtModule.forRoot({
      privateKey: 'key',
      // privateKey: process.env.PRIVATE_KEY,
    }),
    ScheduleModule.forRoot(),
    // MongooseModule.forRoot(`mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`),
    // GraphQLModule.forRoot<ApolloDriverConfig>({
    //   driver: ApolloDriver,
    //   autoSchemaFile: 'src/schema.gql',
    //   installSubscriptionHandlers: true,
    //   context: ({ req, connection }) => { /// !!! 130
    //     const TOKEN_KEY = 'x-jwt'
    //     return {
    //       token: req ? req.headers[TOKEN_KEY] : connection.context[TOKEN_KEY]
    //     }
    //   },
    //   // playground: false,
    //   // plugins: [ApolloServerPluginLandingPageLocalDefault()],
    // }),
    // EventEmitterModule.forRoot({
    //   wildcard: false,
    //   delimiter: '.',
    //   newListener: false,
    //   removeListener: false,
    //   maxListeners: 10,
    //   verboseMemoryLeak: false,
    //   ignoreErrors: false,
    // }),
    // ScheduleModule.forRoot(),
    // MailModule.forRoot({
    //   apiKey: process.env.MAIL_API_KEY,
    //   fromEmail: process.env.MAIL_FROM_EMAIL,
    //   domain: process.env.MAIL_DOMAIN_NAME,
    // }),
    // SmsModule.forRoot({
    //   apiKey: process.env.SMS_API_KEY,
    //   user_name: process.env.SMS_USER_NAME,
    //   url: process.env.SMS_API_URL,
    // }),
    AuthModule,
    UserModule,
    PaymentsModule,
    // TableModule
    // SmsModule,
    // ProductOrderModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule{}