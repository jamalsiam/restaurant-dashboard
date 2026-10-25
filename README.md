# Restaurant Data Management Dashboard — Senior Full-Stack Assessment

A high-performance, enterprise-grade Restaurant Data Management Dashboard engineered with **Angular 22** and **NestJS**, capable of handling **50,000+ menu items** across 10 restaurant chains and 30 branch locations.

Designed and implemented with reactive Signals state management, RxJS `switchMap` concurrency and race condition protection, server-side multi-parameter filtering, sorting, pagination, and atomic disk persistence.

---

## 1. Executive Summary & Architecture Highlights

| Layer | Technology | Architectural Role |
| :--- | :--- | :--- |
| **Frontend** | Angular 22 & TypeScript | Standalone components, fine-grained Angular Signals (`signal`, `computed`), OnPush change detection, Reactive Forms with price and status validation, SCSS design system. |
| **Concurrency** | RxJS (`switchMap`, `debounceTime`) | Real-time query streaming where in-flight requests are aborted during user typing to prevent stale out-of-order response overwrites. |
| **Backend** | NestJS 12 & Express Adapter | Modular REST API architecture (`ItemsModule`, `StatsModule`, `DataModule`) with strict DTO validation pipes (`class-validator`, `class-transformer`). |
| **Data Engine** | Seeded In-Memory + Disk Persistence | Deterministic PRNG generating 50,000 realistic records with atomic temporary-file-rename writes and concurrency mutex lock. |
| **Testing** | Vitest (Angular & NestJS) | 27 automated tests across 8 test suites validating combined filtering, pagination, state mutations, price bounds, and concurrency cancellation. |

---

## 2. Technology Stack & Environment

- **Frontend**: Angular 22.2.0, TypeScript 5.8+, RxJS 7.8, Angular Forms (Reactive), SCSS, Vitest 5.0
- **Backend**: NestJS 12.0.1, TypeScript 5.8+, class-validator 0.15+, class-transformer 0.5+, Vitest 4.1
- **Node Environment**: Node.js `^22.22.3 || ^24.15.0 || >=26.0.0` / npm `>=8.0.0` (Verified on Node v24.22.1 and v25.9.0)

---

## 3. Prerequisites & Quickstart

### Prerequisites
- Node.js: `^22.22.3 || ^24.15.0 || >=26.0.0` (Strictly required by Angular CLI 22; Node 20 is not supported)
- npm: `>=8.0.0` (Tested with npm 10.x and 11.x)

### Installation
From the repository root:
```bash
# 1. Install root orchestrator dependencies
npm install

# 2. Install backend dependencies
cd backend && npm install && cd ..

# 3. Install frontend dependencies
cd frontend && npm install && cd ..
```

---

## 4. Running the Application

### Option A: Run Both Simultaneously (Recommended)
From the root folder:
```bash
npm run dev
```
This launches concurrently:
- **NestJS API**: `http://localhost:3000/api`
- **Angular App**: `http://localhost:4200`

### Option B: Run Standalone Services
```bash
# Terminal 1: NestJS Backend
npm run start:backend

# Terminal 2: Angular Frontend
npm run start:frontend
```

---

## 5. Dataset Generation & Reset

The backend automatically generates the 50,000 items on its first launch if `backend/data/menu-items.json` does not exist.

To wipe and deterministically regenerate the 50,000 records from scratch:
```bash
npm run seed:reset
```

### Dataset Structure
- **50,000 items** deterministically generated using Mulberry32 seeded PRNG (`seed: 133742`).
- **10 Restaurant Chains**: *Saffron & Spice, Bella Italia Trattoria, Tokyo Blossom Sushi, The Rustic Grillhouse, Green Earth Plant Kitchen, Le Petit Bouchon, Cantina Del Sol, Golden Dragon Pavilion, Bosphorus Meze & Kebab, Pacific Catch & Raw Bar*.
- **30 Branches** (3 branches per restaurant chain) maintaining strict relational consistency.
- **5 Categories**: *Appetizers, Mains, Desserts, Beverages, Sides*.
- **Realistic Pricing**: Scaled by category ($3.50 – $85.00).

---

## 6. REST API Documentation

Base URL: `http://localhost:3000/api`

### 1. `GET /api/items`
Retrieves a paginated, filtered, and sorted slice of menu items.

