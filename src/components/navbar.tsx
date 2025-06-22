'use client'

import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { usePathname, useRouter } from "next/navigation"
import { useTheme } from "next-themes"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const supabase = createClientComponentClient()

  // Listen to auth changes to update local user and profile state
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      const currentUser = session?.user || null;
      setUser(currentUser);
      if (currentUser) {
        // Fetch profile only if user exists
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', currentUser.id)
          .single();

        // PGRST116 means no rows found, which is a valid state (e.g., new user, no profile yet)
        if (profileError && profileError.code !== 'PGRST116') {
          console.error('Error fetching profile in Navbar:', profileError.message);
          setProfile(null); // Clear profile on error
        } else {
          setProfile(profileData);
        }
      } else {
        // User is logged out, clear profile
        setProfile(null);
      }
    });

    return () => authListener?.subscription.unsubscribe();
  }, [supabase]); // Add supabase as a dependency

  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    // After signOut, the onAuthStateChange listener above will update the user and profile state.
    // If you want to redirect to the homepage or refresh, you can do it here:
    // router.push('/'); // Example: redirect to homepage
    // router.refresh(); // Example: refresh current page data
  }

  const { theme } = useTheme()

  const DEFAULT_NAVBAR_CLASS = "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/10";
  const HOME_SCROLLED_NAVBAR_CLASS = "bg-background/20 backdrop-blur supports-[backdrop-filter]:bg-background/10"; // Or simply "bg-background/20 backdrop-blur"
  const TRANSPARENT_NAVBAR_CLASS = "bg-transparent";
  const SCROLL_THRESHOLD = 100; // Pixels to scroll before changing background

  const pathname = usePathname()

  const [navbarBg, setNavbarBg] = useState(() => {
    // Initial state based on pathname and scroll (if on client for home)
    if (typeof window !== 'undefined' && pathname === '/') {
      return window.scrollY > SCROLL_THRESHOLD ? HOME_SCROLLED_NAVBAR_CLASS : TRANSPARENT_NAVBAR_CLASS;
    }
    // Default for non-home pages or SSR
    return pathname === '/' ? TRANSPARENT_NAVBAR_CLASS : DEFAULT_NAVBAR_CLASS;
  });

  useEffect(() => {
    const handleScroll = () => {
      // This function is intended to be called when pathname === '/'
      if (window.scrollY > SCROLL_THRESHOLD) {
        setNavbarBg(HOME_SCROLLED_NAVBAR_CLASS);
      } else {
        setNavbarBg(TRANSPARENT_NAVBAR_CLASS);
      }
    };

    if (pathname === '/') {
      // Set initial state correctly for home page, considering current scroll
      handleScroll(); // Call once to set based on current scroll
      window.addEventListener('scroll', handleScroll);
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    } else {
      // For non-home pages, use the default solid background
      setNavbarBg(DEFAULT_NAVBAR_CLASS);
    }
  }, [pathname]);

  return (
    <header className={`sticky top-0 z-50 w-full ${navbarBg} transition-colors duration-400 ease`}>
      <div className="container mx-auto flex h-14 items-center px-4 sm:px-6 lg:px-8">
        <div className="mr-4 flex">
          <Link className="mr-6 flex items-center space-x-2 font-bold" href="/">
            LinkStack
          </Link>
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link
              href="/features"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Features
            </Link>
            <Link
              href="/pricing"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Pricing
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <nav className="flex items-center justify-center space-x-2">
            <ThemeToggle />
            <div className="hidden md:flex items-center space-x-2">
              {user ? (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Avatar>
                        <AvatarImage src={profile?.avatar_url?.toString() || '/default-avatar.png'} alt="User Avatar" />
                        <AvatarFallback>{user.user_metadata?.display_name?.charAt(0) || 'U'}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="mt-3 mr-1">
                    <h1 className="text-lg text-center mt-1">{profile?.display_name || profile?.username}</h1>
                    <p className="text-center text-xs text-muted-800 mb-3">{user?.user_metadata?.email}</p>
                    <Link href="/dashboard">
                        <Button className="w-full" variant={'ghost'}>
                            Dashboard
                        </Button>
                    </Link>
                    <Link href="/dashboard/editor">
                        <Button className="w-full" variant={'ghost'}>
                            Editor
                        </Button>
                    </Link>
                    <Link href={"/" + profile?.username}>
                        <Button className="w-full" variant={'ghost'}>
                            Your LinkStack
                        </Button>
                    </Link>
                    <Button className="w-full mt-3" variant={'destructive'} onClick={handleLogout}>
                        Logout
                    </Button>
                  </PopoverContent>
                </Popover>
              ) : (
                <>
                  <Button variant="ghost" asChild>
                    <Link href="/login">Login</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/signup">Get Started</Link>
                  </Button>
                </>
              )}
            </div>
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  className="md:hidden"
                  size="icon"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64 p-10">
                <nav className="flex flex-col space-y-4 mt-4">
                  <Link href="/features" onClick={() => setIsOpen(false)}>
                    Features
                  </Link>
                  <Link href="/pricing" onClick={() => setIsOpen(false)}>
                    Pricing
                  </Link>
                  {
                    user !== null ? (
                      <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                        Dashboard
                      </Link>
                    ) : (
                        <>
                      <Link href="/login" onClick={() => setIsOpen(false)}>
                        Login
                      </Link>
                        <Link href="/signup" onClick={() => setIsOpen(false)}>
                            Get Started
                        </Link>
                        </>
                    )
                  }
                </nav>
              </SheetContent>
            </Sheet>
          </nav>
        </div>
      </div>
    </header>
  )
}
