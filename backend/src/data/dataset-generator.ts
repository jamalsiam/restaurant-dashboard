import { MenuItem, MenuCategory, RestaurantMeta } from '../common/types.js';

export const RESTAURANTS_DATA: RestaurantMeta[] = [
  {
    id: 'REST-01',
    name: 'Saffron & Spice',
    branches: [
      { id: 'BR-01-1', name: 'Downtown Financial', restaurantId: 'REST-01' },
      { id: 'BR-01-2', name: 'Marina Waterfront', restaurantId: 'REST-01' },
      { id: 'BR-01-3', name: 'Uptown Galleria', restaurantId: 'REST-01' },
    ],
  },
  {
    id: 'REST-02',
    name: 'Bella Italia Trattoria',
    branches: [
      { id: 'BR-02-1', name: 'Little Italy Square', restaurantId: 'REST-02' },
      { id: 'BR-02-2', name: 'Riverside Walk', restaurantId: 'REST-02' },
      { id: 'BR-02-3', name: 'West End Plaza', restaurantId: 'REST-02' },
    ],
  },
  {
    id: 'REST-03',
    name: 'Tokyo Blossom Sushi',
    branches: [
      { id: 'BR-03-1', name: 'Midtown Tower', restaurantId: 'REST-03' },
      { id: 'BR-03-2', name: 'Harbor Point', restaurantId: 'REST-03' },
      { id: 'BR-03-3', name: 'Old Town Lane', restaurantId: 'REST-03' },
    ],
  },
  {
    id: 'REST-04',
    name: 'The Rustic Grillhouse',
    branches: [
      { id: 'BR-04-1', name: 'Highland Park', restaurantId: 'REST-04' },
      { id: 'BR-04-2', name: 'Grand Avenue Mall', restaurantId: 'REST-04' },
      { id: 'BR-04-3', name: 'Airport Express', restaurantId: 'REST-04' },
    ],
  },
  {
    id: 'REST-05',
    name: 'Green Earth Plant Kitchen',
    branches: [
      { id: 'BR-05-1', name: 'Arts District', restaurantId: 'REST-05' },
      { id: 'BR-05-2', name: 'Botanical Gardens', restaurantId: 'REST-05' },
      { id: 'BR-05-3', name: 'Sunset Boulevard', restaurantId: 'REST-05' },
    ],
  },
  {
    id: 'REST-06',
    name: 'Le Petit Bouchon',
    branches: [
      { id: 'BR-06-1', name: 'Historic Quarter', restaurantId: 'REST-06' },
      { id: 'BR-06-2', name: 'Central Station', restaurantId: 'REST-06' },
      { id: 'BR-06-3', name: 'Northgate Promenade', restaurantId: 'REST-06' },
    ],
  },
  {
    id: 'REST-07',
    name: 'Cantina Del Sol',
    branches: [
      { id: 'BR-07-1', name: 'Mission District', restaurantId: 'REST-07' },
      { id: 'BR-07-2', name: 'South Bay Marina', restaurantId: 'REST-07' },
      { id: 'BR-07-3', name: 'City Center Hub', restaurantId: 'REST-07' },
    ],
  },
  {
    id: 'REST-08',
    name: 'Golden Dragon Pavilion',
    branches: [
      { id: 'BR-08-1', name: 'Chinatown Central', restaurantId: 'REST-08' },
      { id: 'BR-08-2', name: 'Metro Gateway', restaurantId: 'REST-08' },
      { id: 'BR-08-3', name: 'Eastside Hills', restaurantId: 'REST-08' },
    ],
  },
  {
    id: 'REST-09',
    name: 'Bosphorus Meze & Kebab',
    branches: [
      { id: 'BR-09-1', name: 'Bazaar Wharf', restaurantId: 'REST-09' },
      { id: 'BR-09-2', name: 'Diplomatic Enclave', restaurantId: 'REST-09' },
      { id: 'BR-09-3', name: 'Silver Lakes', restaurantId: 'REST-09' },
    ],
  },
  {
    id: 'REST-10',
    name: 'Pacific Catch & Raw Bar',
    branches: [
      { id: 'BR-10-1', name: 'Pier 39 Deck', restaurantId: 'REST-10' },
      { id: 'BR-10-2', name: 'Coastal Highway', restaurantId: 'REST-10' },
      { id: 'BR-10-3', name: 'Oceanview Terrace', restaurantId: 'REST-10' },
    ],
  },
];

const CATEGORIES: MenuCategory[] = ['Appetizers', 'Mains', 'Desserts', 'Beverages', 'Sides'];

const ADJECTIVES = [
  'Crispy', 'Truffle', 'Smoked', 'Artisanal', 'Spicy', 'Glazed', 'Charred', 'Herbed',
  'Caramelized', 'Slow-Roasted', 'Pan-Seared', 'Wood-Fired', 'Creamy', 'Zesty', 'Organic',
  'Golden', 'Savory', 'Sweet Chili', 'Garlic-Infused', 'Balsamic-Drizzled', 'Velvety', 'Braised'
];

