import { SummonerDto } from './summoner.dto';

export class MatchIdListDto extends SummonerDto {
  startTime: number;
  endTime: number;
  queue: number;
  type: string;
  start: number;
  count: number;
  queueType?: string;
}
