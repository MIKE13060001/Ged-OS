import type { Role } from "@/types/database";

// Role hierarchy: admin > manager > member > viewer
const ROLE_WEIGHT: Record<Role, number> = {
  admin: 4,
  manager: 3,
  member: 2,
  viewer: 1,
};

/**
 * Returns true if `userRole` has at least the required level.
 */
export function hasRole(userRole: Role | null | undefined, required: Role): boolean {
  if (!userRole) return false;
  return ROLE_WEIGHT[userRole] >= ROLE_WEIGHT[required];
}

// What each role can do
export const PERMISSIONS = {
  // Document operations
  uploadDocuments: (role: Role) => hasRole(role, "member"),
  deleteDocuments: (role: Role) => hasRole(role, "manager"),
  editMetadata: (role: Role) => hasRole(role, "member"),
  viewDocuments: (role: Role) => hasRole(role, "viewer"),
  // Folder operations
  createFolders: (role: Role) => hasRole(role, "member"),
  deleteFolders: (role: Role) => hasRole(role, "manager"),
  // AI operations
  useAssistant: (role: Role) => hasRole(role, "member"),
  useN3Actions: (role: Role) => hasRole(role, "manager"),
  // Admin
  viewAdmin: (role: Role) => hasRole(role, "admin"),
  manageUsers: (role: Role) => hasRole(role, "admin"),
} as const;

export type PermissionKey = keyof typeof PERMISSIONS;

export const ROLE_LABELS: Record<Role, string> = {
  admin: "Admin",
  manager: "Manager",
  member: "Membre",
  viewer: "Lecteur",
};

export const ROLE_COLORS: Record<Role, { bg: string; text: string; border: string }> = {
  admin:   { bg: "rgba(239,68,68,0.1)",   text: "#f87171", border: "rgba(239,68,68,0.25)"   },
  manager: { bg: "rgba(245,158,11,0.1)", text: "#fbbf24", border: "rgba(245,158,11,0.25)" },
  member:  { bg: "rgba(59,130,246,0.1)", text: "#60a5fa", border: "rgba(59,130,246,0.25)" },
  viewer:  { bg: "rgba(107,114,128,0.1)", text: "#9ca3af", border: "rgba(107,114,128,0.2)"  },
};
