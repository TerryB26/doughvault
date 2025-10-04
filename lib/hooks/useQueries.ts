import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/lib/queryKeys';

// Users hooks
export function useUsers() {
  return useQuery({
    queryKey: QUERY_KEYS.USERS,
    queryFn: async () => {
      const response = await fetch('/api/users');
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      return response.json();
    },
  });
}

// Roles hooks
export function useRoles() {
  return useQuery({
    queryKey: QUERY_KEYS.ROLES,
    queryFn: async () => {
      const response = await fetch('/api/roles');
      if (!response.ok) {
        throw new Error('Failed to fetch roles');
      }
      return response.json();
    },
  });
}

// User Roles hooks
export function useUserRoles() {
  return useQuery({
    queryKey: QUERY_KEYS.USER_ROLES,
    queryFn: async () => {
      const response = await fetch('/api/user-roles');
      if (!response.ok) {
        throw new Error('Failed to fetch user roles');
      }
      return response.json();
    },
  });
}

// Items hooks
export function useItems() {
  return useQuery({
    queryKey: QUERY_KEYS.ITEMS,
    queryFn: async () => {
      const response = await fetch('/api/items');
      if (!response.ok) {
        throw new Error('Failed to fetch items');
      }
      return response.json();
    },
  });
}

// Inventory Summary hooks
export function useInventorySummary() {
  return useQuery({
    queryKey: QUERY_KEYS.INVENTORY_SUMMARY,
    queryFn: async () => {
      const response = await fetch('/api/inventory/summary');
      if (!response.ok) {
        throw new Error('Failed to fetch inventory summary');
      }
      return response.json();
    },
  });
}

// Item Logs hooks
export function useItemLogs(itemId: number | null) {
  return useQuery({
    queryKey: [...QUERY_KEYS.ITEMS, 'logs', itemId],
    queryFn: async () => {
      if (!itemId) return { logs: [] };
      const response = await fetch(`/api/items/logs?itemId=${itemId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch item logs');
      }
      return response.json();
    },
    enabled: !!itemId,
  });
}
