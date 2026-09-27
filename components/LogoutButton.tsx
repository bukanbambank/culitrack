'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export function LogoutButton() {
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <button
      onClick={handleLogout}
      className="text-sm bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded-md font-medium transition-colors"
    >
      Logout
    </button>
  )
}
