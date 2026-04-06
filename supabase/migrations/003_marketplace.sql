-- ============================================================
-- vibecodin.gg — Marketplace Layer
-- Adds pricing, purchases, subscriptions, reviews, payouts
-- ============================================================

-- ── Extend contributions with pricing + review metrics ──────

alter table public.contributions
  add column pricing_model text not null default 'free',
  add column price_one_time integer,
  add column price_subscription integer,
  add column stripe_product_id text,
  add column stripe_price_one_time_id text,
  add column stripe_price_subscription_id text,
  add column rating_avg numeric(3,2) not null default 0,
  add column rating_count integer not null default 0,
  add column works_as_described_pct numeric(5,2),
  add column trust_score numeric(5,2),
  add column stale boolean not null default false,
  add column stale_at timestamptz,
  add column auto_flagged boolean not null default false,
  add column auto_delisted boolean not null default false;

create index idx_contributions_pricing on public.contributions(pricing_model);

-- ── Extend users with Stripe fields ─────────────────────────

alter table public.users
  add column stripe_account_id text,
  add column stripe_onboarding_complete boolean not null default false,
  add column stripe_customer_id text;

-- ── Purchases (one-time) ────────────────────────────────────

create table public.purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  contribution_id text not null references public.contributions(id) on delete cascade,
  stripe_checkout_session_id text not null,
  stripe_payment_intent_id text,
  amount_cents integer not null,
  platform_fee_cents integer not null,
  status text not null default 'pending',
  purchased_at timestamptz not null default now(),
  refunded_at timestamptz,
  refund_eligible_until timestamptz,
  unique (user_id, contribution_id)
);

alter table public.purchases enable row level security;

create policy "Users can read their own purchases"
  on public.purchases for select
  using (auth.uid() = user_id);

create policy "Service role can insert purchases"
  on public.purchases for insert
  with check (true);

create policy "Service role can update purchases"
  on public.purchases for update
  using (true);

create index idx_purchases_user on public.purchases(user_id);
create index idx_purchases_contribution on public.purchases(contribution_id);

-- ── Active Subscriptions ────────────────────────────────────

create table public.active_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  contribution_id text not null references public.contributions(id) on delete cascade,
  stripe_subscription_id text not null unique,
  stripe_price_id text not null,
  amount_cents integer not null,
  status text not null default 'active',
  current_period_end timestamptz,
  started_at timestamptz not null default now(),
  canceled_at timestamptz,
  unique (user_id, contribution_id)
);

alter table public.active_subscriptions enable row level security;

create policy "Users can read their own subscriptions"
  on public.active_subscriptions for select
  using (auth.uid() = user_id);

create policy "Service role can insert subscriptions"
  on public.active_subscriptions for insert
  with check (true);

create policy "Service role can update subscriptions"
  on public.active_subscriptions for update
  using (true);

create index idx_active_subs_user on public.active_subscriptions(user_id);
create index idx_active_subs_contribution on public.active_subscriptions(contribution_id);

-- ── Reviews ─────────────────────────────────────────────────

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  contribution_id text not null references public.contributions(id) on delete cascade,
  rating integer not null check (rating >= 1 and rating <= 5),
  works_as_described boolean not null,
  model_tested text,
  body text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, contribution_id)
);

alter table public.reviews enable row level security;

create policy "Reviews are publicly readable"
  on public.reviews for select
  using (true);

create policy "Authenticated users can create reviews"
  on public.reviews for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own reviews"
  on public.reviews for update
  using (auth.uid() = user_id);

create policy "Users can delete their own reviews"
  on public.reviews for delete
  using (auth.uid() = user_id);

create index idx_reviews_contribution on public.reviews(contribution_id);

-- ── Payout Ledger ───────────────────────────────────────────

create table public.payout_ledger (
  id uuid primary key default gen_random_uuid(),
  contributor_user_id uuid not null references public.users(id),
  contribution_id text not null references public.contributions(id),
  purchase_id uuid references public.purchases(id),
  subscription_id uuid references public.active_subscriptions(id),
  gross_cents integer not null,
  platform_fee_cents integer not null,
  contributor_payout_cents integer not null,
  stripe_transfer_id text,
  created_at timestamptz not null default now()
);

