import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// ── Skill definitions ────────────────────────────────────────

type Skill = {
  command: string;
  name: string;
  description: string;
  usage: string;
};

const SKILLS: Skill[] = [
  {
    command: "/design-lint",
    name: "Design lint",
    description: "Ensures DLS tokens flow consistently through viz, widgets, components, screens, and flows. Catches raw hex values, local component copies, and dead code.",
    usage: "Run before committing or after adding new components/screens.",
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
              <p className="text-xs text-muted-foreground/70 mt-1">{skill.usage}</p>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
