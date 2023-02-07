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
  constructor(
    private readonly summonersService: SummonersService,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  @UseInterceptors(CacheInterceptor)
  @CacheTTL(30000)
  @Get('account')
  async getSummonerAccount(@Body() summonerDto) {
    return this.summonersService.getSummonerAccount(summonerDto);

    // const { name, region }: { name: string; region: REGION } = summonerDto;

    // const riotApiBaseUrl = this.configService.get<string>('RIOT_LOL_API_URL');
    // const riotApiKey = this.configService.get<string>('RIOT_API_KEY');
    // const url = `https://${region}.${riotApiBaseUrl}/summoner/v4/summoners/by-name/${name}`;

    // console.log({ riotApiBaseUrl, riotApiKey, url });

    // const res = await this.httpService.axiosRef.get(url, {
    //   headers: { 'X-Riot-Token': riotApiKey },
    // });

    // console.log('Summoner = ', res?.data);

    // return res?.data || 'Summoner not found';
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
