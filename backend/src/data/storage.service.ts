import { Injectable } from '@nestjs/common';

@Injectable()
export class StorageService {
  private items: any[] = [];
  getAll() { return this.items; }
}
