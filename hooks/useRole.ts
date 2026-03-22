"use client";

import { useMemo } from "react";
import { useAuth } from "@/contexts/SupabaseAuthContext";
import { PERMISSIONS, hasRole, ROLE_LABELS, ROLE_COLORS, type PermissionKey } from "@/lib/rbac";
import type { Role } from "@/types/database";

const ALL_ROLES: Role[] = ["admin", "manager", "member", "viewer"];

/**
 * Returns the current user's role and permission helpers.
 * When Supabase is not configured, defaults to 'admin' so nothing breaks.
 */
export function useRole() {
  const { user, isConfigured } = useAuth();

  const role: Role = useMemo(() => {
    if (!isConfigured) return "admin"; // local dev — full access
    const raw = user?.user_metadata?.role as string | undefined;
    if (raw && (ALL_ROLES as string[]).includes(raw)) return raw as Role;
    return "member"; // safe default for authenticated users
  }, [user, isConfigured]);

  const can = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(PERMISSIONS).map(([key, fn]) => [key, fn(role)])
      ) as Record<PermissionKey, boolean>,
    [role]
  );

  return {
    role,
    can,
    label: ROLE_LABELS[role],
    colors: ROLE_COLORS[role],
    isAdmin: role === "admin",
    isAtLeast: (required: Role) => hasRole(role, required),
  };
}
