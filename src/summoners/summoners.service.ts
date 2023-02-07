import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import { REGION } from 'src/utils/constants';
import { Repository } from 'typeorm';
import { CreateSummonerDto } from './dto/create-summoner.dto';
import { SummonerDto } from './dto/summoner.dto';
import { UpdateSummonerDto } from './dto/update-summoner.dto';
import { Summoner } from './entities/summoner.entity';

@Injectable()
export class SummonersService {
  constructor(
    @InjectRepository(Summoner)
    private readonly summonerRepository: Repository<Summoner>,
    @Inject(CACHE_MANAGER)
    private cacheService: Cache,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  riotApiBaseUrl = this.configService.get<string>('RIOT_LOL_API_URL');
  riotApiKey = this.configService.get<string>('RIOT_API_KEY');

  async getSummonerAccount(summonerDto: SummonerDto) {
    const { name, region }: { name: string; region: REGION } = summonerDto;

    const riotApiBaseUrl = this.configService.get<string>('RIOT_LOL_API_URL');
    const riotApiKey = this.configService.get<string>('RIOT_API_KEY');
    const url = `https://${region}.${this.riotApiBaseUrl}/summoner/v4/summoners/by-name/${name}`;

    console.log({ riotApiBaseUrl, riotApiKey, url });

    const res = await this.httpService.axiosRef.get(url, {
      headers: { 'X-Riot-Token': this.riotApiKey },
    });
    const summoner = res?.data || null;
    const id = summoner?.id;

    console.log('Summoner = ', res?.data);

    await this.cacheService.set(id, summoner, 5);
    const cachedData = await this.cacheService.get(id);
    console.log('data set to cache', cachedData);

    return res?.data ?? 'Summoner not found';
  }

  async getSummonerProfile(summonerDto: SummonerDto) {
    const { name, region }: { name: string; region: REGION } = summonerDto;
    const summonerId = '123';

    // const summoner =

    // https://developer.riotgames.com/apis#league-v4/GET_getLeagueEntriesForSummoner
    // https://na1.api.riotgames.com/lol/league/v4/entries/by-summoner/LSFXu0iAleeSoiVJx8Ym6uJVWZ-uHSNUNuLnMoPtigxpwhc?api_key=RGAPI-491ebe2f-e67d-4ef7-a1d0-7c4bbadd47a4

    // const riotApiBaseUrl = this.configService.get<string>('RIOT_LOL_API_URL');
    // const riotApiKey = this.configService.get<string>('RIOT_API_KEY');
    const url = `https://${region}.${this.riotApiBaseUrl}/league/v4/entries/by-summoner/${summonerId}?api_key=${this.riotApiKey}`;

    // console.log({ riotApiBaseUrl, riotApiKey, url });

    const res = await this.httpService.axiosRef.get(url, {
      headers: { 'X-Riot-Token': this.riotApiKey },
    });

    console.log('Summoner = ', res?.data);

    return res?.data ?? 'Summoner not found';
  }

  create(createSummonerDto: CreateSummonerDto) {
    return 'This action adds a new summoner';
  }

  findAll() {
    return `This action returns all summoners`;
  }

  findOne(id: number) {
    return `This action returns a #${id} summoner`;
  }

  update(id: number, updateSummonerDto: UpdateSummonerDto) {
    return `This action updates a #${id} summoner`;
  }

  remove(id: number) {
    return `This action removes a #${id} summoner`;
  }
}
