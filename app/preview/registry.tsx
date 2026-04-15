import type { ReactNode } from "react";
import SavingsFlowSim from "./SavingsFlowSim";
import SelectionsSim from "./SelectionsSim";
import AppEntryPointSim from "./AppEntryPointSim";
import DrawerExperienceSim from "../components/DrawerExperienceSim";

export type Variant = {
  name: string;
  description: string;
  render: () => ReactNode;
  /** If true, render without the default phone frame wrapper */
  noFrame?: boolean;
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
 */
/** Reusable phone-in-dark-frame render for SavingsFlowSim */
function phoneFrame() {
  return (
    <div className="flex items-center justify-center" style={{ width: "100%", minHeight: "100vh", padding: 40, backgroundColor: "#0a0a0a" }}>
      <div>
        <div
          className="relative"
          style={{
            borderRadius: 32,
            backgroundColor: "#1a1a1e",
            padding: 6,
            boxShadow: "0 28px 70px rgba(0,0,0,0.16), 0 6px 18px rgba(0,0,0,0.05)",
            outline: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <div
            className="relative z-10 overflow-hidden"
            style={{
              width: 360,
              aspectRatio: "360/780",
              borderRadius: 26,
              backgroundColor: "#fff",
            }}
          >
            <SavingsFlowSim />
          </div>
        </div>
      </div>
    </div>
  );
}

function selectionsPhoneFrame() {
  return (
    <div className="flex items-center justify-center" style={{ width: "100%", minHeight: "100vh", padding: 40, backgroundColor: "#0a0a0a" }}>
      <div>
        <div
          className="relative"
          style={{
            borderRadius: 32,
            backgroundColor: "#1a1a1e",
            padding: 6,
            boxShadow: "0 28px 70px rgba(0,0,0,0.16), 0 6px 18px rgba(0,0,0,0.05)",
            outline: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <div
            className="relative z-10 overflow-hidden"
            style={{
              width: 360,
              aspectRatio: "360/780",
              borderRadius: 26,
              backgroundColor: "#fff",
            }}
          >
            <SelectionsSim />
          </div>
        </div>
      </div>
    </div>
  );
}

function makeExploration(component: string, variantName: string, description: string): Exploration {
  return {
    component,
    variants: [
      {
        name: variantName,
        description,
        noFrame: true,
        render: phoneFrame,
      },
    ],
  };
}

export const explorations: Exploration[] = [
  makeExploration("PlanMode", "full-sim", "Interactive savings goal conversation — tap chips to advance"),
  {
    component: "Selections",
    variants: [{
      name: "full-sim",
      description: "Selection chips — falling behind on goal scenario",
      noFrame: true,
      render: selectionsPhoneFrame,
    }],
  },
  { component: "Visualizations", variants: [], empty: true },
  {
    component: "AppEntryPoint",
    variants: [{
      name: "full-sim",
      description: "Purple home screen with scrollable pills",
      noFrame: true,
      render: () => (
        <div className="flex items-center justify-center" style={{ width: "100%", minHeight: "100vh", padding: 40, backgroundColor: "#0a0a0a" }}>
          <div>
            <div
              className="relative"
              style={{
                borderRadius: 32,
                backgroundColor: "#1a1a1e",
                padding: 6,
                boxShadow: "0 28px 70px rgba(0,0,0,0.16), 0 6px 18px rgba(0,0,0,0.05)",
                outline: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              <div
                className="relative z-10 overflow-hidden"
                style={{
                  width: 360,
                  aspectRatio: "360/780",
                  borderRadius: 26,
                  backgroundColor: "#d30ad7",
                }}
              >
                <AppEntryPointSim />
              </div>
            </div>
          </div>
        </div>
      ),
    }],
  },
  { component: "GoalScreen", variants: [], empty: true },
  { component: "Tone", variants: [], empty: true },
  { component: "RefreshSession", variants: [], empty: true },
  {
    component: "DrawerExperience",
    variants: [{
      name: "full-sim",
      description: "Drawer push up/down — My Money back layer + Chat sheet",
      noFrame: true,
      render: () => (
        <div className="flex items-center justify-center" style={{ width: "100%", minHeight: "100vh", padding: 40, backgroundColor: "#0a0a0a" }}>
          <div>
            <div
              className="relative"
              style={{
                borderRadius: 32,
                backgroundColor: "#1a1a1e",
                padding: 6,
                boxShadow: "0 28px 70px rgba(0,0,0,0.16), 0 6px 18px rgba(0,0,0,0.05)",
                outline: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              <div
                className="relative z-10 overflow-hidden"
                style={{
                  width: 360,
                  aspectRatio: "360/780",
                  borderRadius: 26,
                  backgroundColor: "#fff",
                }}
              >
                <DrawerExperienceSim />
              </div>
            </div>
          </div>
        </div>
      ),
    }],
  },
];
