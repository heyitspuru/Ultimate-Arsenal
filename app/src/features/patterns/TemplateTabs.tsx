import { useState } from "react";
import type { TemplateSet } from "../../content/types";

const LANGS: { key: keyof TemplateSet; label: string }[] = [
  { key: "java", label: "Java" },
  { key: "python", label: "Python" },
  { key: "cpp", label: "C++" },
];

export default function TemplateTabs({ templates }: { templates: TemplateSet }) {
  const available = LANGS.filter((l) => templates[l.key]);
  const [lang, setLang] = useState<keyof TemplateSet>(available[0]?.key ?? "java");
  if (available.length === 0) return null;
  const active = templates[lang] ? lang : available[0].key;
  return (
    <div>
      {available.length > 1 && (
        <div className="tabs">
          {available.map((l) => (
            <button
              key={l.key}
              className={active === l.key ? "active" : ""}
              onClick={() => setLang(l.key)}
            >
              {l.label}
            </button>
          ))}
        </div>
      )}
      <pre className="code">{templates[active]}</pre>
    </div>
  );
}
