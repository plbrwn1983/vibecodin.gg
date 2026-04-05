"use client";

import { useState } from "react";

type ContributionType = "skill" | "agent";

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function buildReadme(fields: Record<string, unknown>, body: string): string {
  const lines: string[] = ["---"];

  const add = (key: string, value: unknown) => {
    if (value === undefined || value === null) return;
    if (typeof value === "string") {
      lines.push(`${key}: "${value}"`);
    } else if (typeof value === "boolean") {
      lines.push(`${key}: ${value}`);
    } else if (Array.isArray(value)) {
      if (value.length === 0) {
        lines.push(`${key}: []`);
      } else if (typeof value[0] === "object") {
        lines.push(`${key}:`);
        for (const item of value) {
          const entries = Object.entries(item as Record<string, string>);
          lines.push(`  - ${entries[0][0]}: "${entries[0][1]}"`);
          for (let i = 1; i < entries.length; i++) {
            lines.push(`    ${entries[i][0]}: "${entries[i][1]}"`);
          }
        }
      } else {
        lines.push(`${key}:`);
        for (const item of value) {
          lines.push(`  - ${item}`);
        }
      }
    }
  };

  const addObj = (key: string, obj: Record<string, unknown>) => {
    lines.push(`${key}:`);
    for (const [k, v] of Object.entries(obj)) {
      if (typeof v === "string") {
        lines.push(`  ${k}: "${v}"`);
      } else if (Array.isArray(v)) {
        if (v.length === 0) {
          lines.push(`  ${k}: []`);
        } else {
          lines.push(`  ${k}:`);
          for (const item of v) {
            lines.push(`    - ${item}`);
          }
        }
      }
    }
  };

  // Base fields
  add("name", fields.name);
  add("type", fields.type);
  add("version", fields.version);
  add("description", fields.description);
  add("author", fields.author);
  add("tags", fields.tags);
  add("license", fields.license);
  add("created", fields.created);
  add("updated", fields.updated);
  add("tested_with", fields.tested_with);

  // Skill fields
  if (fields.type === "skill") {
    lines.push("");
    add("trigger", fields.trigger);
    if (
      fields.commands &&
      Array.isArray(fields.commands) &&
      fields.commands.length > 0
    ) {
      add("commands", fields.commands);
    }
    addObj("dependencies", fields.dependencies as Record<string, unknown>);
  }

  // Agent fields
  if (fields.type === "agent") {
    lines.push("");
    add("model", fields.model);
    add("system_prompt", fields.system_prompt);
    add("memory", fields.memory);
    addObj("tools", fields.tools as Record<string, unknown>);
    add("behaviors", fields.behaviors);
    addObj("dependencies", fields.agentDependencies as Record<string, unknown>);
  }

  lines.push("---");
  lines.push("");
  lines.push(body);

  return lines.join("\n");
}

