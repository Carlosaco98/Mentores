create table if not exists public.student_records (
  id text primary key,
  payload jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.student_records enable row level security;

create policy "service role can manage student records"
on public.student_records
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');
