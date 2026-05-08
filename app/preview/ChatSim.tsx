"use client";

import { useState } from "react";
import Chat, { type ChatMessage, type ChatChip } from "../components/Chat";
import { StatusBar, GestureNav } from "../components/AppChrome";
import { typography } from "../lib/typography";
import { VALENTINO_500 } from "../lib/colors";

const DEMO_MESSAGES: ChatMessage[] = [
  { id: "1", role: "assistant", text: "Hey! I\u2019m Ryan, your personal money companion. I\u2019ve already taken a look at your account \u2014 let me catch you up." },
  { id: "2", role: "user", text: "How much did I spend last month?" },
  { id: "3", role: "assistant", text: "You spent **\u20b978,400** in February \u2014 that\u2019s 12% higher than your average. Food and shopping were your top categories." },
  { id: "4", role: "user", text: "Can I afford a new laptop?" },
  { id: "5", role: "assistant", text: "A laptop around **\u20b975,000** is doable if you stretch it over 3 months. You\u2019d need to save about **\u20b925,000/mo** \u2014 tight but possible if you cut back on dining out.", special: "reality-check" },
  { id: "6", role: "assistant", text: "Your Japan trip goal is **11 days ahead** \u2014 nice work! At this pace you\u2019ll hit \u20b92L by October.", special: "insight" },
];

const DEMO_CHIPS: ChatChip[] = [
  { id: "c1", label: "Tell me more", variant: "primary" },
  { id: "c2", label: "Set a goal", variant: "secondary" },
  { id: "c3", label: "Skip for now" },
];

type Scenario = "conversation" | "chips" | "streaming" | "special";

export default function ChatSim() {
  const [scenario, setScenario] = useState<Scenario>("conversation");

  const messages: ChatMessage[] = (() => {
    switch (scenario) {
      case "conversation":
        return DEMO_MESSAGES.slice(0, 3);
      case "chips":
        return DEMO_MESSAGES.slice(0, 3);
      case "streaming":
        return [
          ...DEMO_MESSAGES.slice(0, 2),
          { ...DEMO_MESSAGES[2], streaming: true },
        ];
      case "special":
        return DEMO_MESSAGES;
    }
  })();

  const chips = scenario === "chips" ? DEMO_CHIPS : [];

  return (
    <div style={{ width: 360, height: 780, overflow: "hidden", display: "flex", flexDirection: "column", background: "#fff" }}>
      <StatusBar />
      <div style={{ padding: "12px 16px 0" }}>
        <p style={{ ...typography.headerH4, color: "rgba(0,0,0,0.9)", margin: 0 }}>Chat</p>
        <p style={{ ...typography.bodySmall, color: "rgba(0,0,0,0.5)", margin: 0, marginTop: 4 }}>
          Bubbles, typewriter, chips, special messages
        </p>
        <div style={{ display: "flex", gap: 8, marginTop: 12, marginBottom: 8 }}>
          {(["conversation", "chips", "streaming", "special"] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setScenario(s)}
              style={{
                padding: "6px 12px",
                borderRadius: 100,
                border: "none",
                background: scenario === s ? VALENTINO_500 : "rgba(0,0,0,0.06)",
                color: scenario === s ? "#fff" : "rgba(0,0,0,0.6)",
                ...typography.caption,
                cursor: "pointer",
                textTransform: "capitalize",
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
      <Chat
        title="Ryan"
        messages={messages}
        chips={chips}
        onChipSelect={() => {}}
        thinkingLabel={scenario === "streaming" ? "Thinking..." : undefined}
        hideStatusBar
      />
      <GestureNav />
    </div>
  );
}