const INGREDIENTS_BY_CAT: Record<MenuCategory, string[]> = {
  Appetizers: [
    'Bruschetta', 'Calamari', 'Spring Rolls', 'Tartare', 'Arancini', 'Dumplings',
    'Carpaccio', 'Chicken Wings', 'Meze Platter', 'Nachos Supreme', 'Soup of the Day'
  ],
  Mains: [
    'Ribeye Steak', 'Wagyu Burger', 'Atlantic Salmon', 'Truffle Risotto', 'Seafood Paella',
    'Fettuccine Alfredo', 'Roasted Duck Breast', 'Lamb Shank', 'Chicken Tikka', 'BBQ Ribs',
    'Lobster Ravioli', 'Eggplant Parmigiana', 'Pan-Fried Sea Bass', 'Filet Mignon'
  ],
  Desserts: [
    'Tiramisu', 'Chocolate Fondant', 'New York Cheesecake', 'Creme Brulee', 'Apple Crumble',
    'Panna Cotta', 'Churros Con Chocolate', 'Lava Cake', 'Gelato Trio', 'Key Lime Pie'
  ],
  Beverages: [
    'Iced Matcha Latte', 'Cold Brew Coffee', 'Sparkling Yuzu Soda', 'Mango Passion Cooler',
    'Classic Mojito Mocktail', 'Earl Grey Blend', 'Fresh Mint Lemonade', 'Artisan Kombucha'
  ],
  Sides: [
    'Truffle Fries', 'Grilled Asparagus', 'Garlic Mashed Potatoes', 'Sweet Potato Wedges',
    'Caesar Salad', 'Steamed Broccolini', 'Onion Rings', 'Basmati Rice', 'Roasted Vegetables'
  ]
};

// Deterministic Pseudo-Random Number Generator (Mulberry32)
class SeededRandom {
  private state: number;

  constructor(seed: number = 133742) {
    this.state = seed >>> 0;
  }

  next(): number {
    this.state = (this.state + 0x6d2b79f5) | 0;
    let t = Math.imul(this.state ^ (this.state >>> 15), 1 | this.state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  pick<T>(arr: T[]): T {
    return arr[Math.floor(this.next() * arr.length)];
  }
}

export function generateMenuItems(count = 50000, seed = 133742): MenuItem[] {
  const rng = new SeededRandom(seed);
  const items: MenuItem[] = Array.from<MenuItem>({ length: count });

  // Flatten all branches with their restaurants
  const allBranches: { restaurant: RestaurantMeta; branch: { id: string; name: string } }[] = [];
  for (const r of RESTAURANTS_DATA) {
    for (const b of r.branches) {
      allBranches.push({ restaurant: r, branch: b });
    }
  }

  const baseTime = 1735689600000; // Jan 1, 2025

  for (let i = 0; i < count; i++) {
    const id = `ITEM-${(i + 1).toString().padStart(6, '0')}`;
    const branchInfo = allBranches[i % allBranches.length];

    // Realistic weighted distribution for restaurant categories:
    // Mains: ~35%, Appetizers: ~22%, Beverages: ~18%, Desserts: ~14%, Sides: ~11%
    const roll = rng.next();
    let category: MenuCategory;
    if (roll < 0.35) {
      category = 'Mains';
    } else if (roll < 0.57) {
      category = 'Appetizers';
    } else if (roll < 0.75) {
      category = 'Beverages';
    } else if (roll < 0.89) {
      category = 'Desserts';
    } else {
      category = 'Sides';
    }

    const adj = rng.pick(ADJECTIVES);
    const dish = rng.pick(INGREDIENTS_BY_CAT[category]);
    const name = `${adj} ${dish}`;

    // Price range tailored by category
    let minP = 4.5;
    let maxP = 28.0;
    if (category === 'Mains') {
      minP = 18.0;
      maxP = 85.0;
    } else if (category === 'Beverages') {
      minP = 3.5;
      maxP = 14.0;
    } else if (category === 'Sides') {
      minP = 5.0;
      maxP = 16.0;
    } else if (category === 'Desserts') {
      minP = 7.0;
      maxP = 22.0;
    }

    const price = Math.round((minP + rng.next() * (maxP - minP)) * 100) / 100;
    // ~85% available, ~15% out of stock
    const isAvailable = rng.next() > 0.15;

    // Distribute timestamps over past 60 days
    const timeOffsetMs = rng.nextInt(0, 60 * 24 * 3600 * 1000);
    const updatedAt = new Date(baseTime + timeOffsetMs).toISOString();

    items[i] = {
      id,
      name,
      restaurantId: branchInfo.restaurant.id,
      restaurantName: branchInfo.restaurant.name,
      branchId: branchInfo.branch.id,
      branchName: branchInfo.branch.name,
      category,
      price,
      isAvailable,
      updatedAt,
    };
  }

  return items;
}
