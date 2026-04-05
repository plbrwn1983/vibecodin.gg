import type { Contribution } from "./api.js";
import type { ManifestEntry } from "./config.js";
export declare function formatCard(c: Contribution): string;
export declare function formatDetail(c: Contribution): string;
export declare function formatInstalled(id: string, entry: ManifestEntry): string;
export declare function success(msg: string): void;
export declare function error(msg: string): void;
export declare function warn(msg: string): void;
export declare function info(msg: string): void;
