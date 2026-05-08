"use client";

import { useState } from "react";
import { typography } from "../../lib/typography";
import { SLATE_300, SLATE_800 } from "../../lib/colors";
import ChatCard from "../../components/ChatCards";
import type { ChatCardData } from "../../components/ChatCards";
import { WIDGET_STATUS, STATUSES } from "../_shared/status-registry";
import type { ItemStatus } from "../_shared/status-registry";
import PlaygroundCard from "../_shared/PlaygroundCard";
import {
  DBG_FD_SETUP, DBG_FD_ACTIVATED,
  DBG_OBLIGATIONS_V2, DBG_BIG_EXPENSES,
} from "../../lib/debug-fixtures";

// ── Widget items with state variants ──────────────────────────
type WidgetItem = {
  type: string;
  label: string;
  fixtures: { name: string; data: ChatCardData }[];
};

const WIDGET_ITEMS: WidgetItem[] = [
  {
    type: "investment-product",
    label: "Investment Product (FD)",
    fixtures: [
      { name: "setup", data: { ...DBG_FD_SETUP, variant: "card" } },
      { name: "activated", data: { ...DBG_FD_ACTIVATED, variant: "card" } },
    ],
  },
  {
    type: "obligations-list-v2",
    label: "Obligations List",
    fixtures: [
      { name: "unsubmitted", data: { ...DBG_OBLIGATIONS_V2, variant: "card" } },
      { name: "submitted", data: { ...DBG_OBLIGATIONS_V2, variant: "card", submitted: true } as ChatCardData },
    ],
  },
  {
    type: "big-expenses",
    label: "Big Expenses",
    fixtures: [{ name: "default", data: { ...DBG_BIG_EXPENSES, variant: "card" } }],
  },
  {
    type: "add-to-pot",
    label: "Add to Pot",
    fixtures: [
      {
        name: "default",
        data: {
          type: "add-to-pot",
          variant: "card",
          goalName: "Trip to Japan",
          amount: 5000,
          fromAccount: "Savings xx1234",
        },
      },
      {
        name: "activated",
        data: {
          type: "add-to-pot",
          variant: "card",
          goalName: "Trip to Japan",
          amount: 5000,
          fromAccount: "Savings xx1234",
          activated: true,
        },
      },
    ],
  },
];

function WidgetEntry({ item, status, onCycleStatus }: { item: WidgetItem; status: ItemStatus; onCycleStatus: () => void }) {
  const [activeIdx, setActiveIdx] = useState(0);

  return (
    <PlaygroundCard
      name={item.label}
      status={status}
      onCycleStatus={onCycleStatus}
      variants={item.fixtures.map((f) => f.name)}
      activeVariantIndex={activeIdx}
      onVariantChange={setActiveIdx}
    >
      <ChatCard card={item.fixtures[activeIdx].data} />
    </PlaygroundCard>
  );
}

export default function WidgetsPage() {
  const [statuses, setStatuses] = useState<Record<string, ItemStatus>>(() => ({ ...WIDGET_STATUS }));

  const cycleStatus = (type: string) => {
    setStatuses((prev) => {
      const cur = prev[type] ?? "exploring";
      const idx = STATUSES.indexOf(cur);
      return { ...prev, [type]: STATUSES[(idx + 1) % STATUSES.length] };
    });
  };

  return (
    <div style={{ padding: "32px 40px" }}>
      <h1 style={{ ...typography.headerH1, color: SLATE_800, marginBottom: 4 }}>Widgets</h1>
      <p style={{ ...typography.bodySmall, color: SLATE_300, marginBottom: 32 }}>
        4 actionable items — enclosed containers with interactive controls.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {WIDGET_ITEMS.map((item) => (
          <WidgetEntry
            key={item.type}
            item={item}
            status={statuses[item.type] ?? "exploring"}
            onCycleStatus={() => cycleStatus(item.type)}
          />
        ))}
      </div>
    </div>
  );
}
