import { Controller, Get } from '@nestjs/common';
import { StatsService } from './stats.service.js';
import type { DashboardStats } from '../common/types.js';

@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get()
  getStats(): DashboardStats {
    return this.statsService.getStats();
  }
}
