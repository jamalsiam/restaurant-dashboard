import { Injectable } from '@nestjs/common';

@Injectable()
export class ItemsService {
  getItems() { return { items: [], total: 0 }; }
}