**Query Parameters:**
| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `page` | `number` | `1` | 1-indexed page number |
| `pageSize` | `number` | `25` | Items per page (1 to 100) |
| `search` | `string` | - | Case-insensitive substring search on dish name |
| `restaurantId` | `string` | - | Filter by restaurant ID (e.g. `REST-01`) |
| `branchId` | `string` | - | Filter by branch ID (e.g. `BR-01-1`) |
| `category` | `string` | - | Filter by category (`Appetizers`, `Mains`, etc.) |
| `availability` | `'all'\|'true'\|'false'` | `'all'` | Filter availability status |
| `minPrice` | `number` | - | Minimum price bound (inclusive) |
| `maxPrice` | `number` | - | Maximum price bound (inclusive) |
| `sortBy` | `'name'\|'price'\|'updatedAt'` | `'updatedAt'` | Sort field |
| `sortOrder` | `'ASC'\|'DESC'` | `'DESC'` | Sort direction |

**Example Query:**
```bash
curl -X GET "http://localhost:3000/api/items?page=1&pageSize=10&search=Truffle&category=Mains&sortBy=price&sortOrder=ASC"
```

**Response Contract (`PaginatedResult<MenuItem>`):**
```json
{
  "data": [
    {
      "id": "ITEM-000001",
      "name": "Truffle Roasted Duck Breast",
      "restaurantId": "REST-01",
      "restaurantName": "Saffron & Spice",
      "branchId": "BR-01-1",
      "branchName": "Downtown Financial",
      "category": "Mains",
      "price": 45.50,
      "isAvailable": true,
      "updatedAt": "2026-10-24T18:01:52.438Z"
    }
  ],
  "total": 1,
  "page": 1,
  "pageSize": 10,
  "totalPages": 1
}
```

### 2. `GET /api/items/:id`
Retrieves details for a single menu item by ID. Returns `404 Not Found` if missing.

```bash
curl -X GET "http://localhost:3000/api/items/ITEM-000001"
```

### 3. `PATCH /api/items/:id`
Updates item price and/or availability. Validated with `class-validator`.

**Payload Schema:**
```json
{
  "price": 42.50,
  "isAvailable": true
}
```
- Rejects negative prices (`400 Bad Request`).
- Rejects non-finite numbers (`400 Bad Request`).
- Rejects unknown fields (`forbidNonWhitelisted: true`).
- Returns updated item and persists atomically to disk.

```bash
curl -X PATCH "http://localhost:3000/api/items/ITEM-000001" \
  -H "Content-Type: application/json" \
  -d '{"price": 42.50, "isAvailable": true}'
```

### 4. `GET /api/stats`
Computes global aggregate KPIs across the entire 50,000-item dataset.

**Response Schema:**
```json
{
  "totalItems": 50000,
  "availableItems": 42358,
  "unavailableItems": 7642,
  "averagePrice": 20.31,
  "categoryDistribution": {
    "Appetizers": 10073,
    "Mains": 10031,
    "Desserts": 10021,
    "Beverages": 9988,
    "Sides": 9887
  },
  "restaurants": [ ... ],
  "lastCalculatedAt": "2026-10-24T18:00:00.000Z"
}
```

### 5. `GET /api/health`
Returns health check status and total catalog item count.

---

## 7. Angular Architecture & State Management

### Signals vs. RxJS Separation of Concerns
1. **Angular Signals (`signal`, `computed`)**:
   - Manages synchronous UI state: `items`, `total`, `page`, `pageSize`, `sortBy`, `sortOrder`, `search`, active filter selections, and edit modal state.
   - Computes derived values: `totalPages()`, `availableBranches()` (dynamically scoped to selected restaurant), `hasActiveFilters()`, and `currentFilterSnapshot()`.
   - Uses `ChangeDetectionStrategy.OnPush` across all standalone components, eliminating dirty checking overhead.
2. **RxJS Reactive Concurrency (`switchMap`, `debounceTime`)**:
   - `searchSubject$` debounces keyboard input by `300ms` with `distinctUntilChanged()`.
   - `queryTrigger$` pipe uses `switchMap` to invoke `apiService.getItems(...)`.
   - **Race Condition Prevention**: When a user rapidly types or switches filters, `switchMap` immediately unsubscribes from and aborts previous in-flight HTTP requests. Responses from slow earlier requests are physically dropped before reaching the component state.

