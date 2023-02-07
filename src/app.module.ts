import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// import { MiddlewareConsumer, Module } from '@nestjs/common';
// import { PostsModule } from './posts/posts.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
// import * as Joi from '@hapi/joi';
import * as Joi from 'joi';
import { DatabaseModule } from './database/database.module';
// import { AuthenticationModule } from './authentication/authentication.module';
// import { UsersModule } from './users/users.module';
// import { CategoriesModule } from './categories/categories.module';
// import { SearchModule } from './search/search.module';
// import { SubscribersModule } from './subscribers/subscribers.module';
// import { CommentsModule } from './comments/comments.module';
// import { ProductCategoriesModule } from './productCategories/productCategories.module';
// import { ProductsModule } from './products/products.module';
// import { ScheduleModule } from '@nestjs/schedule';
// import { EmailSchedulingModule } from './emailScheduling/emailScheduling.module';
// import { ChatModule } from './chat/chat.module';
// import { GraphQLModule } from '@nestjs/graphql';
// import { join } from 'path';
// import { PubSubModule } from './pubSub/pubSub.module';
// import { Timestamp } from './utils/scalars/timestamp.scalar';
// import { OptimizeModule } from './optimize/optimize.module';
// import { BullModule } from '@nestjs/bull';
// import { ChargeModule } from './charge/charge.module';
// import { CreditCardsModule } from './credit-cards/creditCards.module';
// import { SubscriptionsModule } from './subscriptions/subscriptions.module';
// import { StripeWebhookModule } from './stripeWebhook/stripeWebhook.module';
// import { EmailConfirmationModule } from './emailConfirmation/emailConfirmation.module';
// import { SmsModule } from './sms/sms.module';
// import { GoogleAuthenticationModule } from './googleAuthentication/googleAuthentication.module';
// import LogsMiddleware from './utils/logs.middleware';
// import { LoggerModule } from './logger/logger.module';
// import HealthModule from './health/health.module';
// import { DatabaseFilesModule } from './databaseFiles/databaseFiles.module';
// import { LocalFilesModule } from './localFiles/localFiles.module';
// import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { SummonersModule } from './summoners/summoners.module';
import { MatchesModule } from './matches/matches.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath:
        process.env.env === 'PRODUCTION' ? '.production.env' : 'dev.env',
      validationSchema: Joi.object({
        RIOT_DEV_API_KEY: Joi.string().required(),
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
        PORT: Joi.number(),
        REDIS_HOST: Joi.string().required(),
        REDIS_PORT: Joi.number().required(),
        RESOURCE_URL: Joi.string(),
      }),
    }),
    DatabaseModule,
    SummonersModule,
    MatchesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
