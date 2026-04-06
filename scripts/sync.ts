import * as fs from "fs";
import * as path from "path";
import { createClient } from "@supabase/supabase-js";
import { parseAllContributions, type ParsedContribution } from "./parse-contributions";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Hub label format: hub:{domain}/{subdomain}
function parseHubLabels(labels: string[]): { domain?: string; subdomain?: string } {
  for (const label of labels) {
    const match = label.match(/^hub:([^/]+)\/(.+)$/);
    if (match) return { domain: match[1], subdomain: match[2] };
    const domainOnly = label.match(/^hub:([^/]+)$/);
    if (domainOnly) return { domain: domainOnly[1] };
  }
  return {};
}

async function getExistingContributions(): Promise<Map<string, { id: string; domain?: string; subdomain?: string }>> {
  const { data, error } = await supabase
    .from("contributions")
    .select("id, domain, subdomain")
    .is("deleted_at", null);

  if (error) {
    console.error("Failed to fetch existing contributions:", error.message);
    return new Map();
  }

  const map = new Map<string, { id: string; domain?: string; subdomain?: string }>();
  for (const row of data ?? []) {
    map.set(row.id, row);
  }
  return map;
}

function buildRow(c: ParsedContribution, hubLabels: { domain?: string; subdomain?: string }) {
  return {
    id: c.id,
    name: c.name,
    type: c.type,
    version: c.version,
    description: c.description,
    author: c.author,
    tags: c.tags,
    license: c.license,
    created: c.created,
    updated: c.updated,
    tested_with: c.tested_with,
    skill_fields: c.skill_fields,
    agent_fields: c.agent_fields,
    raw_readme: c.raw_readme,
    pricing_model: c.pricing_model,
    price_one_time: c.price_one_time,
    price_subscription: c.price_subscription,
    ...(hubLabels.domain ? { domain: hubLabels.domain } : {}),
    ...(hubLabels.subdomain ? { subdomain: hubLabels.subdomain } : {}),
  };
}

async function uploadFiles(c: ParsedContribution) {
  const storagePath = `contributions/${c.type}s/${c.id}`;

  for (const file of c.files) {
    const fileContent = fs.readFileSync(file.absolutePath);
    const remotePath = `${storagePath}/${file.relativePath}`;

    const { error } = await supabase.storage
      .from("contributions")
      .upload(remotePath, fileContent, { upsert: true });

    if (error) {
      console.error(`  Failed to upload ${remotePath}:`, error.message);
    }
  }
}

async function removeStorageFiles(id: string, type: string) {
  const storagePath = `contributions/${type}s/${id}`;

  const { data: files } = await supabase.storage
    .from("contributions")
    .list(storagePath);

  if (files && files.length > 0) {
    const paths = files.map((f) => `${storagePath}/${f.name}`);
    await supabase.storage.from("contributions").remove(paths);
  }
}

