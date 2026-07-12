import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { TemplateSet } from "../../content/types";

const LANGS: { key: keyof TemplateSet; label: string }[] = [
  { key: "java", label: "Java" },
  { key: "python", label: "Python" },
  { key: "cpp", label: "C++" },
];

export default function TemplateTabs({ templates }: { templates: TemplateSet }) {
  const available = LANGS.filter((l) => templates[l.key]);
  if (available.length === 0) return null;

  const codeBlock = (code: string) => (
    <pre className="overflow-x-auto rounded-lg border border-border bg-card p-4 font-mono text-[13px] leading-relaxed">
      {code}
    </pre>
  );

  if (available.length === 1) return codeBlock(templates[available[0].key]);

  return (
    <Tabs defaultValue={available[0].key} className="mt-2">
      <TabsList className="h-8 bg-transparent p-0 gap-1">
        {available.map((l) => (
          <TabsTrigger
            key={l.key}
            value={l.key}
            className="h-8 rounded-md border border-transparent px-3 font-mono text-xs data-[state=active]:border-border data-[state=active]:bg-card"
          >
            {l.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {available.map((l) => (
        <TabsContent key={l.key} value={l.key}>
          {codeBlock(templates[l.key])}
        </TabsContent>
      ))}
    </Tabs>
  );
}
