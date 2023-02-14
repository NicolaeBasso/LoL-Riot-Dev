import { HttpService } from '@nestjs/axios';
import {
  CACHE_MANAGER,
  HttpException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import {
  REGION,
  REGION_MAPPING,
  TIER_RANKING,
  RANK_RANKING,
  QUEUE_TYPE,
} from 'src/utils/constants';
import { Repository } from 'typeorm';
import { CreateSummonerDto } from './dto/create-summoner.dto';
import { MatchDto } from './dto/match.dto';
import { MatchIdListDto } from './dto/matchIDList.dto';
import { SummonerDto } from './dto/summoner.dto';
import { UpdateSummonerDto } from './dto/update-summoner.dto';
import { Summoner } from './entities/summoner.entity';
import { DateTime } from 'luxon';

@Injectable()
export class SummonersService {
  constructor(
    @InjectRepository(Summoner)
    private readonly summonerRepository: Repository<Summoner>,
    @Inject(CACHE_MANAGER)
    private readonly cacheService: Cache,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  riotApiBaseUrl = this.configService.get<string>('RIOT_LOL_API_URL');
  riotApiKey = this.configService.get<string>('RIOT_API_KEY');

  async getSummonerAccount(summonerDto: SummonerDto): Promise<Summoner> {
    const { name, region }: SummonerDto = summonerDto;

    const cachedData: Summoner = await this.cacheService.get(
      `${region}.${name}`,
    );
    if (cachedData) return cachedData;

    const url = `https://${region}.${this.riotApiBaseUrl}/summoner/v4/summoners/by-name/${name}`;
    const res = await this.httpService.axiosRef
      .get(url, {
        headers: { 'X-Riot-Token': this.riotApiKey },
      })
      .catch((reason) => {
        throw new HttpException(reason?.message, 404);
      });
    const summoner: Summoner = res?.data;

    if (summoner) {
      this.cacheService.set(`${region}.${name}`, summoner);
      return summoner;
    }

    throw new HttpException('Summoner not found', 404);
  }

  async getSummonerProfile(summonerDto: SummonerDto): Promise<any> {
    const { name, region }: SummonerDto = summonerDto;

    const summoner: Summoner = await this.getSummonerAccount(summonerDto);
    const { id: summonerId } = summoner;

    const url = `https://${region}.${this.riotApiBaseUrl}/league/v4/entries/by-summoner/${summonerId}`;
    const res = await this.httpService.axiosRef.get(url, {
      headers: { 'X-Riot-Token': this.riotApiKey },
    });

    return res?.data ?? 'Summoner not found';
  }

  async getSummonerMatchIdList(matchIdListDto: MatchIdListDto): Promise<any> {
    const {
      name,
      region,
      startTime,
      endTime,
      queue,
      type,
      start,
      count,
    }: MatchIdListDto = matchIdListDto;
    const regionCluster = REGION_MAPPING[region];

    const summoner: Summoner = await this.getSummonerAccount({ name, region });

    const { id: summonerId, puuid } = summoner;

    let queryParams = '';
    if (startTime) queryParams += `&startTime=${startTime}`;
    if (endTime) queryParams += `&endTime=${endTime}`;
    if (queue) queryParams += `&queue=${queue}`;
    if (type) queryParams += `&type=${type}`;
    if (start) queryParams += `&start=${start}`;
    if (count) queryParams += `&count=${count}`;

    const url = `https://${regionCluster}.${this.riotApiBaseUrl}/match/v5/matches/by-puuid/${puuid}/ids?${queryParams}`;

    const res = await this.httpService.axiosRef.get(url, {
      headers: { 'X-Riot-Token': this.riotApiKey },
    });
    const matchList = res?.data;

    return matchList ?? 'Match list not found';
  }

  async getSummonerMatches(matchIdListDto: MatchIdListDto): Promise<any> {
    const matchIds = await this.getSummonerMatchIdList(matchIdListDto);

    const { region }: MatchIdListDto = matchIdListDto;
    const regionCluster = REGION_MAPPING[region];

    const matches = await Promise.all(
      matchIds.map(async (matchId) => {
        const url = `https://${regionCluster}.${this.riotApiBaseUrl}/match/v5/matches/${matchId}`;
        return (
          await this.httpService.axiosRef.get(url, {
            headers: { 'X-Riot-Token': this.riotApiKey },
          })
        ).data;
      }),
    );

    return matches ?? 'Matches not found';
  }

  async getMatchLeaderboard(matchIdListDto: MatchIdListDto): Promise<any> {
    const game = (await this.getSummonerMatches(matchIdListDto))?.[0];
    const queueType = matchIdListDto?.queueType ?? QUEUE_TYPE.RANKED_SOLO_5x5;
    const { matchId } = game?.metadata;

    const {
      gameStartTimestamp: gameStartUNIX,
      gameEndTimestamp: gameEndUNIX,
      gameDuration,
      platformId,
      gameMode,
    } = game?.info;
    const gameStart = DateTime.fromMillis(gameStartUNIX).toISO();
    const gameEnd = DateTime.fromMillis(gameEndUNIX).toISO();
    const region = game?.info?.platformId.toLowerCase();

    const playerProfiles = await Promise.all(
      game?.info?.participants?.map((player) => {
        const name = player?.summonerName;
        return this.getSummonerProfile({ name, region });
      }),
    );

    const matchLeaderboard: Record<string, any> = playerProfiles
      .map((profile) => profile.find((queue) => queue.queueType === queueType))
      .filter((queue) => queue)
      .sort((a, b) => {
        if (TIER_RANKING[a.tier] > TIER_RANKING[b.tier]) return 1;

        if (TIER_RANKING[a.tier] < TIER_RANKING[b.tier]) return -1;

        if (TIER_RANKING[a.tier] === TIER_RANKING[b.tier]) {
          if (RANK_RANKING[a.rank] > RANK_RANKING[b.rank]) return 1;
          if (RANK_RANKING[a.rank] < RANK_RANKING[b.rank]) return -1;

          return a.leaguePoints - b.leaguePoints;
        }

        return 0;
      })
      .reverse();

    return (
      {
        matchId,
        gameMode,
        gameDuration: new Date(gameDuration * 1000).getMinutes(),
        gameStartTimestamp: gameStart,
        gameEndTimestamp: gameEnd,
        platformId,
        matchLeaderboard,
      } ?? 'Match not found'
    );
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
