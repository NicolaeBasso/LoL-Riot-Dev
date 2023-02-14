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
import { SummonerService } from './summoner.service';

@Controller('summoner')
export class SummonerController {
  constructor(private readonly summonerService: SummonerService) {}

  // default in-memory automated caching, redis cache is being used instead
  // @UseInterceptors(CacheInterceptor)
  // @CacheTTL(30)
  @Get('account')
  async getSummonerAccount(@Query() query: SummonerDto) {
    return this.summonerService.getSummonerAccount(query);
  }

  @Get('profile')
  async getSummonerProfile(@Query() query: SummonerDto) {
    return this.summonerService.getSummonerProfile(query);
  }

  @Get('matchIDList')
  async getSummonerMatchIDList(@Query() query: MatchIdListDto) {
    return this.summonerService.getSummonerMatchIdList(query);
  }

  @Get('matches')
  async getSummonerMatches(@Query() query: MatchIdListDto) {
    return this.summonerService.getSummonerMatches(query);
  }

  @Get('leaderboard')
  async getMatchLeaderboard(@Query() query: MatchIdListDto) {
    return this.summonerService.getMatchLeaderboard(query);
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
    return this.summonerService.create(createSummonerDto);
  }

  @Get('db/account/all')
  findAll() {
    return this.summonerService.findAll();
  }

  @Get('db/account')
  findOne(@Query() query: SummonerDto) {
    return this.summonerService.findOneByNameInDB(query);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSummonerDto: UpdateSummonerDto,
  ) {
    return this.summonerService.update(+id, updateSummonerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.summonerService.remove(+id);
  }

  @Delete('db/account/all')
  removeAll() {
    return this.summonerService.removeAll();
  }
}
