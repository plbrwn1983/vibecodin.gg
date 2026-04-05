-- Add upvotes column to comments
alter table public.comments add column upvotes integer not null default 0;

-- Comment votes table
create table public.comment_votes (
  user_id uuid not null references public.users(id) on delete cascade,
  comment_id uuid not null references public.comments(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, comment_id)
);

alter table public.comment_votes enable row level security;

create policy "Comment votes are publicly readable"
  on public.comment_votes for select
  using (true);

create policy "Authenticated users can vote on comments"
  on public.comment_votes for insert
  with check (auth.uid() = user_id);

create policy "Users can remove their own comment votes"
  on public.comment_votes for delete
  using (auth.uid() = user_id);

-- Trigger: update materialized comment upvote count
create or replace function public.update_comment_upvote_count()
returns trigger as $$
begin
  if (TG_OP = 'INSERT') then
    update public.comments
      set upvotes = upvotes + 1
      where id = NEW.comment_id;
    return NEW;
  elsif (TG_OP = 'DELETE') then
    update public.comments
      set upvotes = upvotes - 1
      where id = OLD.comment_id;
    return OLD;
  end if;
  return null;
end;
$$ language plpgsql security definer;

create trigger trg_update_comment_upvotes
  after insert or delete on public.comment_votes
  for each row execute function public.update_comment_upvote_count();
