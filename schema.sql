-- ══════════════════════════════════════════════════════
--  Nikki & Michael Shared Wedding Album — DB Schema
--  Paste this into: Supabase → SQL Editor → Run
-- ══════════════════════════════════════════════════════

create extension if not exists "pgcrypto";

-- ── guests ─────────────────────────────────────────────
create table if not exists guests (
  id           uuid        primary key default gen_random_uuid(),
  name         text        not null check (char_length(name) between 1 and 80),
  phone        text        not null default '',
  upload_count integer     not null default 0 check (upload_count >= 0),
  created_at   timestamptz not null default now()
);

-- ── photos ─────────────────────────────────────────────
create table if not exists photos (
  id         uuid        primary key default gen_random_uuid(),
  guest_id   uuid        references guests(id) on delete set null,
  guest_name text,
  image_url  text        not null,
  public_id  text        not null,
  created_at timestamptz not null default now()
);

-- ── Indexes ────────────────────────────────────────────
create index if not exists photos_created_at_idx   on photos(created_at desc);
create index if not exists photos_guest_id_idx     on photos(guest_id);
create index if not exists guests_upload_count_idx on guests(upload_count desc);

-- ── RLS (service_role bypasses by default) ─────────────
alter table guests enable row level security;
alter table photos enable row level security;

-- ── Verify ─────────────────────────────────────────────
select table_name, column_name, data_type
from information_schema.columns
where table_name in ('guests','photos')
order by table_name, ordinal_position;
