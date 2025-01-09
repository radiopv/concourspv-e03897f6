import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fgnrvnyzyiaqtzsyegzn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZnbnJ2bnl6eWlhcXR6c3llZ3puIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMwMjAxMTUsImV4cCI6MjA0ODU5NjExNX0.Mr0AIJs9f9OEEjYUXuHISVfOBNgqfwBy8w5DhKqxo90';

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});