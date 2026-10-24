export type MenuCategory = 'Appetizers' | 'Mains' | 'Desserts' | 'Beverages' | 'Sides';

export interface MenuItem {
  id: string;
  name: string;
  restaurantId: string;
  restaurantName: string;
  branchId: string;
  branchName: string;
  category: MenuCategory;
  price: number;
  isAvailable: boolean;
  updatedAt: string;
}

export interface BranchMeta {
  id: string;
  name: string;
  restaurantId: string;
}

export interface RestaurantMeta {
  id: string;
  name: string;
  branches: BranchMeta[];
}

export interface DashboardStats {
  totalItems: number;
  availableItems: number;
  unavailableItems: number;
  averagePrice: number;
  categoryDistribution: Record<MenuCategory, number>;
  restaurants: RestaurantMeta[];
  lastCalculatedAt: string;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface QueryFilters {
  page: number;
  pageSize: number;
  search: string;
  restaurantId: string;
  branchId: string;
  category: string;
  availability: 'all' | 'true' | 'false';
  minPrice: number | null;
  maxPrice: number | null;
  sortBy: 'name' | 'price' | 'updatedAt';
  sortOrder: 'ASC' | 'DESC';
}

export interface UpdateItemPayload {
  price?: number;
  isAvailable?: boolean;
}
