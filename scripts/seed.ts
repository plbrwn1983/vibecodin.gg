import { createClient } from "@supabase/supabase-js";
import { contributions } from "../src/lib/data";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log(`Seeding ${contributions.length} contributions...`);

  const rows = contributions.map((c) => ({
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
    domain: c.domain,
    subdomain: c.subdomain,
    verified: c.verified,
    verification_date: c.verification_date,
    verification_model: c.verification_model,
    upvotes: c.upvotes,
    usage_count: c.usage_count,
  }));

  const { data, error } = await supabase
    .from("contributions")
    .upsert(rows, { onConflict: "id" });

  if (error) {
    console.error("Seed failed:", error.message);
    console.error("Details:", error);
    process.exit(1);
  }

  console.log(`Seeded ${contributions.length} contributions successfully.`);
}

seed();
