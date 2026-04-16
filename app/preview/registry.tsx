import type { ReactNode } from "react";
import SavingsFlowSim from "./SavingsFlowSim";
import SavingsFlowSimBottom from "./SavingsFlowSimBottom";
import SavingsFlowSimTopV2 from "./SavingsFlowSimTopV2";
import SelectionsSim from "./SelectionsSim";
import AppEntryPointSim from "./AppEntryPointSim";
import DrawerExperienceSim from "../components/DrawerExperienceSim";
import RefreshSessionSimV1 from "./RefreshSessionSimV1";
import RefreshSessionSimV2 from "./RefreshSessionSimV2";

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
        description: "Interactive savings goal conversation — tap chips to advance",
        render: () => <SavingsFlowSim />,
      },
      {
        name: "bottom",
        description: "Interactive savings goal conversation — bottom variant exploration",
        render: () => <SavingsFlowSimBottom />,
      },
      {
        name: "top-v2",
        description: "Spinner-based cruncher with checklist expand and celebratory footer",
        render: () => <SavingsFlowSimTopV2 />,
      },
    ],
  },
  {
    component: "Selections",
    variants: [{
      name: "full-sim",
      description: "Selection chips — falling behind on goal scenario",
      render: () => <SelectionsSim />,
    }],
  },
  { component: "Visualizations", variants: [], empty: true },
  {
    component: "AppEntryPoint",
    variants: [{
      name: "full-sim",
      description: "Purple home screen with scrollable pills",
      render: () => <AppEntryPointSim />,
    }],
  },
  { component: "GoalScreen", variants: [], empty: true },
  { component: "Tone", variants: [], empty: true },
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
    variants: [{
      name: "full-sim",
      description: "Drawer push up/down — My Money back layer + Chat sheet",
      render: () => <DrawerExperienceSim />,
    }],
  },
];
