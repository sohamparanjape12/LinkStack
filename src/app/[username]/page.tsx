import { createServerClient } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import PublicProfile from '@/components/public-profile'

interface Props {
  params: { username: string }
}

export default async function ProfilePage({ params }: Props) {
  const supabase = await createServerClient()
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', params.username)
    .single()

  if (!profile) {
    notFound()
  }

  const { data: links } = await supabase
    .from('links')
    .select('*')
    .eq('user_id', profile.id)
    .eq('is_active', true)
    .order('position', { ascending: true })

  return <PublicProfile profile={profile} links={links || []} />
}