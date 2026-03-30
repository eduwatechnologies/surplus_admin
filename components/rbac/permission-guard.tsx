"use client";

import type { ReactNode } from "react";
import { usePermissions } from "@/lib/rbac/permissions";

interface PermissionGuardProps {
  children: ReactNode;
  requiredPermission?: string;
  requiredPermissions?: string[];
  requireAll?: boolean;
  fallback?: ReactNode;
  className?: string;
}

export function PermissionGuard({
  children,
  requiredPermission,
  requiredPermissions = [],
  requireAll = false,
  fallback = null,
  className,
}: Readonly<PermissionGuardProps>) {
  const { hasPermission, hasAnyPermission, hasAllPermissions } =
    usePermissions();

  // Check for a single permission
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <>{fallback}</>;
  }

  // Check for multiple permissions
  if (requiredPermissions.length > 0) {
    const hasAccess = requireAll
      ? hasAllPermissions(requiredPermissions)
      : hasAnyPermission(requiredPermissions);

    if (!hasAccess) {
      return <>{fallback}</>;
    }
  }

  // User has the required permissions
  if (className) {
    return <div className={className}>{children}</div>;
  }

  return <>{children}</>;
}
