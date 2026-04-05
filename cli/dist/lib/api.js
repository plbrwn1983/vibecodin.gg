import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_ANON_KEY, getAuth } from "./config.js";
let client = null;
export function getClient() {
    if (!client) {
        const auth = getAuth();
        client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
            global: {
                headers: auth ? { Authorization: `Bearer ${auth.access_token}` } : {},
            },
        });
    }
    return client;
}
export async function searchContributions(options) {
    const supabase = getClient();
    let q = supabase.from("contributions").select("*").is("deleted_at", null);
    if (options.query) {
        q = q.or(`name.ilike.%${options.query}%,description.ilike.%${options.query}%`);
    }
    if (options.hub) {
        q = q.eq("domain", options.hub);
    }
    if (options.type) {
        q = q.eq("type", options.type);
    }
    if (options.verified) {
        q = q.eq("verified", true);
    }
    // Sort
    switch (options.sort ?? "upvotes") {
        case "upvotes":
            q = q.order("upvotes", { ascending: false });
            break;
        case "usage":
            q = q.order("usage_count", { ascending: false });
            break;
        case "recent":
            q = q.order("updated", { ascending: false });
            break;
        case "verified":
            q = q
                .order("verified", { ascending: false })
                .order("upvotes", { ascending: false });
            break;
    }
    if (options.limit) {
        q = q.limit(options.limit);
    }
    else {
        q = q.limit(20);
    }
    const { data, error } = await q;
    if (error) {
        throw new Error(`Search failed: ${error.message}`);
    }
    return data;
}
export async function getContribution(id) {
    const supabase = getClient();
    const { data, error } = await supabase
        .from("contributions")
        .select("*")
        .eq("id", id)
        .is("deleted_at", null)
        .single();
    if (error)
        return null;
    return data;
}
export async function getContributionFiles(id, type) {
    const supabase = getClient();
    const storagePath = `contributions/${type}s/${id}`;
    const { data, error } = await supabase.storage
        .from("contributions")
        .list(storagePath);
    if (error || !data)
        return [];
    return data.map((file) => ({
        name: file.name,
        url: `${SUPABASE_URL}/storage/v1/object/public/contributions/${storagePath}/${file.name}`,
    }));
}
export async function downloadFile(url) {
    const res = await fetch(url);
    if (!res.ok) {
        throw new Error(`Failed to download ${url}: ${res.status}`);
    }
    return Buffer.from(await res.arrayBuffer());
}
export async function recordInstall(contributionId, version) {
    const auth = getAuth();
    if (!auth)
        return;
    const supabase = getClient();
    await supabase.from("installs").upsert({
        user_id: auth.user_id,
        contribution_id: contributionId,
        version,
    }, { onConflict: "user_id,contribution_id" });
}
