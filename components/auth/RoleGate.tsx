"use client";

import type { ReactNode } from "react";
import { ShieldOff } from "lucide-react";
import { useRole } from "@/hooks/useRole";
import type { PermissionKey } from "@/lib/rbac";
import type { Role } from "@/types/database";

interface RoleGateProps {
  /** Show children only if user has this permission */
  permission?: PermissionKey;
  /** OR: show children only if user has at least this role */
  minRole?: Role;
  /** What to render when access is denied. If omitted, renders nothing. */
  fallback?: ReactNode;
  children: ReactNode;
}

/**
 * Conditionally renders children based on the current user's role/permissions.
 * Usage: <RoleGate permission="deleteDocuments">...</RoleGate>
 */
export function RoleGate({ permission, minRole, fallback = null, children }: RoleGateProps) {
  const { can, isAtLeast } = useRole();

  const allowed = (() => {
    if (permission) return can[permission];
    if (minRole) return isAtLeast(minRole);
    return true;
  })();

  return allowed ? <>{children}</> : <>{fallback}</>;
}

/** Inline "access denied" block — use as fallback prop */
export function AccessDeniedBadge({ message = "Accès restreint" }: { message?: string }) {
  return (
    <div
      className="flex items-center gap-2 px-3 py-2 rounded-lg text-[12px] font-medium"
      style={{ background: "rgba(107,114,128,0.08)", border: "1px solid rgba(107,114,128,0.15)", color: "rgba(255,255,255,0.3)" }}
    >
      <ShieldOff size={12} />
      {message}
    </div>
  );
}
