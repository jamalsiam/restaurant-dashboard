import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { StorageService } from './data/storage.service.js';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        {
          provide: StorageService,
          useValue: {
            getCount: () => 50000,
          },
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root and health', () => {
    it('should return health status with datasetItemsCount', () => {
      const health = appController.getHealth();
      expect(health.status).toBe('ok');
      expect(health.datasetItemsCount).toBe(50000);
    });
  });
});
