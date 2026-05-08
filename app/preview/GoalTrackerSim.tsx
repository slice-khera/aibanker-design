"use client";

import GoalTracker, { type GoalIndicatorData } from "../components/GoalTracker";
import { StatusBar, GestureNav } from "../components/AppChrome";
import { typography } from "../lib/typography";

const SCENARIOS: { label: string; goals: GoalIndicatorData[]; singleVariant?: "pct" | "icon" }[] = [
  { label: "No goals", goals: [] },
  {
    label: "Single \u2014 percentage",
    singleVariant: "pct",
    goals: [
      { id: "1", name: "Trip to Japan", pct: 42, status: "on-track", icon: "\u2708\ufe0f", daysLabel: "4 months left", saved: 84000, target: 200000, ringColor: "#d30ad7", endDate: "Dec 2026", monthlyAmount: 10000, gradient: "linear-gradient(135deg, #fae2fa 0%, #d30ad7 100%)", heroEmoji: "\u2708\ufe0f", heroScene: "japan" },
    ],
  },
  {
    label: "Single \u2014 icon",
    singleVariant: "icon",
    goals: [
      { id: "1", name: "Trip to Japan", pct: 42, status: "on-track", icon: "\u2708\ufe0f", daysLabel: "4 months left", saved: 84000, target: 200000, ringColor: "#d30ad7", endDate: "Dec 2026", monthlyAmount: 10000, gradient: "linear-gradient(135deg, #fae2fa 0%, #d30ad7 100%)", heroEmoji: "\u2708\ufe0f", heroScene: "japan" },
    ],
  },
  {
    label: "Single \u2014 behind",
    singleVariant: "pct",
    goals: [
      { id: "1", name: "Trip to Japan", pct: 42, status: "behind", icon: "\u2708\ufe0f", daysLabel: "15 days behind", saved: 84000, target: 200000, ringColor: "#d30ad7", endDate: "Dec 2026", monthlyAmount: 10000, gradient: "linear-gradient(135deg, #fae2fa 0%, #d30ad7 100%)", heroEmoji: "\u2708\ufe0f", heroScene: "japan" },
    ],
  },
  {
    label: "Two goals",
    goals: [
      { id: "1", name: "Trip to Japan", pct: 62, status: "ahead", icon: "\u2708\ufe0f", daysLabel: "11 days ahead", saved: 124000, target: 200000, ringColor: "#d30ad7", endDate: "Dec 2026", monthlyAmount: 10000, gradient: "linear-gradient(135deg, #fae2fa 0%, #d30ad7 100%)", heroEmoji: "\u2708\ufe0f", heroScene: "japan" },
      { id: "2", name: "Emergency Fund", pct: 35, status: "on-track", icon: "\ud83d\udee1\ufe0f", daysLabel: "On track", saved: 175000, target: 500000, ringColor: "#ff9a17", endDate: "Mar 2027", monthlyAmount: 15000, gradient: "linear-gradient(135deg, #fff3e3 0%, #ff9a17 100%)", heroEmoji: "\ud83d\udee1\ufe0f" },
    ],
  },
  {
    label: "Three goals",
    goals: [
      { id: "1", name: "Trip to Japan", pct: 42, status: "on-track", icon: "\u2708\ufe0f", daysLabel: "4 months left", saved: 84000, target: 200000, ringColor: "#d30ad7", endDate: "Dec 2026", monthlyAmount: 10000, gradient: "linear-gradient(135deg, #fae2fa 0%, #d30ad7 100%)", heroEmoji: "\u2708\ufe0f", heroScene: "japan" },
      { id: "2", name: "Emergency Fund", pct: 78, status: "ahead", icon: "\ud83d\udee1\ufe0f", daysLabel: "12 days ahead", saved: 390000, target: 500000, ringColor: "#ff9a17", endDate: "Mar 2027", monthlyAmount: 15000, gradient: "linear-gradient(135deg, #fff3e3 0%, #ff9a17 100%)", heroEmoji: "\ud83d\udee1\ufe0f" },
      { id: "3", name: "New Laptop", pct: 65, status: "on-track", icon: "\ud83d\udcbb", daysLabel: "On track", saved: 48750, target: 75000, ringColor: "#00a63e", endDate: "Sep 2026", monthlyAmount: 5000, gradient: "linear-gradient(135deg, #e0f4e8 0%, #00a63e 100%)", heroEmoji: "\ud83d\udcbb" },
    ],
  },
];

export default function GoalTrackerSim() {
  return (
    <div style={{ width: 360, height: 780, overflow: "hidden", display: "flex", flexDirection: "column", background: "#fff" }}>
      <StatusBar />
      <div style={{ flex: 1, overflowY: "auto", padding: "12px 16px", display: "flex", flexDirection: "column", gap: 32 }}>
        <div>
          <p style={{ ...typography.headerH4, color: "rgba(0,0,0,0.9)", margin: 0 }}>Goal Tracker</p>
          <p style={{ ...typography.bodySmall, color: "rgba(0,0,0,0.5)", margin: 0, marginTop: 4 }}>
            {SCENARIOS.length} scenarios
          </p>
        </div>
        {SCENARIOS.map((s) => (
          <div key={s.label}>
            <p style={{ ...typography.metadata, textTransform: "uppercase", color: "rgba(0,0,0,0.4)", margin: 0, marginBottom: 12 }}>
              {s.label}
            </p>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <GoalTracker
                goals={s.goals}
                onGoalTap={() => {}}
                singleVariant={s.singleVariant}
              />
            </div>
          </div>
        ))}
        <div style={{ height: 24 }} />
      </div>
      <GestureNav />
    </div>
  );
}
