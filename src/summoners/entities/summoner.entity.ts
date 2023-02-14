import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Summoner {
  @PrimaryColumn()
  id: string;

  @Column({ unique: true })
  accountId: string;

  @Column({ unique: true })
  puuid: string;

  @Column()
  name: string;

  @Column()
  profileIconId: number;

  @Column({ type: 'bigint' })
  revisionDate: number;

  @Column()
  summonerLevel: number;
}
