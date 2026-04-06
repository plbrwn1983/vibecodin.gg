import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function buildReadmeFromRecord(c: Record<string, unknown>): string {
  const lines: string[] = ["---"];

  const add = (key: string, val: unknown) => {
    if (val === undefined || val === null) return;
    if (typeof val === "string") lines.push(`${key}: "${val}"`);
    else if (typeof val === "boolean") lines.push(`${key}: ${val}`);
    else if (Array.isArray(val)) {
      if (val.length === 0) {
        lines.push(`${key}: []`);
      } else if (typeof val[0] === "object") {
        lines.push(`${key}:`);
        for (const item of val) {
          const entries = Object.entries(item as Record<string, string>);
          lines.push(`  - ${entries[0][0]}: "${entries[0][1]}"`);
          for (let i = 1; i < entries.length; i++) {
            lines.push(`    ${entries[i][0]}: "${entries[i][1]}"`);
          }
        }
      } else {
        lines.push(`${key}:`);
        for (const item of val) lines.push(`  - ${item}`);
      }
    }
  };

  const addObj = (key: string, obj: Record<string, unknown>) => {
    lines.push(`${key}:`);
    for (const [k, v] of Object.entries(obj)) {
      if (typeof v === "string") lines.push(`  ${k}: "${v}"`);
      else if (typeof v === "boolean") lines.push(`  ${k}: ${v}`);
      else if (Array.isArray(v)) {
        if (v.length === 0) lines.push(`  ${k}: []`);
        else {
          lines.push(`  ${k}:`);
          for (const item of v) lines.push(`    - ${item}`);
        }
      }
    }
  };

  // Base fields
  add("name", c.name);
  add("type", c.type);
  add("version", c.version);
  add("description", c.description);
  add("author", c.author);
  add("tags", c.tags);
  add("license", c.license);
  add("created", c.created);
  add("updated", c.updated);
  add("tested_with", c.tested_with);

  // Skill fields
  const sf = c.skill_fields as Record<string, unknown> | null;
  if (c.type === "skill" && sf) {
    lines.push("");
    add("trigger", sf.trigger);
    if (sf.commands && Array.isArray(sf.commands) && sf.commands.length > 0) {
      add("commands", sf.commands);
    }
    if (sf.dependencies) addObj("dependencies", sf.dependencies as Record<string, unknown>);
  }

  // Agent fields
  const af = c.agent_fields as Record<string, unknown> | null;
  if (c.type === "agent" && af) {
    lines.push("");
    add("model", af.model);
    add("system_prompt", af.system_prompt);
    add("memory", af.memory);
    if (af.tools) addObj("tools", af.tools as Record<string, unknown>);
    if (af.behaviors) add("behaviors", af.behaviors);
    if (af.dependencies) addObj("dependencies", af.dependencies as Record<string, unknown>);
  }

  lines.push("---");
  lines.push("");

  if (c.raw_readme) {
    lines.push(c.raw_readme as string);
  }

  return lines.join("\n");
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  // Get the full contribution record
  const { data: contribution, error } = await supabase
    .from("contributions")
    .select("*")
    .eq("id", id)
    .is("deleted_at", null)
    .single();

  if (error || !contribution) {
    return NextResponse.json(
      { error: "Contribution not found" },
      { status: 404 }
    );
  }

  // Check purchase access for premium contributions
  if (contribution.pricing_model !== "free") {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Authentication required to download premium content" },
        { status: 401 }
      );
    }

    const { data: hasAccess } = await supabase.rpc("check_purchase_access", {
      p_user_id: user.id,
      p_contribution_id: id,
    });

    if (!hasAccess) {
      return NextResponse.json(
        { error: "Purchase required to download this content" },
        { status: 402 }
      );
    }
  }

  const storagePath = `contributions/${contribution.type}s/${id}`;

  // Try Storage first
  const { data: files } = await supabase.storage
    .from("contributions")
    .list(storagePath);

  const hasStorageFiles = files && files.length > 0 && files.some((f) => f.name !== ".emptyFolderPlaceholder");

  if (hasStorageFiles) {
    const readmeFile = files!.find((f) => f.name === "README.md") ?? files![0];
    const { data: fileData } = await supabase.storage
      .from("contributions")
      .download(`${storagePath}/${readmeFile.name}`);

    if (fileData) {
      return new NextResponse(fileData, {
        headers: {
          "Content-Type": "text/markdown",
          "Content-Disposition": `attachment; filename="README.md"`,
        },
      });
    }
  }

  // Fallback: reconstruct README.md from DB record
  const readme = buildReadmeFromRecord(contribution);

  return new NextResponse(readme, {
    headers: {
      "Content-Type": "text/markdown",
      "Content-Disposition": `attachment; filename="README.md"`,
    },
  });
}
