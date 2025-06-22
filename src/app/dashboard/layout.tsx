import { createServerClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import DashboardNav from '@/components/dashboard-nav'
import { DashboardProvider } from '@/contexts/DashboardContext'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch profiles for the user
  const { data: profilesData, error: profilesError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)

  if (profilesError) {
    console.error('Error fetching profiles in DashboardLayout:', profilesError)
    // Handle error appropriately, maybe redirect to an error page or show a message
  }

  return (
    <DashboardProvider initialUser={user} initialProfiles={profilesData || []}>
      <div className="min-h-screen flex flex-col">
        <DashboardNav />
        <main className="flex flex-1">{children}</main>
      </div>
    </DashboardProvider>
  )
}