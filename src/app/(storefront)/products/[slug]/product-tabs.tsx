"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type Tab = { id: string; label: string; content: React.ReactNode };

export function ProductTabs({ tabs }: { tabs: Tab[] }) {
  const [active, setActive] = useState(tabs[0]?.id);
  const activeTab = tabs.find((t) => t.id === active);

  return (
    <div>
      <div role="tablist" aria-label="Product information" className="border-border flex flex-wrap gap-1 border-b">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={tab.id === active}
            aria-controls={`tabpanel-${tab.id}`}
            onClick={() => setActive(tab.id)}
            className={cn(
              "border-b-2 px-4 py-2.5 text-sm font-medium transition-colors",
              tab.id === active
                ? "border-primary-600 text-primary-700"
                : "text-muted-foreground border-transparent hover:text-foreground",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {activeTab && (
        <div
          role="tabpanel"
          id={`tabpanel-${activeTab.id}`}
          aria-labelledby={`tab-${activeTab.id}`}
          className="py-6"
        >
          {activeTab.content}
        </div>
      )}
    </div>
  );
}
