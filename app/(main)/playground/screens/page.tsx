"use client";

import { useState } from "react";
import { SCREEN_STATUS, STATUSES } from "@/app/preview/_shared/status-registry";
import type { ItemStatus } from "@/app/preview/_shared/status-registry";
import PlaygroundCard from "@/app/preview/_shared/PlaygroundCard";

// Screen components
import GoalListScreen from "@/app/components/GoalListScreen";
import PotDetail from "@/app/components/PotDetail";
import ChatInitialScreen, { getSuggestions } from "@/app/components/ChatInitialScreen";
import QuestionnaireOverlay from "@/app/components/QuestionnaireOverlay";
import FeaturePDP from "@/app/components/FeaturePDP";

import { GOAL_TRACKER_SCENARIOS, DBG_GOAL_QUESTIONS } from "@/app/lib/debug-fixtures";

// ── Screen definitions ────────────────────────────────────────
type ScreenDef = {
  id: string;
  label: string;
  variants: { name: string; render: () => React.ReactNode }[];
};

const noop = () => {};

// Goal data shortcuts
const goalsTwo = GOAL_TRACKER_SCENARIOS.two;
const goalThree = GOAL_TRACKER_SCENARIOS.three;
const goalSingle = GOAL_TRACKER_SCENARIOS.single;
const goalAhead = goalsTwo[0];
const goalBehind = GOAL_TRACKER_SCENARIOS["single-alert"][0];
const goalOnTrack = goalSingle[0];

const PDP_FEATURES = [
  { title: "Spending, decoded", subtitle: "See where your money actually goes" },
  { title: "Goals on autopilot", subtitle: "Set a target, get a plan, stay on track" },
];

const SCREENS: ScreenDef[] = [
  {
    id: "feature-pdp",
    label: "Feature page",
    variants: [
      {
        name: "default",
        render: () => (
          <FeaturePDP
            productName="Meet Ryan"
            subtitle={"Keeps track of your money,\nso you don't have to"}
            features={PDP_FEATURES}
            onClose={noop}
            onAction={noop}
          />
        ),
      },
    ],
  },
  {
    id: "goal-list",
    label: "Goal list",
    variants: [
      { name: "1 goal", render: () => <GoalListScreen goals={goalSingle} onGoalTap={noop} onClose={noop} cardVariant="v1" /> },
      { name: "2 goals", render: () => <GoalListScreen goals={goalsTwo} onGoalTap={noop} onClose={noop} cardVariant="v2" /> },
      { name: "3 goals", render: () => <GoalListScreen goals={goalThree} onGoalTap={noop} onClose={noop} cardVariant="v3" /> },
    ],
  },
  {
    id: "pot-detail",
    label: "Pot detail",
    variants: [
      { name: "ahead", render: () => <PotDetail name={goalAhead.name} saved={goalAhead.saved} target={goalAhead.target} pct={goalAhead.pct} status={goalAhead.status} daysLabel={goalAhead.daysLabel} icon={goalAhead.heroEmoji ?? "✈️"} heroScene={goalAhead.heroScene} onBack={noop} /> },
      { name: "behind", render: () => <PotDetail name={goalBehind.name} saved={goalBehind.saved} target={goalBehind.target} pct={goalBehind.pct} status={goalBehind.status} daysLabel={goalBehind.daysLabel} icon={goalBehind.heroEmoji ?? "✈️"} heroScene={goalBehind.heroScene} onBack={noop} /> },
      { name: "on-track", render: () => <PotDetail name={goalOnTrack.name} saved={goalOnTrack.saved} target={goalOnTrack.target} pct={goalOnTrack.pct} status={goalOnTrack.status} daysLabel={goalOnTrack.daysLabel} icon={goalOnTrack.heroEmoji ?? "✈️"} heroScene={goalOnTrack.heroScene} onBack={noop} /> },
    ],
  },
  {
    id: "chat-initial",
    label: "Chat initial",
    variants: [
      { name: "new5", render: () => <ChatInitialScreen suggestions={getSuggestions(false)} onSuggestionClick={noop} onSubmit={noop} variant="new5" /> },
      { name: "review-ontrack", render: () => <ChatInitialScreen suggestions={getSuggestions(true)} onSuggestionClick={noop} onSubmit={noop} variant="review-ontrack" /> },
      { name: "review-rent", render: () => <ChatInitialScreen suggestions={getSuggestions(true)} onSuggestionClick={noop} onSubmit={noop} variant="review-rent" /> },
    ],
  },
  {
    id: "questionnaire",
    label: "Questionnaire",
    variants: [
      { name: "step 1", render: () => <QuestionnaireOverlay questions={DBG_GOAL_QUESTIONS} currentIndex={0} answers={{}} onSelectOption={noop} onSubmitFreeText={noop} onNavigate={noop} onClose={noop} /> },
      { name: "step 2", render: () => <QuestionnaireOverlay questions={DBG_GOAL_QUESTIONS} currentIndex={1} answers={{ choice: "trip" }} onSelectOption={noop} onSubmitFreeText={noop} onNavigate={noop} onClose={noop} /> },
      { name: "step 3", render: () => <QuestionnaireOverlay questions={DBG_GOAL_QUESTIONS} currentIndex={2} answers={{ choice: "trip", destination: "Japan" }} onSelectOption={noop} onSubmitFreeText={noop} onNavigate={noop} onClose={noop} /> },
    ],
  },
];

function ScreenEntry({ screen, status, onCycleStatus }: { screen: ScreenDef; status: ItemStatus; onCycleStatus: () => void }) {
  const [activeIdx, setActiveIdx] = useState(0);

  return (
    <PlaygroundCard
      name={screen.label}
      status={status}
      onCycleStatus={onCycleStatus}
      variants={screen.variants.map((v) => v.name)}
      activeVariantIndex={activeIdx}
      onVariantChange={setActiveIdx}
      deviceFrame
    >
      {screen.variants[activeIdx].render()}
    </PlaygroundCard>
  );
}

export default function ScreensPage() {
  const [statuses, setStatuses] = useState<Record<string, ItemStatus>>(() => ({ ...SCREEN_STATUS }));

  const cycleStatus = (id: string) => {
    setStatuses((prev) => {
      const cur = prev[id] ?? "exploring";
      const idx = STATUSES.indexOf(cur);
      return { ...prev, [id]: STATUSES[(idx + 1) % STATUSES.length] };
    });
  };

  return (
    <div className="px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Screens</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Individual screens in device frames
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {SCREENS.map((screen) => (
          <ScreenEntry
            key={screen.id}
            screen={screen}
            status={statuses[screen.id] ?? "exploring"}
            onCycleStatus={() => cycleStatus(screen.id)}
          />
        ))}
      </div>
    </div>
  );
}
