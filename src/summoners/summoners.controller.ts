import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Res,
  StreamableFile,
} from '@nestjs/common';

import type { Response } from 'express';
import { createReadStream } from 'fs';
import { join } from 'path';
import { RANK_EMBLEM } from 'src/utils/constants';
import { CreateSummonerDto } from './dto/create-summoner.dto';
import { MatchIdListDto } from './dto/matchIDList.dto';
import { SummonerDto } from './dto/summoner.dto';
import { UpdateSummonerDto } from './dto/update-summoner.dto';
import { SummonersService } from './summoners.service';

@Controller('summoners')
export class SummonersController {
  constructor(private readonly summonersService: SummonersService) {}

  // default in-memory automated caching, redis cache is being used instead
  // @UseInterceptors(CacheInterceptor)
  // @CacheTTL(30)
  @Get('account')
  async getSummonerAccount(@Query() query: SummonerDto) {
    return this.summonersService.getSummonerAccount(query);
  }

  @Get('profile')
  async getSummonerProfile(@Query() query: SummonerDto) {
    return this.summonersService.getSummonerProfile(query);
  }

  @Get('matchIDList')
  async getSummonerMatchIDList(@Query() query: MatchIdListDto) {
    return this.summonersService.getSummonerMatchIdList(query);
  }

  @Get('matches')
  async getSummonerMatches(@Query() query: MatchIdListDto) {
    return this.summonersService.getSummonerMatches(query);
  }

  @Get('leaderboard')
  async getMatchLeaderboard(@Query() query: MatchIdListDto) {
    return this.summonersService.getMatchLeaderboard(query);
  }

  @Get('rankImage')
  async getRankImage(
    @Query() query: SummonerDto & { queueType: string },
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    const { queueType } = query;
    const summonerProfile: any[] = await this.getSummonerProfile(query);
    const selectedQueue = summonerProfile?.find(
      (queue) => queue.queueType === queueType,
    );
    const tier = selectedQueue?.tier || 'IRON';
    const emblemFilename = RANK_EMBLEM[tier];

    const file = createReadStream(
      join(process.cwd(), `src/static/ranked-emblem/${emblemFilename}.png`),
    );
    res.set({
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename=${emblemFilename}.png`,
    });

    return new StreamableFile(file);
  }

  @Post()
  create(@Body() createSummonerDto: CreateSummonerDto) {
    return this.summonersService.create(createSummonerDto);
  }

  @Get()
  findAll() {
    return this.summonersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.summonersService.findOne(+id);
  }

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
