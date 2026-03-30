import { useAppSelector } from "@/lib/redux/hooks";
import { useAuth } from "@/components/providers/auth-provider";

export function usePermissions() {
  const { user } = useAuth();
  const { roles, permissions } = useAppSelector((state) => state.staff);

  // Get current user's role from session
  const currentUserRole = user?.role || null;

  // Match user role (by _id or name as fallback)
  const userRole =
    roles.find((role) => role._id === currentUserRole) ||
    roles.find((role) => role.name === currentUserRole);

  // Get full permission objects from role
  const userPermissions = userRole?.permissions || [];

  // Check if user has a specific permission by custom `id`
  const hasPermission = (permissionId: string): boolean => {
    return userPermissions.some(
      (perm: any) => perm.id === permissionId || perm._id === permissionId
    );
  };

  const hasAnyPermission = (permissionIds: string[]): boolean => {
    return permissionIds.some((id) =>
      userPermissions.some((perm: any) => perm.id === id || perm._id === id)
    );
  };

  const hasAllPermissions = (permissionIds: string[]): boolean => {
    return permissionIds.every((id) =>
      userPermissions.some((perm: any) => perm.id === id || perm._id === id)
    );
  };

  const getModulePermissions = (module: string): string[] => {
    return permissions
      .filter((p) => p.module === module)
      .map((p: any) => p.id || p._id);
  };

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    getModulePermissions,
    userPermissions,
    userRole,
  };
}
