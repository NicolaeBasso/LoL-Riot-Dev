import { Module } from '@nestjs/common';
import { SummonersService } from './summoners.service';
import { SummonersController } from './summoners.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Summoner } from './entities/summoner.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([Summoner])],
  controllers: [SummonersController],
  providers: [SummonersService],
})
export class SummonersModule {}
