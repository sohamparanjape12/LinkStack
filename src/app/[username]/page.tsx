import { createServerClient } from '@/lib/supabase-server';
import { notFound } from 'next/navigation';
import PublicProfile from '@/components/public-profile';

// Define Props for the page - params is now a Promise in Next.js 15
interface Props {
  params: Promise<{ username: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ProfilePage({ params, searchParams }: Props) {
  // Await the params since they're now a Promise in Next.js 15
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  console.log('Resolved Params:', resolvedParams);

  // It's good practice to log or inspect params and searchParams here
  // during development to ensure they are what you expect.
  // console.log('Params:', resolvedParams);
  // console.log('Search Params:', resolvedSearchParams);
  
  const supabase = await createServerClient();

  // Fetch the user profile
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', resolvedParams.username)
    .order('created_at', { ascending: false })
    .single();

    console.log(profile)

  if (profileError || !profile) {
    // console.error('Error fetching profile:', profileError); // Log error for debugging
    notFound(); // Next.js built-in notFound function
  }

  // Fetch the links associated with the profile
  const { data: links, error: linksError } = await supabase
    .from('links')
    .select('*')
    .eq('user_id', profile?.id)
    .eq('profile', profile?.username)
    .eq('is_active', true)
    .order('position', { ascending: true });

console.log('Links:', links);

  if (linksError) {
    console.error('Error fetching links:', linksError); // Log error for debugging
    // Depending on your app, you might want to show an error state or an empty links array
    // rather than calling notFound if only links fail. For now, we'll proceed.
  }

  return <PublicProfile profile={profile} links={links || []} />;
}