import type { ReactNode } from "react";
import SavingsFlowSim from "./SavingsFlowSim";
import SavingsFlowSimBottom from "./SavingsFlowSimBottom";

import AppEntryPointSim from "./AppEntryPointSim";
import DrawerExperienceSim from "../components/DrawerExperienceSim";
import WrappedStorySim from "./WrappedStorySim";

import RefreshSessionSimV1 from "./RefreshSessionSimV1";
import RefreshSessionSimV2 from "./RefreshSessionSimV2";
import DegenModeSimV1 from "./DegenModeSimV1";
import VisualizationsChatSimV1 from "./VisualizationsChatSimV1";
import VisualizationsChatSimV2 from "./VisualizationsChatSimV2";

export type Variant = {
  name: string;
  description: string;
  render: () => ReactNode;
};

export type Exploration = {
  component: string;
  variants: Variant[];
  /** If true, this exploration has no active variants — shown as disabled on landing */
  empty?: boolean;
};

/**
 * Active design explorations. Each entry is a component with named variants.
 *
 * Usage:
 *   1. Add an Exploration with multiple Variant render functions
 *   2. Visit /preview?component=ComponentName to view them in a gallery
 *   3. When finalized, remove the entry — only active explorations live here
 *
 * All variants are rendered inside the standard device frame (360×780)
 * defined in page.tsx. Never add custom phone frames here.
 */
export const explorations: Exploration[] = [
  {
    component: "PlanMode",
    variants: [
      {
        name: "top",
        description: "Spinner-based cruncher with checklist expand and celebratory footer",
        render: () => <SavingsFlowSim />,
      },
      {
        name: "bottom",
        description: "Interactive savings goal conversation — bottom variant exploration",
        render: () => <SavingsFlowSimBottom />,
      },
    ],
  },
  {
    component: "Visualizations",
    variants: [
      {
        name: "v1",
        description: "Staged chat showing all card types interspersed with user messages",
        render: () => <VisualizationsChatSimV1 />,
      },
      {
        name: "v2",
        description: "Visualizations chat — duplicate of V1 for iteration",
        render: () => <VisualizationsChatSimV2 />,
      },
    ],
  },
  {
    component: "AppEntryPoint",
    variants: [{
      name: "full-sim",
      description: "Purple home screen with scrollable pills",
      render: () => <AppEntryPointSim />,
    }],
  },
  { component: "GoalScreen", variants: [], empty: true },
  {
    component: "DegenMode",
    variants: [
      {
        name: "v1",
        description: "Degen Mode — baseline (copied from RefreshSession v1)",
        render: () => <DegenModeSimV1 />,
      },
    ],
  },
  {
    component: "RefreshSession",
    variants: [
      {
        name: "v1",
        description: "Refresh session — baseline (duplicated from Selections)",
        render: () => <RefreshSessionSimV1 />,
      },
      {
        name: "v2",
        description: "Refresh session — variant 2",
        render: () => <RefreshSessionSimV2 />,
      },
    ],
  },
  {
    component: "DrawerExperience",
    variants: [
      {
        name: "v1",
        description: "Drawer push up/down — My Money back layer + Chat sheet",
        render: () => <DrawerExperienceSim />,
      },
    ],
  },
  {
    component: "WrappedStory",
    variants: [
      {
        name: "v1",
        description: "Instagram Stories-style financial wrapped — tap/swipe, auto-advance",
        render: () => <WrappedStorySim />,
      },
    ],
  },
];
