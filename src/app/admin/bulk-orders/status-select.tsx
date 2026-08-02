"use client";

import { useTransition } from "react";
import { updateBulkOrderStatusAction } from "./actions";

const STATUSES = ["PENDING", "CONTACTED", "CONFIRMED", "REJECTED"] as const;

export function BulkOrderStatusSelect({
  id,
  currentStatus,
}: {
  id: string;
  currentStatus: (typeof STATUSES)[number];
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <select
      defaultValue={currentStatus}
      disabled={isPending}
      onChange={(e) => {
        const status = e.target.value as (typeof STATUSES)[number];
        startTransition(() => updateBulkOrderStatusAction(id, status));
      }}
      className="border-border rounded-md border bg-white px-2 py-1 text-sm disabled:opacity-50"
    >
      {STATUSES.map((status) => (
        <option key={status} value={status}>
          {status}
        </option>
      ))}
    </select>
  );
}
