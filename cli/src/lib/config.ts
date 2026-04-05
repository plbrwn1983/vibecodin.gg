import * as fs from "node:fs";
import * as path from "node:path";
import * as os from "node:os";

// Paths
const VIBECODIN_DIR = path.join(os.homedir(), ".vibecodin");
const AUTH_FILE = path.join(VIBECODIN_DIR, "auth.json");
const MANIFEST_FILE = path.join(VIBECODIN_DIR, "manifest.json");
const SKILLS_DIR = path.join(process.cwd(), ".claude", "skills");

export const SUPABASE_URL = "https://ujgndmhcgsuepmaoyvzj.supabase.co";
export const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqZ25kbWhjZ3N1ZXBtYW95dnpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzNDYwODksImV4cCI6MjA5MDkyMjA4OX0.fpelmeXQjfwFHRCak3iBZrr1W7Vfsajg61iNstvW0gs";

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

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Auth
export function getAuth(): AuthData | null {
  if (!fs.existsSync(AUTH_FILE)) return null;
  try {
    return JSON.parse(fs.readFileSync(AUTH_FILE, "utf-8"));
  } catch {
    return null;
  }
}

export function saveAuth(data: AuthData) {
  ensureDir(VIBECODIN_DIR);
  fs.writeFileSync(AUTH_FILE, JSON.stringify(data, null, 2));
}

export function clearAuth() {
  if (fs.existsSync(AUTH_FILE)) {
    fs.unlinkSync(AUTH_FILE);
  }
}

// Manifest
export function getManifest(): Manifest {
  if (!fs.existsSync(MANIFEST_FILE)) {
    return { version: 1, installed: {} };
  }
  try {
    return JSON.parse(fs.readFileSync(MANIFEST_FILE, "utf-8"));
  } catch {
    return { version: 1, installed: {} };
  }
}

export function saveManifest(manifest: Manifest) {
  ensureDir(VIBECODIN_DIR);
  fs.writeFileSync(MANIFEST_FILE, JSON.stringify(manifest, null, 2));
}

// Install paths
export function getInstallPath(id: string): string {
  return path.join(SKILLS_DIR, id);
}

export function ensureInstallDir(id: string): string {
  const dir = getInstallPath(id);
  ensureDir(dir);
  return dir;
}
