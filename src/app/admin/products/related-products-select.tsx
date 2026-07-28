"use client";

import { useState } from "react";

export function RelatedProductsSelect({
  products,
  defaultSelected = [],
}: {
  products: { id: string; name: string }[];
  defaultSelected?: string[];
}) {
  const [selected, setSelected] = useState<string[]>(defaultSelected);

  function toggle(id: string) {
    setSelected((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]));
  }

  return (
    <div>
      <input type="hidden" name="relatedProductIds" value={JSON.stringify(selected)} />
      <div className="border-border max-h-48 space-y-1 overflow-y-auto rounded-lg border bg-white p-3">
        {products.length === 0 && (
          <p className="text-muted-foreground text-sm">No other products yet.</p>
        )}
        {products.map((product) => (
          <label key={product.id} className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={selected.includes(product.id)}
              onChange={() => toggle(product.id)}
            />
            {product.name}
          </label>
        ))}
      </div>
    </div>
  );
}
