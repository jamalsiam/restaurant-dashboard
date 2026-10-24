import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { DataModule } from './data/data.module.js';
import { ItemsModule } from './items/items.module.js';
import { StatsModule } from './stats/stats.module.js';

@Module({
  imports: [DataModule, ItemsModule, StatsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
