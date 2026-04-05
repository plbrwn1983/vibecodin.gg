import { type SortKey } from "../lib/api.js";
export declare function search(query: string | undefined, options: {
    hub?: string;
    type?: "skill" | "agent";
    sort?: SortKey;
    verified?: boolean;
}): Promise<void>;
