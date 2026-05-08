"use client";

import { useState } from "react";
import PlanMode, { type PlanStep } from "../components/PlanMode";
import { StatusBar, GestureNav } from "../components/AppChrome";
import { typography } from "../lib/typography";
import { VALENTINO_500 } from "../lib/colors";

const STEPS_PENDING: PlanStep[] = [
  { id: "1", label: "Monthly income", value: "\u20b927,000", status: "pending" },
  { id: "2", label: "Obligations", value: "\u20b921,700", status: "pending" },
  { id: "3", label: "Goal amount", value: "\u20b92L", status: "pending" },
  { id: "4", label: "Timeline", value: "Dec 2026", status: "pending" },
  { id: "5", label: "Recommended pace", status: "pending" },
];

const STEPS_IN_PROGRESS: PlanStep[] = [
  { id: "1", label: "Monthly income", value: "\u20b927,000", status: "completed" },
  { id: "2", label: "Obligations", value: "\u20b921,700", status: "completed" },
  { id: "3", label: "Goal amount", value: "\u20b92L", status: "active" },
  { id: "4", label: "Timeline", value: "Dec 2026", status: "pending" },
  { id: "5", label: "Recommended pace", status: "pending" },
];

const STEPS_DONE: PlanStep[] = [
  { id: "1", label: "Monthly income", value: "\u20b927,000", status: "completed" },
  { id: "2", label: "Obligations", value: "\u20b921,700", status: "completed" },
  { id: "3", label: "Goal amount", value: "\u20b92L", status: "completed" },
  { id: "4", label: "Timeline", value: "Dec 2026", status: "completed" },
  { id: "5", label: "Recommended pace", value: "Balanced", status: "completed" },
];

export default function PlanModeSim() {
  const [scenario, setScenario] = useState<"pending" | "progress" | "done">("progress");

  const steps = scenario === "pending" ? STEPS_PENDING : scenario === "progress" ? STEPS_IN_PROGRESS : STEPS_DONE;
  const completed = scenario === "done";

  return (
    <div style={{ width: 360, height: 780, overflow: "hidden", display: "flex", flexDirection: "column", background: "#fff" }}>
      <StatusBar />
      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "12px 16px" }}>
          <p style={{ ...typography.headerH4, color: "rgba(0,0,0,0.9)", margin: 0 }}>Plan Mode</p>
          <p style={{ ...typography.bodySmall, color: "rgba(0,0,0,0.5)", margin: 0, marginTop: 4 }}>
            Step checklist with progress animation
          </p>
        </div>

        {/* Scenario switcher */}
        <div style={{ display: "flex", gap: 8, padding: "0 16px", marginBottom: 16 }}>
          {(["pending", "progress", "done"] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setScenario(s)}
              style={{
                padding: "6px 14px",
                borderRadius: 100,
                border: "none",
                background: scenario === s ? VALENTINO_500 : "rgba(0,0,0,0.06)",
                color: scenario === s ? "#fff" : "rgba(0,0,0,0.6)",
                ...typography.buttonSmall,
                cursor: "pointer",
              }}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Plan mode component */}
        <div style={{ padding: "0 16px" }}>
          <PlanMode steps={steps} visible completed={completed} />
        </div>
      </div>
      <GestureNav />
    </div>
  );
}
