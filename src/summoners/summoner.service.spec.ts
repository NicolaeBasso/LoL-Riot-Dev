import { Test, TestingModule } from '@nestjs/testing';
import { SummonersService } from './summoner.service';

describe('SummonersService', () => {
  let service: SummonersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SummonersService],
    }).compile();

    service = module.get<SummonersService>(SummonersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
