import { SummonerDto } from './summoner.dto';

export class MatchDto extends SummonerDto {
  limit: number;
  size: number;
}
