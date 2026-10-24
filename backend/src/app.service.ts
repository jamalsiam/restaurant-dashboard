import { Injectable } from '@nestjs/common';
import { StorageService } from './data/storage.service.js';

@Injectable()
export class AppService {
  constructor(private readonly storageService: StorageService) {}

  getHealth() {
    return {
      status: 'ok',
      service: 'restaurant-dashboard-backend',
      timestamp: new Date().toISOString(),
      datasetItemsCount: this.storageService.getCount(),
    };
  }
}
