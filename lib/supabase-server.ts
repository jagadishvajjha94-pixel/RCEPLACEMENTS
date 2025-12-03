import { createClient } from '@supabase/supabase-js'

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  // Keep this file importable in dev without crashing tests; actual env vars are required for real usage.
  console.warn('SUPABASE env vars not set. Server Supabase client will be disabled.')
}

export const supabaseAdmin = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  { auth: { persistSession: false } }
)
