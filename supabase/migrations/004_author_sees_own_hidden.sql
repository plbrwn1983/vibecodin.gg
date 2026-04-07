-- ============================================================
-- vibecodin.gg — Authors can read their own hidden content
-- Without this, auto-delisted contributions become invisible
-- even to the contributor who needs to fix them.
-- ============================================================

create policy "Authors can read their own contributions"
  on public.contributions for select
  using (
    exists (
      select 1 from public.users
      where users.id = auth.uid()
        and users.github_handle = contributions.author
    )
  );
