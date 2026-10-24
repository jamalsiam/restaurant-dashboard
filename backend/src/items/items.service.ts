import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { StorageService } from '../data/storage.service.js';
import { MenuItem, PaginatedResult } from '../common/types.js';
import { QueryItemsDto } from './dto/query-items.dto.js';
import { UpdateItemDto } from './dto/update-item.dto.js';

@Injectable()
export class ItemsService {
  constructor(private readonly storageService: StorageService) {}

  query(dto: QueryItemsDto): PaginatedResult<MenuItem> {
    const allItems = this.storageService.getAll();
    const page = Number(dto.page) || 1;
    const pageSize = Number(dto.pageSize) || 25;

    const searchTerm = dto.search ? dto.search.trim().toLowerCase() : null;
    const restaurantId = dto.restaurantId ? dto.restaurantId.trim() : null;
    const branchId = dto.branchId ? dto.branchId.trim() : null;
    const category = dto.category ? dto.category.trim().toLowerCase() : null;
    const availability = dto.availability;
    const minPrice = dto.minPrice !== undefined ? Number(dto.minPrice) : null;
    const maxPrice = dto.maxPrice !== undefined ? Number(dto.maxPrice) : null;

    if (minPrice !== null && maxPrice !== null && minPrice > maxPrice) {
      throw new BadRequestException('minPrice cannot be greater than maxPrice.');
    }

    // Filter
    let filtered: MenuItem[] = allItems;

    // Fast check: if any filter is active, filter in a single pass
    const hasFilters =
      searchTerm !== null ||
      restaurantId !== null ||
      branchId !== null ||
      category !== null ||
      (availability !== undefined && availability !== 'all') ||
      minPrice !== null ||
      maxPrice !== null;

    if (hasFilters) {
      filtered = allItems.filter((item) => {
        if (searchTerm && !item.name.toLowerCase().includes(searchTerm)) {
          return false;
        }
        if (restaurantId && item.restaurantId !== restaurantId) {
          return false;
        }
        if (branchId && item.branchId !== branchId) {
          return false;
        }
        if (category && item.category.toLowerCase() !== category) {
          return false;
        }
        if (availability === 'true' && !item.isAvailable) {
          return false;
        }
        if (availability === 'false' && item.isAvailable) {
          return false;
        }
        if (minPrice !== null && item.price < minPrice) {
          return false;
        }
        if (maxPrice !== null && item.price > maxPrice) {
          return false;
        }
        return true;
      });
    }

    // Sort
    const sortBy = dto.sortBy || 'updatedAt';
    const isAsc = (dto.sortOrder || 'DESC').toUpperCase() === 'ASC';

    const sorted = [...filtered].sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'price') {
        comparison = a.price - b.price;
      } else if (sortBy === 'name') {
        comparison = a.name < b.name ? -1 : (a.name > b.name ? 1 : 0);
      } else {
        // default: updatedAt (ISO-8601 strings compare lexicographically without allocating Date objects)
        comparison = a.updatedAt < b.updatedAt ? -1 : (a.updatedAt > b.updatedAt ? 1 : 0);
      }
      return isAsc ? comparison : -comparison;
    });

    const total = sorted.length;
    const totalPages = Math.ceil(total / pageSize) || 1;
    const startIndex = (page - 1) * pageSize;
    const data = sorted.slice(startIndex, startIndex + pageSize);

    return {
      data,
      total,
      page,
      pageSize,
      totalPages,
    };
  }

  getById(id: string): MenuItem {
    const item = this.storageService.findById(id);
    if (!item) {
      throw new NotFoundException(`Menu item with ID '${id}' not found`);
    }
    return item;
  }

  async update(id: string, dto: UpdateItemDto): Promise<MenuItem> {
    if (dto.price === undefined && dto.isAvailable === undefined) {
      throw new BadRequestException('At least one of price or isAvailable must be provided.');
    }

    const existing = this.storageService.findById(id);
    if (!existing) {
      throw new NotFoundException(`Menu item with ID '${id}' not found`);
    }

    const updated = await this.storageService.updateItem(id, {
      price: dto.price,
      isAvailable: dto.isAvailable,
    });

    if (!updated) {
      throw new NotFoundException(`Menu item with ID '${id}' not found`);
    }
    return updated;
  }
}
