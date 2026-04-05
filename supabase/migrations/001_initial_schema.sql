-- ============================================================
-- vibecodin.gg — Initial Database Schema
-- Based on docs/ARCHITECTURE.md
-- ============================================================

-- ── Enums ────────────────────────────────────────────────────

create type contribution_type as enum ('skill', 'agent');
create type subscription_scope as enum ('hub', 'subdomain');

-- ── Users ────────────────────────────────────────────────────

create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  github_handle text unique not null,
  display_name text,
  avatar_url text,
  banned boolean not null default false,
  banned_at timestamptz,
  banned_by uuid references public.users(id),
  ban_reason text,
  created_at timestamptz not null default now()
);

alter table public.users enable row level security;

create policy "Users are publicly readable"
  on public.users for select
  using (true);

create policy "Users can update their own profile"
  on public.users for update
  using (auth.uid() = id);

-- ── Contributions ────────────────────────────────────────────

create table public.contributions (
  id text primary key,
  name text not null,
  type contribution_type not null,
  version text not null,
  description text not null,
  author text not null,
  tags text[] not null default '{}',
  license text not null,
  created date not null,
  updated date not null,
  tested_with text[] not null default '{}',
  skill_fields jsonb,
  agent_fields jsonb,
  raw_readme text not null default '',
  domain text not null,
  subdomain text,
  verified boolean not null default false,
  verification_date date,
  verification_model text,
  upvotes integer not null default 0,
  usage_count integer not null default 0,
  hidden boolean not null default false,
  hidden_at timestamptz,
  hidden_by uuid references public.users(id),
  thread_locked boolean not null default false,
  thread_locked_at timestamptz,
  thread_locked_by uuid references public.users(id),
  synced_at timestamptz not null default now(),
  deleted_at timestamptz
);

alter table public.contributions enable row level security;

create policy "Contributions are publicly readable"
  on public.contributions for select
  using (deleted_at is null and hidden = false);

-- Indexes for search and filtering
create index idx_contributions_domain on public.contributions(domain);
create index idx_contributions_domain_subdomain on public.contributions(domain, subdomain);
create index idx_contributions_type on public.contributions(type);
create index idx_contributions_tags on public.contributions using gin(tags);
create index idx_contributions_search on public.contributions
  using gin(to_tsvector('english', coalesce(description, '') || ' ' || coalesce(raw_readme, '')));

-- ── Votes ────────────────────────────────────────────────────

create table public.votes (
  user_id uuid not null references public.users(id) on delete cascade,
  contribution_id text not null references public.contributions(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, contribution_id)
);

alter table public.votes enable row level security;

create policy "Votes are publicly readable"
  on public.votes for select
  using (true);

create policy "Authenticated users can vote"
  on public.votes for insert
  with check (auth.uid() = user_id);

create policy "Users can remove their own votes"
  on public.votes for delete
  using (auth.uid() = user_id);

-- Trigger: update materialized upvote count
create or replace function public.update_upvote_count()
returns trigger as $$
begin
  if (TG_OP = 'INSERT') then
    update public.contributions
      set upvotes = upvotes + 1
      where id = NEW.contribution_id;
    return NEW;
  elsif (TG_OP = 'DELETE') then
    update public.contributions
      set upvotes = upvotes - 1
      where id = OLD.contribution_id;
    return OLD;
  end if;
  return null;
end;
$$ language plpgsql security definer;

create trigger trg_update_upvotes
  after insert or delete on public.votes
  for each row execute function public.update_upvote_count();

-- ── Comments ─────────────────────────────────────────────────

create table public.comments (
  id uuid primary key default gen_random_uuid(),
  contribution_id text not null references public.contributions(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  parent_id uuid references public.comments(id),
  body text not null,
  deleted_at timestamptz,
  deleted_by uuid references public.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.comments enable row level security;

create policy "Comments are publicly readable"
  on public.comments for select
  using (deleted_at is null);

create policy "Authenticated users can comment"
  on public.comments for insert
  with check (auth.uid() = user_id);

create policy "Users can edit their own comments"
  on public.comments for update
  using (auth.uid() = user_id);

create index idx_comments_contribution on public.comments(contribution_id);

-- ── Subscriptions ────────────────────────────────────────────

create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  scope_type subscription_scope not null,
  scope_value text not null,
  created_at timestamptz not null default now(),
  unique (user_id, scope_type, scope_value)
);

alter table public.subscriptions enable row level security;

create policy "Users can read their own subscriptions"
  on public.subscriptions for select
  using (auth.uid() = user_id);

create policy "Users can manage their own subscriptions"
  on public.subscriptions for insert
  with check (auth.uid() = user_id);

create policy "Users can delete their own subscriptions"
  on public.subscriptions for delete
  using (auth.uid() = user_id);

-- ── Hub Moderators ───────────────────────────────────────────

create table public.hub_moderators (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  domain text not null,
  appointed_at timestamptz not null default now(),
  appointed_by uuid references public.users(id)
);

alter table public.hub_moderators enable row level security;

create policy "Hub moderators are publicly readable"
  on public.hub_moderators for select
  using (true);

create index idx_hub_moderators_domain on public.hub_moderators(domain);

-- ── Installs ─────────────────────────────────────────────────

create table public.installs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  contribution_id text not null references public.contributions(id) on delete cascade,
  version text not null,
  installed_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  active boolean not null default true,
  unique (user_id, contribution_id)
);

alter table public.installs enable row level security;

create policy "Users can read their own installs"
  on public.installs for select
  using (auth.uid() = user_id);

create policy "Authenticated users can install"
  on public.installs for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own installs"
  on public.installs for update
  using (auth.uid() = user_id);

-- Trigger: update materialized usage_count
create or replace function public.update_usage_count()
returns trigger as $$
begin
  if (TG_OP = 'INSERT' and NEW.active = true) then
    update public.contributions
      set usage_count = usage_count + 1
      where id = NEW.contribution_id;
  elsif (TG_OP = 'UPDATE') then
    if OLD.active = true and NEW.active = false then
      update public.contributions
        set usage_count = usage_count - 1
        where id = NEW.contribution_id;
    elsif OLD.active = false and NEW.active = true then
      update public.contributions
        set usage_count = usage_count + 1
        where id = NEW.contribution_id;
    end if;
  end if;
  return NEW;
end;
$$ language plpgsql security definer;

create trigger trg_update_usage_count
  after insert or update on public.installs
  for each row execute function public.update_usage_count();

-- ── Auth trigger: auto-create user profile ───────────────────

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, github_handle, display_name, avatar_url)
  values (
    NEW.id,
    coalesce(NEW.raw_user_meta_data->>'user_name', NEW.raw_user_meta_data->>'preferred_username', ''),
    coalesce(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    coalesce(NEW.raw_user_meta_data->>'avatar_url', '')
  );
  return NEW;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
