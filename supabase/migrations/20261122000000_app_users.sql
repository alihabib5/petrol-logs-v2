-- Sawari: who has signed in with Google.
-- One row per Google account. Only the track-signin Edge Function writes here (with the secret key, after Google has
-- confirmed the account). Row level security is on with no policies, so the browser's publishable key can neither
-- read nor write this table. Vehicle, fuel and service records are never stored here; they stay in each user's own Drive.

create table if not exists public.app_users (
  google_sub    text primary key,            -- Google's permanent account id
  email         text,
  name          text,
  picture       text,
  first_seen    timestamptz not null default now(),
  last_seen     timestamptz not null default now(),
  sign_in_count integer     not null default 1
);

alter table public.app_users enable row level security;

-- Insert a new account, or update an existing one and count the sign-in.
create or replace function public.record_sign_in(p_sub text, p_email text, p_name text, p_picture text)
returns void
language sql
security definer
set search_path = ''
as $$
  insert into public.app_users (google_sub, email, name, picture)
  values (p_sub, p_email, p_name, p_picture)
  on conflict (google_sub) do update
    set email = excluded.email,
        name = excluded.name,
        picture = excluded.picture,
        last_seen = now(),
        sign_in_count = public.app_users.sign_in_count + 1;
$$;

-- Only the server may call it.
revoke execute on function public.record_sign_in(text, text, text, text) from public, anon, authenticated;
grant execute on function public.record_sign_in(text, text, text, text) to service_role;
