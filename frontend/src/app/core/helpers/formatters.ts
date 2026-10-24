import { MenuCategory } from '../models/menu.model';

export function formatCurrency(amount: number): string {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return '$0.00';
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function calculatePercentage(part: number, total: number): string {
  if (!total || total <= 0) return '0.0';
  return ((part / total) * 100).toFixed(1);
}

export function getCategoryGradient(cat: MenuCategory | string): string {
  switch (cat) {
    case 'Appetizers':
      return 'linear-gradient(90deg, #f59e0b, #fbbf24)';
    case 'Mains':
      return 'linear-gradient(90deg, #6366f1, #818cf8)';
    case 'Desserts':
      return 'linear-gradient(90deg, #ec4899, #f472b6)';
    case 'Beverages':
      return 'linear-gradient(90deg, #0ea5e9, #38bdf8)';
    case 'Sides':
      return 'linear-gradient(90deg, #10b981, #34d399)';
    default:
      return 'linear-gradient(90deg, #6366f1, #818cf8)';
  }
}
