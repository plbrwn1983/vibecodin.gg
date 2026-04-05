export declare const SUPABASE_URL = "https://ujgndmhcgsuepmaoyvzj.supabase.co";
export declare const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqZ25kbWhjZ3N1ZXBtYW95dnpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzNDYwODksImV4cCI6MjA5MDkyMjA4OX0.fpelmeXQjfwFHRCak3iBZrr1W7Vfsajg61iNstvW0gs";
export interface AuthData {
    access_token: string;
    refresh_token: string;
    user_id: string;
    github_handle: string;
    expires_at?: number;
}
export interface ManifestEntry {
    type: "skill" | "agent";
    version: string;
    installed_at: string;
    updated_at: string;
    install_path: string;
}
export interface Manifest {
    version: 1;
    installed: Record<string, ManifestEntry>;
}
export declare function getAuth(): AuthData | null;
export declare function saveAuth(data: AuthData): void;
export declare function clearAuth(): void;
export declare function getManifest(): Manifest;
export declare function saveManifest(manifest: Manifest): void;
export declare function getInstallPath(id: string): string;
export declare function ensureInstallDir(id: string): string;
