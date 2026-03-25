import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

let supabase: SupabaseClient

if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey)
} else {
  // Create a dummy client that will fail gracefully at runtime
  supabase = createClient('https://placeholder.supabase.co', 'placeholder-key')
}

export { supabase }
