import { type SupabaseClient } from "@supabase/supabase-js";
export declare function getClient(): SupabaseClient;
export interface Contribution {
    id: string;
    name: string;
    type: "skill" | "agent";
    version: string;
    description: string;
    author: string;
    tags: string[];
    license: string;
    created: string;
    updated: string;
    tested_with: string[];
    skill_fields: Record<string, unknown> | null;
    agent_fields: Record<string, unknown> | null;
    raw_readme: string;
    domain: string;
    subdomain: string | null;
    verified: boolean;
    verification_date: string | null;
    verification_model: string | null;
    upvotes: number;
    usage_count: number;
}
export type SortKey = "upvotes" | "usage" | "recent" | "verified";
export declare function searchContributions(options: {
    query?: string;
    hub?: string;
    type?: "skill" | "agent";
    sort?: SortKey;
    verified?: boolean;
    limit?: number;
}): Promise<Contribution[]>;
export declare function getContribution(id: string): Promise<Contribution | null>;
export declare function getContributionFiles(id: string, type: "skill" | "agent"): Promise<{
    name: string;
    url: string;
}[]>;
export declare function downloadFile(url: string): Promise<Buffer>;
export declare function recordInstall(contributionId: string, version: string): Promise<void>;
