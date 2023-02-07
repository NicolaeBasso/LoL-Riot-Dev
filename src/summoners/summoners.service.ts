import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSummonerDto } from './dto/create-summoner.dto';
import { UpdateSummonerDto } from './dto/update-summoner.dto';
import { Summoner } from './entities/summoner.entity';

@Injectable()
export class SummonersService {
  constructor(
    @InjectRepository(Summoner)
    private summonerRepository: Repository<Summoner>,
  ) {}

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
