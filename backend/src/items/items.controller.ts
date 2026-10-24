import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ItemsService } from './items.service.js';
import { QueryItemsDto } from './dto/query-items.dto.js';
import { UpdateItemDto } from './dto/update-item.dto.js';
import type { MenuItem, PaginatedResult } from '../common/types.js';

@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Get()
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  getItems(@Query() query: QueryItemsDto): PaginatedResult<MenuItem> {
    return this.itemsService.query(query);
  }

  @Get(':id')
  getItemById(@Param('id') id: string): MenuItem {
    return this.itemsService.getById(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true }))
  async updateItem(
    @Param('id') id: string,
    @Body() dto: UpdateItemDto,
  ): Promise<MenuItem> {
    return this.itemsService.update(id, dto);
  }
}
