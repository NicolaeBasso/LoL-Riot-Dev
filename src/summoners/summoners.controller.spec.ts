import { Test, TestingModule } from '@nestjs/testing';
import { SummonersController } from './summoners.controller';
import { SummonersService } from './summoners.service';

describe('SummonersController', () => {
  let controller: SummonersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SummonersController],
      providers: [SummonersService],
    }).compile();

    controller = module.get<SummonersController>(SummonersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
