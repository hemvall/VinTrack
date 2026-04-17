-- ============================================
-- Vintrack — Supabase migration
-- Run this in the Supabase SQL Editor
-- ============================================

-- 1. Articles table
create table if not exists articles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null default '',
  brand text default '',
  size text default '',
  category text default '',
  status text not null default 'unlisted' check (status in ('unlisted','listed','sold')),
  buy_price numeric(10,2) default 0,
  list_price numeric(10,2) default 0,
  sold_price numeric(10,2) default 0,
  sold_date date,
  fees numeric(10,2) default 0,
  shipping_cost numeric(10,2) default 0,
  listing_title text default '',
  listing_description text default '',
  notes text default '',
  created_at timestamptz not null default now()
);

-- 2. Presets table
create table if not exists presets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null default '',
  brand text default '',
  size text default '',
  category text default '',
  buy_price numeric(10,2) default 0,
  list_price numeric(10,2) default 0,
  fees numeric(10,2) default 0,
  shipping_cost numeric(10,2) default 0,
  listing_title text default '',
  listing_description text default '',
  notes text default '',
  created_at timestamptz not null default now()
);

-- 3. RLS — each user only sees their own data
alter table articles enable row level security;
alter table presets enable row level security;

create policy "Users see own articles"
  on articles for select using (auth.uid() = user_id);
create policy "Users insert own articles"
  on articles for insert with check (auth.uid() = user_id);
create policy "Users update own articles"
  on articles for update using (auth.uid() = user_id);
create policy "Users delete own articles"
  on articles for delete using (auth.uid() = user_id);

create policy "Users see own presets"
  on presets for select using (auth.uid() = user_id);
create policy "Users insert own presets"
  on presets for insert with check (auth.uid() = user_id);
create policy "Users update own presets"
  on presets for update using (auth.uid() = user_id);
create policy "Users delete own presets"
  on presets for delete using (auth.uid() = user_id);

-- 4. Indexes
create index if not exists idx_articles_user on articles(user_id);
create index if not exists idx_presets_user on presets(user_id);
