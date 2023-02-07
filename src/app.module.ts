import type { RedisClientOptions } from 'redis';
import { redisStore } from 'cache-manager-redis-store';
import { CacheModule, CacheStore, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { DatabaseModule } from './database/database.module';
import { SummonersModule } from './summoners/summoners.module';
import { MatchesModule } from './matches/matches.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: (() => {
        const env = process.env.env;

        switch (env) {
          case 'PRODUCTION':
            return '.production.env';
          case 'STAGING':
            return '.staging.env';
        }

        return 'dev.env';
      })(),
      validationSchema: Joi.object({
        RIOT_API_KEY: Joi.string().required(),
        RIOT_LOL_API_URL: Joi.string().required(),
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
        PORT: Joi.number(),
        REDIS_URL: Joi.string().required(),
        CACHE_TTL: Joi.number().required(),
        RESOURCE_URL: Joi.string(),
      }),
    }),
    CacheModule.registerAsync<RedisClientOptions>({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        // ttl: configService.get<number>('CACHE_TTL'),
        ttl: 5,
        store: (await redisStore({
          url: configService.get('REDIS_URL'),
        })) as unknown as CacheStore,
      }),
      inject: [ConfigService],
    }),
    DatabaseModule,
    SummonersModule,
    MatchesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
