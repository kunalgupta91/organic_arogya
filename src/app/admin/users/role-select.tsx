"use client";

import { useTransition } from "react";
import { updateUserRoleAction } from "./actions";

const ROLES = ["CUSTOMER", "STAFF", "ADMIN"] as const;

export function RoleSelect({
  userId,
  currentRole,
  disabled,
}: {
  userId: string;
  currentRole: (typeof ROLES)[number];
  disabled: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <select
      defaultValue={currentRole}
      disabled={disabled || isPending}
      onChange={(e) => {
        const role = e.target.value as (typeof ROLES)[number];
        startTransition(() => updateUserRoleAction(userId, role));
      }}
      className="border-border rounded-md border bg-white px-2 py-1 text-sm disabled:opacity-50"
    >
      {ROLES.map((role) => (
        <option key={role} value={role}>
          {role}
        </option>
      ))}
    </select>
  );
}