export function SubmitForm({ author }: { author: string }) {
  const today = new Date().toISOString().split("T")[0];
  const [type, setType] = useState<ContributionType>("skill");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [version] = useState("1.0.0");
  const [tags, setTags] = useState("");
  const [license, setLicense] = useState("MIT");
  const [testedWith, setTestedWith] = useState("claude-sonnet-4-6");

  // Skill fields
  const [trigger, setTrigger] = useState("");
  const [commands, setCommands] = useState<{ name: string; description: string }[]>([]);
  const [depNote, setDepNote] = useState(
    "No dependencies required for this skill to function."
  );
  const [depTools, setDepTools] = useState("");
  const [depMcps, setDepMcps] = useState("");
  const [depSkills, setDepSkills] = useState("");

  // Agent fields
  const [model, setModel] = useState("claude-sonnet-4-6");
  const [memory, setMemory] = useState(false);
  const [toolsBuiltin, setToolsBuiltin] = useState("");
  const [toolsMcps, setToolsMcps] = useState("");
  const [behaviors, setBehaviors] = useState("");
  const [agentDepNote, setAgentDepNote] = useState(
    "No dependencies required for this agent to function."
  );
  const [agentDepSkills, setAgentDepSkills] = useState("");
  const [agentDepMcps, setAgentDepMcps] = useState("");
  const [systemPrompt, setSystemPrompt] = useState("");

  // Body
  const [overview, setOverview] = useState("");
  const [usage, setUsage] = useState("");
  const [examples, setExamples] = useState("");
  const [notes, setNotes] = useState("");

  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState<{
    readme: string;
    systemPromptContent?: string;
    dirName: string;
  } | null>(null);

  const slug = slugify(name);

  function splitList(s: string): string[] {
    return s
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  }

  function handleGenerate() {
    const body = [
      `# ${name}`,
      "",
      "## Overview",
      overview,
      "",
      "## Usage",
      usage,
      ...(examples ? ["", "## Examples", examples] : []),
      ...(notes ? ["", "## Notes", notes] : []),
    ].join("\n");

    const fields: Record<string, unknown> = {
      name,
      type,
      version,
      description,
      author,
      tags: splitList(tags),
      license,
      created: today,
      updated: today,
      tested_with: splitList(testedWith),
    };

    if (type === "skill") {
      fields.trigger = trigger;
      fields.commands = commands.filter((c) => c.name);
      fields.dependencies = {
        note: depNote,
        tools: splitList(depTools),
        mcps: splitList(depMcps),
        skills: splitList(depSkills),
      };
    }

    if (type === "agent") {
      fields.model = model;
      fields.system_prompt = "system-prompt.md";
      fields.memory = memory;
      fields.tools = {
        builtin: splitList(toolsBuiltin),
        mcps: splitList(toolsMcps),
      };
      fields.behaviors = splitList(behaviors);
      fields.agentDependencies = {
        note: agentDepNote,
        skills: splitList(agentDepSkills),
        mcps: splitList(agentDepMcps),
      };
    }

    const readme = buildReadme(fields, body);

    setGenerated({
      readme,
      systemPromptContent: type === "agent" ? systemPrompt : undefined,
      dirName: slug,
    });
  }

  function handleDownload() {
    if (!generated) return;

    // Download README.md
    const blob = new Blob([generated.readme], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "README.md";
    a.click();
    URL.revokeObjectURL(url);

    // Download system-prompt.md for agents
    if (generated.systemPromptContent) {
      setTimeout(() => {
        const spBlob = new Blob([generated.systemPromptContent!], {
          type: "text/markdown",
        });
        const spUrl = URL.createObjectURL(spBlob);
        const spA = document.createElement("a");
        spA.href = spUrl;
        spA.download = "system-prompt.md";
        spA.click();
        URL.revokeObjectURL(spUrl);
      }, 500);
    }
  }

  async function handleCreatePR() {
    if (!generated) return;
    setGenerating(true);

    try {
      const res = await fetch("/api/submit-pr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          dirName: generated.dirName,
          readme: generated.readme,
          systemPrompt: generated.systemPromptContent,
        }),
      });

      const data = await res.json();

      if (data.error) {
        alert(`Error: ${data.error}`);
      } else if (data.pr_url) {
        window.open(data.pr_url, "_blank");
      }
    } catch {
      alert("Failed to create PR. Please download files and submit manually.");
    } finally {
      setGenerating(false);
    }
  }

  function addCommand() {
    setCommands([...commands, { name: "", description: "" }]);
  }

  function updateCommand(
    index: number,
    field: "name" | "description",
    value: string
  ) {
    const updated = [...commands];
    updated[index][field] = value;
    setCommands(updated);
  }

  function removeCommand(index: number) {
    setCommands(commands.filter((_, i) => i !== index));
  }

  const descChars = description.length;

  const inputClass =
    "w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-blue-500";
  const labelClass = "block text-xs font-medium text-foreground mb-1";
  const helpClass = "text-xs text-muted-foreground mt-1";

  if (generated) {
    return (
      <div className="mt-8 space-y-6">
        <div className="rounded-lg border border-border bg-card p-4">
          <h3 className="text-sm font-medium text-foreground">
            Generated: {generated.dirName}/
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Directory: contributions/{type}s/{generated.dirName}/
          </p>
        </div>

        <div>
          <h4 className="text-xs font-medium text-foreground mb-2">
            README.md Preview
          </h4>
          <pre className="max-h-96 overflow-auto rounded-lg border border-border bg-background p-4 text-xs text-muted-foreground whitespace-pre-wrap">
            {generated.readme}
          </pre>
        </div>

        {generated.systemPromptContent && (
          <div>
            <h4 className="text-xs font-medium text-foreground mb-2">
              system-prompt.md Preview
            </h4>
            <pre className="max-h-48 overflow-auto rounded-lg border border-border bg-background p-4 text-xs text-muted-foreground whitespace-pre-wrap">
              {generated.systemPromptContent}
            </pre>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={handleDownload}
            className="rounded-md border border-border px-4 py-2 text-xs font-medium text-foreground hover:bg-muted transition-colors"
          >
            Download Files
          </button>
          <button
            onClick={handleCreatePR}
            disabled={generating}
            className={`rounded-md bg-blue-600 px-4 py-2 text-xs font-medium text-white hover:bg-blue-500 transition-colors ${generating ? "opacity-50" : ""}`}
          >
            {generating ? "Creating PR..." : "Create Pull Request"}
          </button>
          <button
            onClick={() => setGenerated(null)}
            className="rounded-md px-4 py-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Edit
          </button>
        </div>

        <p className="text-xs text-muted-foreground">
          You can also submit manually: fork{" "}
          <a
            href="https://github.com/plbrwn1983/vibecodin.gg"
            className="text-blue-400 hover:underline"
            target="_blank"
          >
            plbrwn1983/vibecodin.gg
          </a>
          , add your files to contributions/{type}s/{generated.dirName}/, and
          open a PR.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleGenerate();
      }}
      className="mt-8 space-y-6"
    >
      {/* Type selector */}
      <div>
        <label className={labelClass}>Type</label>
        <div className="flex gap-2">
          {(["skill", "agent"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              className={`rounded-md px-4 py-2 text-xs font-medium transition-colors ${
                type === t
                  ? "bg-blue-600 text-white"
                  : "border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Base fields */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className={labelClass}>Name</label>
          <input
            className={inputClass}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Email Subject Line Optimizer"
            required
          />
          {name && (
            <p className={helpClass}>
              Directory: contributions/{type}s/{slug}/
            </p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label className={labelClass}>Description</label>
          <input
            className={inputClass}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="One sentence describing what this does and when to use it."
            maxLength={280}
            required
          />
          <p
            className={`${helpClass} ${descChars > 280 ? "text-red-400" : ""}`}
          >
            {descChars}/280 characters
          </p>
        </div>

        <div>
          <label className={labelClass}>Tags</label>
          <input
            className={inputClass}
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="email, marketing, optimization"
            required
          />
          <p className={helpClass}>Comma-separated, 2-10 tags</p>
        </div>

        <div>
          <label className={labelClass}>Tested With</label>
          <input
            className={inputClass}
            value={testedWith}
            onChange={(e) => setTestedWith(e.target.value)}
            placeholder="claude-sonnet-4-6"
            required
          />
          <p className={helpClass}>Comma-separated model IDs</p>
        </div>

        <div>
          <label className={labelClass}>License</label>
          <select
            className={inputClass}
            value={license}
            onChange={(e) => setLicense(e.target.value)}
          >
            <option value="MIT">MIT</option>
            <option value="Apache-2.0">Apache-2.0</option>
            <option value="CC-BY-4.0">CC-BY-4.0</option>
            <option value="CC-BY-SA-4.0">CC-BY-SA-4.0</option>
            <option value="GPL-3.0">GPL-3.0</option>
          </select>
        </div>

        <div>
          <label className={labelClass}>Author</label>
          <input className={inputClass} value={author} disabled />
        </div>
      </div>

      {/* Skill-specific fields */}
      {type === "skill" && (
        <fieldset className="space-y-4 rounded-lg border border-border p-4">
          <legend className="px-2 text-xs font-medium text-foreground">
            Skill Fields
          </legend>

          <div>
            <label className={labelClass}>Trigger</label>
            <textarea
              className={inputClass}
              rows={2}
              value={trigger}
              onChange={(e) => setTrigger(e.target.value)}
              placeholder="Use this skill when a user asks to..."
              required
            />
            <p className={helpClass}>
              When should this skill be invoked?
            </p>
          </div>

          <div>
            <label className={labelClass}>
              Commands{" "}
              <span className="font-normal text-muted-foreground">
                (optional)
              </span>
            </label>
            {commands.map((cmd, i) => (
              <div key={i} className="mb-2 flex gap-2">
                <input
                  className={inputClass}
                  value={cmd.name}
                  onChange={(e) => updateCommand(i, "name", e.target.value)}
                  placeholder="Command name"
                />
                <input
                  className={inputClass}
                  value={cmd.description}
                  onChange={(e) =>
                    updateCommand(i, "description", e.target.value)
                  }
                  placeholder="Description"
                />
                <button
                  type="button"
                  onClick={() => removeCommand(i)}
                  className="shrink-0 text-xs text-muted-foreground hover:text-red-400"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addCommand}
              className="text-xs text-blue-400 hover:underline"
            >
              + Add command
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className={labelClass}>Dependencies Note</label>
              <input
                className={inputClass}
                value={depNote}
                onChange={(e) => setDepNote(e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>Required Tools</label>
              <input
                className={inputClass}
                value={depTools}
                onChange={(e) => setDepTools(e.target.value)}
                placeholder="Read, Write, Bash"
              />
              <p className={helpClass}>Comma-separated</p>
            </div>
            <div>
              <label className={labelClass}>Required MCPs</label>
              <input
                className={inputClass}
                value={depMcps}
                onChange={(e) => setDepMcps(e.target.value)}
                placeholder="gmail, slack"
              />
            </div>
            <div>
              <label className={labelClass}>Required Skills</label>
              <input
                className={inputClass}
                value={depSkills}
                onChange={(e) => setDepSkills(e.target.value)}
                placeholder="other-skill-id"
              />
            </div>
          </div>
        </fieldset>
      )}

      {/* Agent-specific fields */}
      {type === "agent" && (
        <fieldset className="space-y-4 rounded-lg border border-border p-4">
          <legend className="px-2 text-xs font-medium text-foreground">
            Agent Fields
          </legend>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Model</label>
              <input
                className={inputClass}
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="claude-sonnet-4-6"
                required
              />
            </div>
            <div className="flex items-end gap-2">
              <label className="flex items-center gap-2 text-xs text-foreground">
                <input
                  type="checkbox"
                  checked={memory}
                  onChange={(e) => setMemory(e.target.checked)}
                  className="rounded"
                />
                Uses persistent memory
              </label>
            </div>
          </div>

          <div>
            <label className={labelClass}>System Prompt</label>
            <textarea
              className={inputClass}
              rows={6}
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              placeholder="You are a specialized agent that..."
              required
            />
            <p className={helpClass}>
              This will be saved as system-prompt.md
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Built-in Tools</label>
              <input
                className={inputClass}
                value={toolsBuiltin}
                onChange={(e) => setToolsBuiltin(e.target.value)}
                placeholder="Read, Write, Bash, WebSearch"
              />
            </div>
            <div>
              <label className={labelClass}>MCP Tools</label>
              <input
                className={inputClass}
                value={toolsMcps}
                onChange={(e) => setToolsMcps(e.target.value)}
                placeholder="gmail, slack"
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Behaviors</label>
            <textarea
              className={inputClass}
              rows={3}
              value={behaviors}
              onChange={(e) => setBehaviors(e.target.value)}
              placeholder="Never sends emails without user confirmation, Always generates multiple variants"
              required
            />
            <p className={helpClass}>
              Comma-separated behavioral rules. Minimum 1.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className={labelClass}>Dependencies Note</label>
              <input
                className={inputClass}
                value={agentDepNote}
                onChange={(e) => setAgentDepNote(e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>Required Skills</label>
              <input
                className={inputClass}
                value={agentDepSkills}
                onChange={(e) => setAgentDepSkills(e.target.value)}
                placeholder="other-skill-id"
              />
            </div>
            <div>
              <label className={labelClass}>Required MCPs</label>
              <input
                className={inputClass}
                value={agentDepMcps}
                onChange={(e) => setAgentDepMcps(e.target.value)}
                placeholder="gmail, slack"
              />
            </div>
          </div>
        </fieldset>
      )}

      {/* Documentation body */}
      <fieldset className="space-y-4 rounded-lg border border-border p-4">
        <legend className="px-2 text-xs font-medium text-foreground">
          Documentation
        </legend>

        <div>
          <label className={labelClass}>Overview</label>
          <textarea
            className={inputClass}
            rows={3}
            value={overview}
            onChange={(e) => setOverview(e.target.value)}
            placeholder="What does this contribution do? Describe the core functionality."
            required
          />
        </div>

        <div>
          <label className={labelClass}>Usage</label>
          <textarea
            className={inputClass}
            rows={3}
            value={usage}
            onChange={(e) => setUsage(e.target.value)}
            placeholder="How does the user invoke this? What should they expect?"
            required
          />
        </div>

        <div>
          <label className={labelClass}>
            Examples{" "}
            <span className="font-normal text-muted-foreground">
              (optional)
            </span>
          </label>
          <textarea
            className={inputClass}
            rows={3}
            value={examples}
            onChange={(e) => setExamples(e.target.value)}
            placeholder={'- "Clean up my inbox"\n- "Triage my Gmail"'}
          />
        </div>

        <div>
          <label className={labelClass}>
            Notes{" "}
            <span className="font-normal text-muted-foreground">
              (optional)
            </span>
          </label>
          <textarea
            className={inputClass}
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Safety considerations, limitations, etc."
          />
        </div>
      </fieldset>

      <button
        type="submit"
        className="rounded-md bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-500 transition-colors"
      >
        Generate Contribution
      </button>
    </form>
  );
}
