import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SummonersService } from './summoners.service';
import { CreateSummonerDto } from './dto/create-summoner.dto';
import { UpdateSummonerDto } from './dto/update-summoner.dto';
import { ConfigService } from '@nestjs/config';

@Controller('summoners')
export class SummonersController {
  constructor(
    private readonly summonersService: SummonersService,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  async getSummonerData() {}

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