async function sync() {
  const repoRoot = process.argv[2] || process.cwd();
  const labelsArg = process.argv[3] || "";
  const labels = labelsArg ? labelsArg.split(",") : [];
  const hubLabels = parseHubLabels(labels);

  console.log("=== Stage 1: Parse ===");
  const { contributions, validationErrors } = parseAllContributions(repoRoot);

  if (validationErrors.length > 0) {
    console.error("Validation errors found:");
    for (const { id, errors } of validationErrors) {
      console.error(`  ${id}:`);
      for (const err of errors) {
        console.error(`    - ${err}`);
      }
    }
    console.error("Aborting sync due to validation errors.");
    process.exit(1);
  }

  console.log(`Parsed ${contributions.length} contributions (${contributions.filter(c => c.type === "skill").length} skills, ${contributions.filter(c => c.type === "agent").length} agents)`);

  console.log("\n=== Stage 2: Upsert to Database ===");
  const existing = await getExistingContributions();
  const parsedIds = new Set(contributions.map((c) => c.id));

  let inserted = 0;
  let updated = 0;
  let softDeleted = 0;

  for (const c of contributions) {
    const isNew = !existing.has(c.id);
    const row = buildRow(c, isNew ? hubLabels : {});

    if (isNew) {
      // New contribution — insert with defaults for platform fields
      const { error } = await supabase.from("contributions").insert({
        ...row,
        verified: false,
        upvotes: 0,
        usage_count: 0,
      });

      if (error) {
        console.error(`  Failed to insert ${c.id}:`, error.message);
      } else {
        inserted++;
        console.log(`  + ${c.id} (new)`);
      }
    } else {
      // Existing contribution — update contributor fields only, preserve platform fields
      const { error } = await supabase
        .from("contributions")
        .update(row)
        .eq("id", c.id);

      if (error) {
        console.error(`  Failed to update ${c.id}:`, error.message);
      } else {
        updated++;
        console.log(`  ~ ${c.id} (updated)`);
      }
    }
  }

  // Soft-delete contributions that no longer exist in Git
  for (const [id, row] of existing) {
    if (!parsedIds.has(id)) {
      const { error } = await supabase
        .from("contributions")
        .update({ deleted_at: new Date().toISOString() })
        .eq("id", id);

      if (error) {
        console.error(`  Failed to soft-delete ${id}:`, error.message);
      } else {
        softDeleted++;
        console.log(`  - ${id} (soft-deleted)`);
      }
    }
  }

  console.log(`\nDatabase: ${inserted} inserted, ${updated} updated, ${softDeleted} soft-deleted`);

  console.log("\n=== Stage 3: Upload to Storage ===");
  for (const c of contributions) {
    await uploadFiles(c);
    console.log(`  Uploaded ${c.files.length} files for ${c.id}`);
  }

  // Remove storage files for soft-deleted contributions
  for (const [id] of existing) {
    if (!parsedIds.has(id)) {
      // Determine type from existing DB record — we'd need to fetch it
      // For simplicity, try both paths
      await removeStorageFiles(id, "skill");
      await removeStorageFiles(id, "agent");
      console.log(`  Removed storage files for ${id}`);
    }
  }

  // Stage 4: Create Stripe products for premium contributions (optional)
  if (process.env.STRIPE_SECRET_KEY) {
    const Stripe = (await import("stripe")).default;
    const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY);

    console.log("\n=== Stage 4: Stripe Products ===");
    for (const c of contributions) {
      if (c.pricing_model === "free") continue;

      // Check if already has Stripe product
      const { data: existing } = await supabase
        .from("contributions")
        .select("stripe_product_id")
        .eq("id", c.id)
        .single();

      if (existing?.stripe_product_id) {
        console.log(`  Skipped ${c.id} (already has Stripe product)`);
        continue;
      }

      try {
        const product = await stripeClient.products.create({
          name: c.name,
          description: c.description,
          metadata: { contribution_id: c.id },
        });

        const updates: Record<string, unknown> = {
          stripe_product_id: product.id,
        };

        if (
          (c.pricing_model === "one_time" || c.pricing_model === "both") &&
          c.price_one_time
        ) {
          const price = await stripeClient.prices.create({
            product: product.id,
            unit_amount: c.price_one_time,
            currency: "usd",
          });
          updates.stripe_price_one_time_id = price.id;
        }

        if (
          (c.pricing_model === "subscription" || c.pricing_model === "both") &&
          c.price_subscription
        ) {
          const price = await stripeClient.prices.create({
            product: product.id,
            unit_amount: c.price_subscription,
            currency: "usd",
            recurring: { interval: "month" },
          });
          updates.stripe_price_subscription_id = price.id;
        }

        await supabase
          .from("contributions")
          .update(updates)
          .eq("id", c.id);

        console.log(`  Created Stripe product for ${c.id}`);
      } catch (err) {
        console.error(`  Failed to create Stripe product for ${c.id}:`, err);
      }
    }
  }

  console.log("\nSync complete.");
}

sync().catch((err) => {
  console.error("Sync failed:", err);
  process.exit(1);
});
