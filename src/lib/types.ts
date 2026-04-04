export interface SkillFields {
  trigger: string;
  commands?: { name: string; description: string }[];
  dependencies: {
    note: string;
    tools: string[];
    mcps: string[];
    skills: string[];
  };
}

export interface AgentFields {
  model: string;
  system_prompt: string;
  memory: boolean;
  tools: {
    builtin: string[];
    mcps: string[];
  };
  behaviors: string[];
  dependencies: {
    note: string;
    skills: string[];
    mcps: string[];
  };
}

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
  skill_fields: SkillFields | null;
  agent_fields: AgentFields | null;
  raw_readme: string;
  domain: string;
  subdomain: string;
  verified: boolean;
  verification_date: string | null;
  verification_model: string | null;
  upvotes: number;
  usage_count: number;
}

export interface Subdomain {
  name: string;
  slug: string;
  description: string;
}

export interface Hub {
  name: string;
  slug: string;
  description: string;
  subdomains: Subdomain[];
}
