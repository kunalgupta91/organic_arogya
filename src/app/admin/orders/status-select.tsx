"use client";

import { useTransition } from "react";
import { updateOrderStatusAction } from "./actions";

const STATUSES = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "RETURN_REQUESTED",
  "REFUNDED",
] as const;

export function OrderStatusSelect({
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
        startTransition(() => updateOrderStatusAction(id, status));
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
