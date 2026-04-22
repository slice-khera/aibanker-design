"use client";

import { useState } from "react";
import type { WrappedSlide } from "../data/flows";
import WrappedCarousel from "../components/WrappedCarousel";

// ── Hardcoded slides (matches computeWrappedSlides shape) ──────

const STORY_SLIDES: WrappedSlide[] = [
  {
    id: "wrapped-1",
    headline: "Behind the numbers",
    punchline: "6 months\n₹1.2Cr\n847 transactions\n\nHere's what we found hiding in them.",
  },
  {
    id: "wrapped-2",
    headline: "We found your Sri Lanka trip",
    punchline:
      "Jan 29 — Colombo airport ATM\nFeb 1 — Bentota beach resort\n5 ATM runs the day you got back",
    stat: {
      label: "",
      value: "₹68k",
      caption: "in cash and charges across the trip. Plus ₹24k pulled from one ATM on Feb 3.",
    },
  },
  {
    id: "wrapped-3",
    headline: "5 credit cards. One account.",
    punchline:
      "HDFC. Amex. OneCard. Plus two through CRED. All draining from here.",
    stat: {
      label: "",
      value: "₹4.2L",
      caption: "in CC payments. Your real spending life is invisible to this account.",
    },
  },
  {
    id: "wrapped-4",
    headline: "Something changed in February",
    punchline: "Your monthly inflow jumped 2.3x for three months. Then quietly dropped back.",
    stat: {
      label: "",
      value: "₹1.8L",
      caption: "peak months vs ₹78k normally. Bonus? Side income? Your account noticed.",
    },
  },
  {
    id: "wrapped-5",
    headline: "14 debits fire without you",
    punchline:
      "SIPs, mandates, mutual funds — your money has a day job you don't think about.",
    stat: {
      label: "",
      value: "₹2.1L",
      caption: "across 4 platforms. 18% of every rupee earned, on autopilot.",
    },
  },
  {
    id: "wrapped-6",
    headline: "Ready for reality?",
    punchline: "Tell me what you think you do. Then I'll show you the receipts.",
  },
];

// ── Sim ────────────────────────────────────────────────────────

export default function WrappedStorySim() {
  const [completed, setCompleted] = useState(false);

  if (completed) {
    return (
      <div className="flex h-full items-center justify-center bg-black px-8">
        <p className="text-white/70 text-center" style={{ fontSize: 16 }}>
          Story complete — tap to replay
        </p>
        <button
          type="button"
          className="absolute inset-0 opacity-0"
          onClick={() => setCompleted(false)}
          aria-label="Replay"
        />
      </div>
    );
  }

  return (
    <WrappedCarousel
      key={completed ? "done" : "playing"}
      slides={STORY_SLIDES}
      onComplete={() => setCompleted(true)}
    />
  );
}
