import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// ── Skill definitions ────────────────────────────────────────

type Skill = {
  command: string;
  name: string;
  description: string;
  checks: string[];
};

const SKILLS: Skill[] = [
  {
    command: "/design-lint",
    name: "Design lint",
    description: "Audit and fix DLS 2.0 token compliance across the pipeline (DLS \u2192 Components \u2192 Screens \u2192 Flows)",
    checks: [
      "Raw hex colors \u2192 DLS color tokens",
      "Hardcoded rgba \u2192 ALPHA_BLACK / semantic tokens",
      "Hardcoded borderRadius \u2192 RADIUS tokens",
      "Local component copies \u2192 shared imports",
      "Orphaned / dead sim files",
    ],
  },
];

// ── Page ──────────────────────────────────────────────────────

export default function SkillsPage() {
  return (
    <div className="px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Skills</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Custom Claude Code slash commands for this project
        </p>
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-4">
        {SKILLS.map((skill) => (
          <Card key={skill.command}>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CardTitle className="text-sm">{skill.name}</CardTitle>
                <Badge variant="secondary" className="font-mono text-xs">{skill.command}</Badge>
              </div>
              <CardDescription>{skill.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-1">
                {skill.checks.map((check) => (
                  <li key={check} className="flex items-start gap-2">
                    <span className="text-muted-foreground/50 mt-0.5">-</span>
                    {check}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
