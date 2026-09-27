import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database.types'

// Use this ONLY in Server Actions or API Routes where you need admin privileges
export function createAdminClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
}
