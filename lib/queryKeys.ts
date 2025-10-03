// Query Keys for React Query
export const QUERY_KEYS = {
  // Users
  USERS: ['users'] as const,
  USER: (id: number) => ['users', id] as const,
  USER_ACTIVITY: ['users', 'activity'] as const,
  
  // Roles
  ROLES: ['roles'] as const,
  ROLE: (id: number) => ['roles', id] as const,
  
  // User Roles
  USER_ROLES: ['userRoles'] as const,
  USER_ROLE: (id: number) => ['userRoles', id] as const,
  
  // Categories
  CATEGORIES: ['categories'] as const,
  CATEGORY: (id: number) => ['categories', id] as const,
  
  // Items
  ITEMS: ['items'] as const,
  ITEM: (id: number) => ['items', id] as const,
  LOW_STOCK_ITEMS: ['items', 'lowStock'] as const,
  
  // Views
  INVENTORY_VALUE: ['inventory', 'value'] as const,
  INVENTORY_SUMMARY: ['inventory', 'summary'] as const,
} as const;
