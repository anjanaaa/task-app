-- Create the tasks table
create table if not exists public.tasks (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  completed boolean default false,
  has_expired boolean default false,
  time_limit timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable Row Level Security (RLS)
alter table public.tasks enable row level security;

-- Create a policy that allows all operations for now
-- Note: In a real app, you'd want to restrict this to authenticated users
create policy "Allow all operations on tasks" on public.tasks
for all using (true);

-- Create an index on created_at for better performance when ordering
create index if not exists tasks_created_at_idx on public.tasks (created_at desc);

-- Create an index on completed for filtering
create index if not exists tasks_completed_idx on public.tasks (completed);

-- Create a function to automatically update the updated_at column
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql security definer;

-- Create a trigger to automatically update updated_at
create trigger handle_tasks_updated_at
  before update on public.tasks
  for each row
  execute function public.handle_updated_at();
