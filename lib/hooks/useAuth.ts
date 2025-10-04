import { useUser } from '@clerk/nextjs';
import { useQuery } from '@tanstack/react-query';

export interface UserWithRoles {
  userid: number;
  email: string;
  firstname: string;
  lastname: string;
  roles: string[];
}

export function useCurrentUser() {
  const { user, isLoaded } = useUser();

  return useQuery<UserWithRoles | null>({
    queryKey: ['currentUser', user?.id],
    queryFn: async () => {
      if (!user?.emailAddresses?.[0]?.emailAddress) {
        return null;
      }

      const response = await fetch(`/api/users/current`);
      if (!response.ok) {
        throw new Error('Failed to fetch current user');
      }
      return response.json();
    },
    enabled: isLoaded && !!user,
  });
}

export function useUserRoles() {
  const { data: currentUser } = useCurrentUser();
  
  const hasRole = (roleName: string) => {
    return currentUser?.roles?.includes(roleName) || false;
  };

  const hasAnyRole = (roleNames: string[]) => {
    return roleNames.some(role => hasRole(role));
  };

  const isAdmin = hasRole('Admin');
  const isManager = hasRole('Manager');
  const isStaff = hasRole('Staff');

  return {
    roles: currentUser?.roles || [],
    hasRole,
    hasAnyRole,
    isAdmin,
    isManager,
    isStaff,
    canEdit: isAdmin || isManager,
    canDelete: isAdmin,
    canView: true, // All authenticated users can view
  };
}