alter table public.payout_ledger enable row level security;

create policy "Contributors can read their own payouts"
  on public.payout_ledger for select
  using (auth.uid() = contributor_user_id);

create policy "Service role can insert payouts"
  on public.payout_ledger for insert
  with check (true);

create index idx_payout_ledger_contributor on public.payout_ledger(contributor_user_id);

-- ── Review materialization trigger ──────────────────────────

create or replace function public.update_review_metrics()
returns trigger as $$
declare
  v_contribution_id text;
  v_avg numeric(3,2);
  v_count integer;
  v_wad_pct numeric(5,2);
  v_trust numeric(5,2);
  v_wad_count integer;
begin
  -- Determine which contribution to update
  if (TG_OP = 'DELETE') then
    v_contribution_id := OLD.contribution_id;
  else
    v_contribution_id := NEW.contribution_id;
  end if;

  -- Calculate metrics
  select
    coalesce(avg(rating), 0)::numeric(3,2),
    count(*),
    count(*) filter (where works_as_described = true)
  into v_avg, v_count, v_wad_count
  from public.reviews
  where contribution_id = v_contribution_id;

  -- Works-as-described percentage
  if v_count > 0 then
    v_wad_pct := (v_wad_count::numeric / v_count * 100)::numeric(5,2);
  else
    v_wad_pct := null;
  end if;

  -- Trust score: 60% works-as-described + 30% rating + 10% review volume
  if v_count > 0 then
    v_trust := (
      0.6 * coalesce(v_wad_pct, 0) +
      0.3 * (v_avg / 5.0 * 100) +
      0.1 * (least(v_count, 50)::numeric / 50.0 * 100)
    )::numeric(5,2);
  else
    v_trust := null;
  end if;

  -- Update contribution
  update public.contributions set
    rating_avg = v_avg,
    rating_count = v_count,
    works_as_described_pct = v_wad_pct,
    trust_score = v_trust,
    auto_flagged = case when v_wad_pct is not null and v_wad_pct < 60 then true else false end,
    auto_delisted = case when v_wad_pct is not null and v_wad_pct < 40 then true else false end,
    hidden = case when v_wad_pct is not null and v_wad_pct < 40 then true else hidden end
  where id = v_contribution_id;

  if (TG_OP = 'DELETE') then
    return OLD;
  end if;
  return NEW;
end;
$$ language plpgsql security definer;

create trigger trg_update_review_metrics
  after insert or update or delete on public.reviews
  for each row execute function public.update_review_metrics();

-- ── Purchase access check RPC ───────────────────────────────

create or replace function public.check_purchase_access(
  p_user_id uuid,
  p_contribution_id text
)
returns boolean as $$
declare
  v_pricing_model text;
  v_author text;
  v_user_handle text;
begin
  -- Get contribution pricing model and author
  select pricing_model, author
  into v_pricing_model, v_author
  from public.contributions
  where id = p_contribution_id and deleted_at is null;

  -- Not found
  if not found then
    return false;
  end if;

  -- Free contributions are always accessible
  if v_pricing_model = 'free' then
    return true;
  end if;

  -- Author always has access
  select github_handle into v_user_handle
  from public.users where id = p_user_id;

  if v_user_handle = v_author then
    return true;
  end if;

  -- Check for completed purchase
  if exists (
    select 1 from public.purchases
    where user_id = p_user_id
      and contribution_id = p_contribution_id
      and status = 'completed'
  ) then
    return true;
  end if;

  -- Check for grandfathered purchase
  if exists (
    select 1 from public.purchases
    where user_id = p_user_id
      and contribution_id = p_contribution_id
      and status = 'grandfathered'
  ) then
    return true;
  end if;

  -- Check for active subscription
  if exists (
    select 1 from public.active_subscriptions
    where user_id = p_user_id
      and contribution_id = p_contribution_id
      and status = 'active'
  ) then
    return true;
  end if;

  return false;
end;
$$ language plpgsql security definer;