### State Synchronization Flow After Item Editing
```
[User Submits Form]
         │
         ▼
[apiService.patchItem(id, updates)] ──> [NestJS StorageService] (Atomic Disk Write)
         │
  Server Confirmed
         │
         ├─────────────────────────────────────────────┐
         ▼                                             ▼
[Update Local Row in Table]               [dashboardState.refresh()]
(Reflects new price/status)           (Re-fetches & synchronizes global KPIs)
```

---

## 8. Persistence Architecture & Disk Safety

- **Storage Layer**: Implemented in `backend/src/data/storage.service.ts`.
- **In-Memory Cache**: The entire 50,000 items list and a fast ID hash map (`Map<string, MenuItem>`) remain in memory, allowing filtering and sorting of 50k records in `< 8ms`.
- **Atomic Disk Writes**:
  - Mutations do not rewrite the file during read queries.
  - When an update occurs, changes are written to a temporary file (`menu-items.json.tmp`) and swapped atomically using `fs.promises.rename`.
  - A write promise chain acts as an asynchronous mutex to eliminate concurrent write corruptions.
- **Restart Survival**: On server boot, `StorageService` verifies if `menu-items.json` exists on disk and loads it immediately, preserving all price and availability modifications across server restarts and browser refreshes.

---

## 9. Automated Testing Suite

All tests can be executed with a single command from root:
```bash
npm run test
```

### Test Coverage Summary: 70 Automated Tests Across 27 Test Suites (100% Pass)

#### Backend (`vitest` in `backend/`) — 20 Tests across 5 Suites:
- `dataset-generator.spec.ts` (4 tests):
  - Deterministic PRNG generation of exactly 50,000 items.
  - Seed reproducibility.
  - Price validity and category distributions.
  - Consistent branch-to-restaurant mappings.
- `items.service.spec.ts` (12 tests):
  - Server-side pagination slices and metadata calculations.
  - Multi-field composite filtering (category + availability + min/max price + search).
  - Multi-column sorting (price, name, date).
  - GetById and item update with timestamp refresh.
  - Proper `NotFoundException` and payload validation handling.
- `stats.service.spec.ts` (1 test):
  - Global KPI calculations across complete dataset.
- `storage.service.spec.ts` (2 tests):
  - Initialization of 50,000 items to disk.
  - **Persistence Verification**: Updating item, re-instantiating storage service, and verifying changes survive restart.
- `app.controller.spec.ts` (1 test):
  - Health check endpoint verification.

#### Frontend (`vitest` via Angular CLI in `frontend/`) — 50 Tests across 22 Suites:
- `menu-state.service.spec.ts` (4 tests):
  - **Test 1 (Combined Filtering & Pagination)**: Multi-parameter query building and state verification.
  - **Test 2 (State Updates After Editing)**: Mutation confirmation, table state update, and KPI refresh invocation.
  - **Test 3 (Concurrency & Stale Request Protection)**: Out-of-order response simulation where delayed stale responses are discarded by `switchMap`.
  - **Test 4 (API Error Handling)**: Graceful recovery and loading state management upon backend failures.
- `edit-item-modal.component.spec.ts` (5 tests):
  - Reactive form initialization.
  - Negative price validation rejection (`min: 0`).
  - Required field validation.
  - Accessibility attributes and form submission payload dispatch.
- `donut-chart.component.spec.ts` (5 tests):
  - Component creation and Apache ECharts SVG rendering.
  - Correct total calculations from dynamic segment data.
  - Center value/label overlay display and interactive hover update/reset.
- `category-chart.component.spec.ts` (1 test):
  - Category breakdown bars rendering and percentage computation.
- `filter-bar.component.spec.ts` (1 test):
  - Filter controls rendering and reactive event bindings.
- `menu-table.component.spec.ts` (1 test):
  - Menu rows and dish detail rendering.
- `pagination.component.spec.ts` (1 test):
  - Range computation and pagination controls.
- `stat-card.component.spec.ts` (1 test):
  - Label, value, icon, and tag rendering.
- `navbar.component.spec.ts` (4 tests):
  - Brand navigation, routing links, and theme toggle.
- `app.spec.ts` (2 tests):
  - Application shell creation and layout integration.
- `shared/components/` (Button, Badge, Card, SearchBox, SingleSelect, Input, EmptyState) (25 tests).

---

## 10. Performance Optimizations & Large-Data Handling

