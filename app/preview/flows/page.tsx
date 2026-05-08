"use client";

import { useState } from "react";
import { typography } from "../../lib/typography";
import { SLATE_300, SLATE_800 } from "../../lib/colors";
import { FLOW_STATUS, STATUSES } from "../_shared/status-registry";
import type { ItemStatus } from "../_shared/status-registry";
import PlaygroundCard from "../_shared/PlaygroundCard";

// Sim imports — reused as-is
import OnboardingSim from "../OnboardingSim";
import AASim from "../AASim";
import SavingsFlowSim from "../SavingsFlowSim";
import SavingsFlowSimBottom from "../SavingsFlowSimBottom";
import VisualizationsChatSimV1 from "../VisualizationsChatSimV1";
import VisualizationsChatSimV2 from "../VisualizationsChatSimV2";
import AppEntryPointSim from "../AppEntryPointSim";
import DegenModeSimV1 from "../DegenModeSimV1";
import RedditSimV1 from "../RedditSimV1";
import RedditSimV2 from "../RedditSimV2";
import RefreshSessionSimV1 from "../RefreshSessionSimV1";
import RefreshSessionSimV2 from "../RefreshSessionSimV2";
import DrawerExperienceSim from "../../components/DrawerExperienceSim";

// ── Flow definitions ──────────────────────────────────────────
type FlowDef = {
  id: string;
  label: string;
  description: string;
  hasAutoplay?: boolean;
  variants: { name: string; render: (autoplay?: boolean) => React.ReactNode }[];
};

const FLOWS: FlowDef[] = [
  {
    id: "onboarding",
    label: "Onboarding",
    description: "First-time user journey — quiz, chat-led, and PlanMode variants",
    variants: [
      { name: "v1", render: () => <OnboardingSim /> },
    ],
  },
  {
    id: "aa",
    label: "AA",
    description: "Account Aggregator — value prop → bank select → OTP → consent → success",
    variants: [
      { name: "v1", render: () => <AASim /> },
    ],
  },
  {
    id: "planmode-savings",
    label: "PlanMode Savings",
    description: "Savings goal flow with spinner cruncher and interactive conversation",
    variants: [
      { name: "top", render: () => <SavingsFlowSim /> },
      { name: "bottom", render: () => <SavingsFlowSimBottom /> },
    ],
  },
  {
    id: "visualizations",
    label: "Visualizations Chat",
    description: "Staged chat showing all card types interspersed with messages",
    variants: [
      { name: "v1", render: () => <VisualizationsChatSimV1 /> },
      { name: "v2", render: () => <VisualizationsChatSimV2 /> },
    ],
  },
  {
    id: "app-entry-point",
    label: "AppEntryPoint",
    description: "Purple home screen with scrollable pills",
    variants: [
      { name: "full-sim", render: () => <AppEntryPointSim /> },
    ],
  },
  {
    id: "degen-mode",
    label: "DegenMode",
    description: "Degen Mode exploration — baseline",
    variants: [
      { name: "v1", render: () => <DegenModeSimV1 /> },
    ],
  },
  {
    id: "reddit",
    label: "Reddit",
    description: "Fake leak — animated recording and static screenshot",
    hasAutoplay: true,
    variants: [
      { name: "recording", render: (autoplay) => <RedditSimV1 autoplay={autoplay} /> },
      { name: "screenshot", render: () => <RedditSimV2 /> },
    ],
  },
  {
    id: "refresh-session",
    label: "RefreshSession",
    description: "Refresh session variants",
    variants: [
      { name: "v1", render: () => <RefreshSessionSimV1 /> },
      { name: "v2", render: () => <RefreshSessionSimV2 /> },
    ],
  },
  {
    id: "drawer-experience",
    label: "DrawerExperience",
    description: "Drawer push up/down — My Money back layer + Chat sheet",
    variants: [
      { name: "v1", render: () => <DrawerExperienceSim /> },
    ],
  },
];

function FlowEntry({ flow, status, onCycleStatus }: { flow: FlowDef; status: ItemStatus; onCycleStatus: () => void }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [autoplay, setAutoplay] = useState(false);

  return (
    <PlaygroundCard
      name={flow.label}
      description={flow.description}
      status={status}
      onCycleStatus={onCycleStatus}
      variants={flow.variants.map((v) => v.name)}
      activeVariantIndex={activeIdx}
      onVariantChange={setActiveIdx}
      deviceFrame
      autoplay={flow.hasAutoplay ? autoplay : undefined}
      onToggleAutoplay={flow.hasAutoplay ? () => setAutoplay((p) => !p) : undefined}
    >
      {flow.variants[activeIdx].render(autoplay)}
    </PlaygroundCard>
  );
}

export default function FlowsPage() {
  const [statuses, setStatuses] = useState<Record<string, ItemStatus>>(() => ({ ...FLOW_STATUS }));

  const cycleStatus = (id: string) => {
    setStatuses((prev) => {
      const cur = prev[id] ?? "exploring";
      const idx = STATUSES.indexOf(cur);
      return { ...prev, [id]: STATUSES[(idx + 1) % STATUSES.length] };
    });
  };

  return (
    <div style={{ padding: "32px 40px" }}>
      <h1 style={{ ...typography.headerH1, color: SLATE_800, marginBottom: 4 }}>Flows</h1>
      <p style={{ ...typography.bodySmall, color: SLATE_300, marginBottom: 32 }}>
        End-to-end journeys in device frames. Reuses existing sim files as-is.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {FLOWS.map((flow) => (
          <FlowEntry
            key={flow.id}
            flow={flow}
            status={statuses[flow.id] ?? "exploring"}
            onCycleStatus={() => cycleStatus(flow.id)}
          />
        ))}
      </div>
    </div>
  );
}
