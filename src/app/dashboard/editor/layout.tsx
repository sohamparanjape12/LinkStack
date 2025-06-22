import { createServerClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import DashboardNav from '@/components/dashboard-nav'

export default async function ProfileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
      <main className="flex flex-1">
        {children}
      </main>
  )
}