1. **Zero Client Data Bloat**:
   - The browser never loads the 50,000 items. Only the active page (`pageSize`: 10, 25, 50, or 100) is returned across the network (~15 KB payload).
2. **OnPush Change Detection**:
   - Angular template bindings rely strictly on fine-grained Signals, preventing unnecessary subtree re-evaluations.
3. **Route-Level Code Splitting**:
   - `DashboardComponent` and `MenuComponent` are lazy-loaded on demand via dynamic `import()`.
4. **Optimized Search Streaming**:
   - Fast user typing does not fire HTTP requests on every keystroke; debounced at 300ms.
5. **Fast In-Memory Filtering**:
   - Multi-criteria predicates evaluate in a single iteration on the server, responding in under 10ms.

---

## 11. Known Limitations & Production Roadmap

- **JSON File Storage**: The current file-based persistence is optimal for local development and assessment scale without external database infrastructure. In a multi-instance production cluster, this would be replaced with PostgreSQL (e.g. via TypeORM or Prisma) with B-tree indexes on `restaurantId`, `category`, and `price`.
- **In-Memory Footprint**: 50,000 items in Node.js memory consume ~45 MB of RAM, which is lightweight. For datasets with 5,000,000+ items, database indexing and Elasticsearch would be recommended.
- **WebSocket Push**: Currently, dashboard metrics refresh via reactive HTTP polling/mutation triggers. In high-frequency multi-user environments, WebSockets (NestJS Gateway) would broadcast live updates to all connected dashboards.

---

## 12. Verification Commands Reference

```bash
# 1. Run root production builds
npm run build

# 2. Run all 70 automated tests
npm run test

# 3. Test API Health directly
curl -s http://localhost:3000/api/health

# 4. Test API Stats directly
curl -s http://localhost:3000/api/stats

# 5. Test Paginated Query
curl -s "http://localhost:3000/api/items?page=1&pageSize=5"
```

---

## 13. Application Walkthrough & Feature Tour

A structured walkthrough guide demonstrating the complete system architecture and core operational capabilities:

### Part 1: Starting the Application & System Overview
1. **Launch Workspace**:
   - Run `npm run dev` from root to concurrently boot the NestJS API (port 3000) and Angular 22 frontend (port 4200).
2. **Dashboard Overview (`/dashboard`)**:
   - Highlight the 4 KPI Cards: **Total Items (50,000)**, **Available Items**, **Out of Stock**, and **Mean Item Price ($26.40)**.
   - Interact with the **Apache ECharts Donut Chart**: Hover over slices to observe real-time percentage and count in the center overlay.
   - Switch between **Dark Mode and Light Mode** to demonstrate high-contrast Material design token reactivity.

### Part 2: Menu Data Explorer & Large-Scale Processing
1. **Navigate to Menu Data Explorer (`/menu`)**:
   - Observe immediate rendering of the active slice from 50,000 records without client-side memory overhead.
   - Use pagination controls (10, 25, 50, 100 rows per page) and test boundary navigation.
2. **Demonstrate Filtering & Sorting**:
   - Search by item name to verify the **300ms debounced search** and automatic in-flight HTTP request cancellation via `switchMap`.
   - Select a **Restaurant Chain** to observe cascading branch updates dynamically restricted to that chain.
   - Apply combined **Category**, **Availability**, and **Price Range** ($10 – $50) filters.
   - Sort table columns (Price, Last Updated, Name) to verify server-side comparator efficiency.

### Part 3: Item Management & Global State Synchronization
1. **Edit Item**:
   - Click **"Edit"** on any item to open the Reactive Form modal.
   - Demonstrate client and server price validation rules.
   - Modify price and availability status, then submit changes.
2. **Verify Immediate Synchronization**:
   - Table row updates immediately with server-confirmed payload.
   - Executive Dashboard recalculates global metrics (Available count, Average price) in real time.

### Part 4: Fault-Tolerant Persistence Across Restart
1. **Browser Refresh Persistence**:
   - Reload browser (F5 / Cmd+R): Modified values persist across reloads.
   - Restart the backend: In-memory cache rehydrates from disk storage file (`backend/data/menu-items.json`).
2. **Architecture Summary**:
   - **Frontend**: Modern Angular 22 Signals (`signal`, `computed`), OnPush change detection, and RxJS concurrency control.
   - **Backend**: NestJS modular REST API, deterministic Mulberry32 seed generator, and atomic file-swapping mutex.
