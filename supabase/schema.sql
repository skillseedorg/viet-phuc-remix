-- ============================================================
-- Việt phục Remix — Supabase schema
-- Chạy toàn bộ file này trong Supabase Dashboard → SQL Editor.
-- Có thể chạy lại nhiều lần (idempotent).
-- ============================================================

-- ---------- profiles: tên hiển thị của người dùng ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text check (char_length(display_name) <= 60),
  school text check (char_length(school) <= 120),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "profiles are readable by everyone" on public.profiles;
create policy "profiles are readable by everyone"
  on public.profiles for select using (true);

drop policy if exists "users insert own profile" on public.profiles;
create policy "users insert own profile"
  on public.profiles for insert with check (auth.uid() = id);

drop policy if exists "users update own profile" on public.profiles;
create policy "users update own profile"
  on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);

-- Tự tạo profile khi có người đăng ký
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(
      nullif(new.raw_user_meta_data ->> 'display_name', ''),
      nullif(new.raw_user_meta_data ->> 'full_name', ''),
      nullif(new.raw_user_meta_data ->> 'name', ''),
      split_part(new.email, '@', 1)
    )
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- looks: bộ phối trong lookbook ----------
create table if not exists public.looks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  title text not null check (char_length(title) between 1 and 80),
  config jsonb not null,
  note text check (char_length(note) <= 500),
  ai jsonb,
  is_public boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists looks_user_idx on public.looks (user_id, created_at desc);
create index if not exists looks_public_idx on public.looks (created_at desc) where is_public;

alter table public.looks enable row level security;

drop policy if exists "public looks or own looks are readable" on public.looks;
create policy "public looks or own looks are readable"
  on public.looks for select using (is_public or auth.uid() = user_id);

drop policy if exists "users insert own looks" on public.looks;
create policy "users insert own looks"
  on public.looks for insert with check (auth.uid() = user_id);

drop policy if exists "users update own looks" on public.looks;
create policy "users update own looks"
  on public.looks for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "users delete own looks" on public.looks;
create policy "users delete own looks"
  on public.looks for delete using (auth.uid() = user_id);

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists looks_touch on public.looks;
create trigger looks_touch before update on public.looks
  for each row execute function public.touch_updated_at();

-- ---------- content_reports: báo sai sót thông tin văn hóa ----------
create table if not exists public.content_reports (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users (id) on delete set null,
  topic text not null check (char_length(topic) <= 80),
  message text not null check (char_length(message) between 5 and 2000),
  contact text check (char_length(contact) <= 120),
  status text not null default 'moi' check (status in ('moi', 'dang-xem', 'da-sua', 'khong-sua')),
  created_at timestamptz not null default now()
);

alter table public.content_reports enable row level security;

-- Ai cũng gửi được báo cáo (kể cả chưa đăng nhập); không ai đọc được qua API công khai.
-- Ban biên tập đọc bằng Dashboard hoặc service role.
drop policy if exists "anyone can submit a report" on public.content_reports;
create policy "anyone can submit a report"
  on public.content_reports for insert
  with check (user_id is null or auth.uid() = user_id);

-- Quyền cho các role của API
grant usage on schema public to anon, authenticated;
grant select on public.profiles to anon, authenticated;
grant insert, update on public.profiles to authenticated;
grant select on public.looks to anon, authenticated;
grant insert, update, delete on public.looks to authenticated;
grant insert on public.content_reports to anon, authenticated;
