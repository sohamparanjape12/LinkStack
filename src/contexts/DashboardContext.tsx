'use client'

import { Profile as DbProfile } from '@/types/database'
import { User } from '@supabase/supabase-js'
import { createContext, Dispatch, SetStateAction, ReactNode, useState, useEffect, useCallback, useContext } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter, usePathname } from 'next/navigation' // Import usePathname

export interface Profile extends DbProfile {
  // Add any additional client-side properties if needed
  // For now, we assume DbProfile from @/types/database is sufficient
  // and contains 'id' and 'username'.
}

interface DashboardContextType {
  user: User | null;
  currentProfile: Profile | null;
  setCurrentProfile: Dispatch<SetStateAction<Profile | null>>;
  profiles: Profile[];
  profileSwitcherOpen: boolean;
  setProfileSwitcherOpen: Dispatch<SetStateAction<boolean>>;
  profileSwitcherValue: string;
  setProfileSwitcherValue: Dispatch<SetStateAction<string>>;
  isLoadingUserAndProfiles: boolean;
  switchProfile: (newProfileUsername: string) => void;
}

export const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

interface DashboardProviderProps {
  children: ReactNode;
  initialUser: User | null;
  initialProfiles: Profile[];
}

export const DashboardProvider = ({ children, initialUser, initialProfiles }: DashboardProviderProps) => {
  const router = useRouter();
  const pathname = usePathname(); // Get current pathname
  const supabase = createClientComponentClient();

  const [user, setUser] = useState<User | null>(initialUser);
  const [profiles, setProfiles] = useState<Profile[]>(initialProfiles);
  const [currentProfile, setCurrentProfile] = useState<Profile | null>(null);
  const [profileSwitcherOpen, setProfileSwitcherOpen] = useState(false);
  const [profileSwitcherValue, setProfileSwitcherValue] = useState('');
  const [isLoadingUserAndProfiles, setIsLoadingUserAndProfiles] = useState(true);

  useEffect(() => {
    console.log('DashboardContext: Initializing with initialUser, initialProfiles', { initialUser, initialProfiles });
    setUser(initialUser);
    setProfiles(initialProfiles);
    if (initialProfiles && initialProfiles.length > 0) {
      // Try to set currentProfile from localStorage or default to first profile
      const storedProfileUsername = localStorage.getItem('selectedProfileUsername');
      console.log('DashboardContext: storedProfileUsername from localStorage:', storedProfileUsername);
      const foundProfile = initialProfiles.find(p => p.username === storedProfileUsername);
      console.log('DashboardContext: foundProfile based on localStorage and initialProfiles:', foundProfile);
      const profileToSet = foundProfile || initialProfiles[0];
      console.log('DashboardContext: profileToSet for initial load:', profileToSet);

      setCurrentProfile(profileToSet);
      setProfileSwitcherValue(profileToSet.username);
    } else if (initialUser && initialProfiles.length === 0) {
      console.log('DashboardContext: User exists but no profiles.');
      // User exists but has no profiles, might need to go to setup or handle this case
      setCurrentProfile(null);
      // Potentially redirect to setup if no profiles and not on setup page
      if (!pathname.startsWith('/setup') && initialUser) {
        console.log('DashboardContext: Considering redirect to /setup due to no profiles.');
        // router.push('/setup'); // Be cautious with automatic redirects here to avoid loops
      }
    }
    setIsLoadingUserAndProfiles(false);
    console.log('DashboardContext: isLoadingUserAndProfiles set to false (initial load).');
  }, [initialUser, initialProfiles, pathname, router]); // Added pathname, router for consistency if redirect logic is used

  // Effect to listen for auth changes
   useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      const currentUser = session?.user || null;
      setUser(currentUser);
      if (currentUser) {
        setIsLoadingUserAndProfiles(true);
        const { data: profilesData, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', currentUser.id);

        if (error) {
          console.error("Error fetching profiles on auth change:", error);
          setProfiles([]);
          setCurrentProfile(null);
          // Ensure loading state is reset even on error
          setIsLoadingUserAndProfiles(false); 
        } else {
          setProfiles(profilesData || []);
          if (profilesData && profilesData.length > 0) {
            const storedProfileUsername = localStorage.getItem('selectedProfileUsername');
            const foundProfile = profilesData.find(p => p.username === storedProfileUsername);
            const profileToSet = foundProfile || profilesData[0];
            setCurrentProfile(profileToSet);
            setProfileSwitcherValue(profileToSet.username);
          } else {
            setCurrentProfile(null);
          }
          setIsLoadingUserAndProfiles(false);
        }
      } else {
        // User logged out
        setUser(null); // Explicitly set user to null before other state changes
        setProfiles([]);
        setCurrentProfile(null);
        window.location.assign('/login'); // Force a full page reload to the login page
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [supabase, router]);


  const switchProfile = useCallback((newProfileUsername: string) => {
    const newSelectedProfile = profiles.find(p => p.username === newProfileUsername);
    if (newSelectedProfile) {
      setCurrentProfile(newSelectedProfile);
      setProfileSwitcherValue(newSelectedProfile.username);
      localStorage.setItem('selectedProfileUsername', newSelectedProfile.username);
      setProfileSwitcherOpen(false);
      // Potentially refresh data or navigate if needed, e.g. router.refresh() or specific navigation
      // For now, we assume pages will react to currentProfile change
      // If on dashboard, refresh to reload data for the new profile
      if (pathname.startsWith('/dashboard')) {
        router.refresh(); 
      }
    }
  }, [profiles, router, pathname]);


  const value = {
    user,
    setUser,
    currentProfile,
    setCurrentProfile, // Keep this if direct manipulation is needed, though switchProfile is preferred
    profiles,
    profileSwitcherOpen,
    setProfileSwitcherOpen,
    profileSwitcherValue,
    setProfileSwitcherValue,
    isLoadingUserAndProfiles,
    switchProfile,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboardContext = () => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboardContext must be used within a DashboardProvider');
  }
  return context;
};
