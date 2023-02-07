import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  CacheInterceptor,
  CacheTTL,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { SummonersService } from './summoners.service';
import { CreateSummonerDto } from './dto/create-summoner.dto';
import { UpdateSummonerDto } from './dto/update-summoner.dto';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { REGION } from 'src/utils/constants';
import { SummonerDto } from './dto/summoner.dto';

@Controller('summoners')
export class SummonersController {
  constructor(private readonly summonersService: SummonersService) {}

  @UseInterceptors(CacheInterceptor)
  @CacheTTL(5)
  @Get('account')
  async getSummonerAccount(@Query() query: SummonerDto) {
    return this.summonersService.getSummonerAccount(query);
  }

  @Get('profile')
  async getSummonerProfile(@Body() summonerDto) {
    return this.summonersService.getSummonerProfile(summonerDto);
  }

  @Post()
  create(@Body() createSummonerDto: CreateSummonerDto) {
    return this.summonersService.create(createSummonerDto);
  }

  // @Get()
  // findAll() {
  //   return this.summonersService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.summonersService.findOne(+id);
  // }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSummonerDto: UpdateSummonerDto,
  ) {
    return this.summonersService.update(+id, updateSummonerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.summonersService.remove(+id);
  }
}
