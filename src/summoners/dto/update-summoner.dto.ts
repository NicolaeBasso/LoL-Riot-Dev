import { PartialType } from '@nestjs/mapped-types';
import { CreateSummonerDto } from './create-summoner.dto';

export class UpdateSummonerDto extends PartialType(CreateSummonerDto) {}
