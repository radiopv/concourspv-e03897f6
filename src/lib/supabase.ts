import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pedwjkjpckjlwbxfsmth.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBlZHdqa2pwY2tqbHdieGZzbXRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE4NzMxODcsImV4cCI6MjA0NzQ0OTE4N30.O7MUaPJkpNG1JekWOH3BaXsx5QxvAPRQKmsoANzEQiw';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);