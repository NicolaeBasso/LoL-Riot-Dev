import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Summoner {
  @PrimaryColumn()
  id: string;

  @Column()
  accountId: string;

  @Column()
  puuid: string;

  @Column()
  name: string;

  @Column()
  profileIconId: number;

  @Column()
  revisionDate: number;

  @Column()
  summonerLevel: number;
}
