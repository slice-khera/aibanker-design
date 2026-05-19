"use client";

import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

// ── Section link card ─────────────────────────────────────────
const SECTIONS = [
  { href: "/playground/dls", label: "DLS", description: "Colors, typography, spacing, radii, elevation, primitives" },
  { href: "/playground/components", label: "Components", description: "Overlays, trackers, toggles, and chrome compositions" },
  { href: "/playground/visualizations", label: "Visualizations", description: "Flat data displays rendered on the chat surface" },
  { href: "/playground/widgets", label: "Widgets", description: "Enclosed cards the user can confirm or modify" },
  { href: "/playground/screens", label: "Screens", description: "Individual screens in device frames" },
  { href: "/playground/flows", label: "Flows", description: "Multi-step sims, end to end" },
] as const;

export default function PlaygroundPage() {
  return (
    <div className="px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Playground</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Browse the design system, visualizations, widgets, screens, and flows
        </p>
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">
        {SECTIONS.map(({ href, label, description }) => (
          <Link key={href} href={href} className="no-underline">
            <Card className="h-full transition-colors hover:border-ring">
              <CardHeader>
                <CardTitle className="text-sm">{label}</CardTitle>
                <CardDescription>{description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
