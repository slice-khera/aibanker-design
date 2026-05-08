"use client";

import { useState } from "react";
import { typography } from "../../lib/typography";
import { SLATE_300, SLATE_800 } from "../../lib/colors";
import ChatCard from "../../components/ChatCards";
import type { ChatCardData } from "../../components/ChatCards";
import { VIZ_STATUS, STATUSES } from "../_shared/status-registry";
import type { ItemStatus } from "../_shared/status-registry";
import PlaygroundCard from "../_shared/PlaygroundCard";
import {
  DBG_SPEND_OVERVIEW, DBG_CATEGORY_BAR, DBG_GOAL_AHEAD, DBG_GOAL_BEHIND, DBG_GOAL_ONTRACK,
  DBG_SAVINGS_PLAN, DBG_MERCHANT_BAR, DBG_CATEGORY_MOM, DBG_SPEND_TREND,
  DBG_HEATMAP, DBG_DONUT_V2, DBG_TXN_TABLE,
} from "../../lib/debug-fixtures";

// ── Visualization items with state variants ───────────────────
type VizItem = {
  type: string;
  label: string;
  fixtures: { name: string; data: ChatCardData }[];
};

const VIZ_ITEMS: VizItem[] = [
  {
    type: "spend-overview",
    label: "Spend Overview",
    fixtures: [{ name: "default", data: { ...DBG_SPEND_OVERVIEW, variant: "surface" } }],
  },
  {
    type: "category-breakdown",
    label: "Category Breakdown",
    fixtures: [{ name: "default", data: { ...DBG_CATEGORY_BAR, variant: "surface" } }],
  },
  {
    type: "goal-progress",
    label: "Goal Progress",
    fixtures: [
      { name: "ahead", data: { ...DBG_GOAL_AHEAD, variant: "surface" } },
      { name: "behind", data: { ...DBG_GOAL_BEHIND, variant: "surface" } },
      { name: "on-track", data: { ...DBG_GOAL_ONTRACK, variant: "surface" } },
    ],
  },
  {
    type: "savings-plan",
    label: "Savings Plan",
    fixtures: [{ name: "default", data: { ...DBG_SAVINGS_PLAN, variant: "surface" } }],
  },
  {
    type: "merchant-concentration",
    label: "Merchant Concentration",
    fixtures: [{ name: "default", data: { ...DBG_MERCHANT_BAR, variant: "surface" } }],
  },
  {
    type: "category-mom",
    label: "Category MoM",
    fixtures: [{ name: "default", data: { ...DBG_CATEGORY_MOM, variant: "surface" } }],
  },
  {
    type: "spending-heatmap",
    label: "Spending Heatmap",
    fixtures: [{ name: "default", data: { ...DBG_HEATMAP, variant: "surface" } }],
  },
  {
    type: "payment-mode-donut-v2",
    label: "Payment Mode Donut",
    fixtures: [{ name: "default", data: { ...DBG_DONUT_V2, variant: "surface" } }],
  },
  {
    type: "transaction-table",
    label: "Transaction Table",
    fixtures: [{ name: "default", data: { ...DBG_TXN_TABLE, variant: "surface" } }],
  },
  {
    type: "spend-trend",
    label: "Spend Trend",
    fixtures: [{ name: "default", data: { ...DBG_SPEND_TREND, variant: "surface" } }],
  },
];

function VizEntry({ item, status, onCycleStatus }: { item: VizItem; status: ItemStatus; onCycleStatus: () => void }) {
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

export default function VisualizationsPage() {
  const [statuses, setStatuses] = useState<Record<string, ItemStatus>>(() => ({ ...VIZ_STATUS }));

  const cycleStatus = (type: string) => {
    setStatuses((prev) => {
      const cur = prev[type] ?? "exploring";
      const idx = STATUSES.indexOf(cur);
      return { ...prev, [type]: STATUSES[(idx + 1) % STATUSES.length] };
    });
  };

  return (
    <div style={{ padding: "32px 40px" }}>
      <h1 style={{ ...typography.headerH1, color: SLATE_800, marginBottom: 4 }}>Visualizations</h1>
      <p style={{ ...typography.bodySmall, color: SLATE_300, marginBottom: 32 }}>
        10 data display components — flat on surface, no bounding box.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {VIZ_ITEMS.map((item) => (
          <VizEntry
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
