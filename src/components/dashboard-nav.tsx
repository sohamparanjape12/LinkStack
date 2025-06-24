'use client'
import { Button } from '@/components/ui/button'
import { redirect, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Moon, Sun, Laptop, Menu, ChevronsUpDown, Check, PlusSquare } from "lucide-react"
import { useTheme } from "next-themes"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import React, { useEffect, useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './ui/command'
import { cn } from '@/lib/utils'
import { useDashboardContext } from '@/contexts/DashboardContext'
import { supabase } from '@/lib/supabase-client' // Keep for signOut
import { toast } from 'sonner' // Import toast for notifications

export default function DashboardNav() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [logoutLoading, setLogoutLoading] = useState(false)
  const { theme, setTheme } = useTheme()
  const {
    user,
    currentProfile,
    profiles,
    profileSwitcherOpen,
    setProfileSwitcherOpen,
    profileSwitcherValue,
    switchProfile,
    isLoadingUserAndProfiles,
  } = useDashboardContext()

  useEffect(() => {
    setMounted(true)
  }, [])


  const handleLogout = async () => {
    setLogoutLoading(true)
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error("Error logging out:", error.message)
        toast.error(`Logout failed: ${error.message}`);
      }
      // If signOut is successful, the onAuthStateChange listener in DashboardContext
      // will handle setting the user to null and redirecting to /login.
      // The DashboardNav component will likely unmount.
    } catch (e) {
      // Catch any unexpected errors during the signOut process itself
      console.error("Unexpected error during logout:", e);
      toast.error("An unexpected error occurred during logout.");
    } finally {
      setLogoutLoading(false); // Ensure loading state is always reset
    }
  }

  // Prevent hydration mismatch & wait for context to load
  if (!mounted) {
    return null
  }

  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto px-4 lg:px-8 py-3 flex justify-between items-center">
        <div className='flex items-center gap-4'>
          <Link href="/" className="text-xl font-bold">
            LinkStack
          </Link>
          <Popover open={profileSwitcherOpen} onOpenChange={setProfileSwitcherOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={profileSwitcherOpen}
                className="lg:w-[200px] justify-between"
              >
                {currentProfile ? currentProfile.username : profileSwitcherValue
                  ? profiles.find((p) => p.username === profileSwitcherValue)?.username
                  : "Select Profile"}
                <ChevronsUpDown className="opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandItem
                  value=''
                  className='border-b-2 rounded-none pb-2'
                  onSelect={() => {
                    setProfileSwitcherOpen(false)
                  }}
                >
                  <Link
                    href={{pathname: '/setup', query: {isNewProfile: true}}}
                    className='w-full'
                  >
                    <Button variant={'outline'} className='w-full'>
                      Add New Profile
                      <PlusSquare />
                    </Button>
                  </Link>
                </CommandItem>
                <CommandInput placeholder="Search Profiles..." className="h-9" />
                <CommandList>
                  <CommandEmpty>No Profiles found.</CommandEmpty>
                  <CommandGroup>
                    {profiles?.map((profileItem) => (
                      <CommandItem
                        key={profileItem.username}
                        value={profileItem.username}
                        onSelect={(currentValue) => {
                          switchProfile(currentValue)
                        }}
                      >
                        {profileItem.username}
                        <Check
                          className={cn(
                            "ml-auto",
                            currentProfile?.username === profileItem.username ? "opacity-100" : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-2">
          <Link href="/dashboard">
            <Button variant="ghost">Dashboard</Button>
          </Link>
          <Link href="/dashboard/editor">
            <Button variant="ghost">Editor</Button>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>
                <Sun className="mr-2 h-4 w-4" />
                <span>Light</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                <Moon className="mr-2 h-4 w-4" />
                <span>Dark</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                <Laptop className="mr-2 h-4 w-4" />
                <span>System</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button onClick={handleLogout} variant="outline">
            {
              logoutLoading ? <div className='animate-spin rounded-full h-4 w-4 px-2 border-b-2 border-primary-900'></div> : 'Logout'
            }
          </Button>
        </div>

        {/* Mobile Navigation */}
        <div className="lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-4 px-2">
                <Link href="/dashboard">
                  <Button variant="ghost" className="w-full justify-start">
                    Dashboard
                  </Button>
                </Link>
                <Link href="/dashboard/editor">
                  <Button variant="ghost" className="w-full justify-start">
                    Editor
                  </Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="w-full justify-start">
                      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                      <span className="ml-0">Theme</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setTheme("light")}>
                      <Sun className="mr-2 h-4 w-4" />
                      <span>Light</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("dark")}>
                      <Moon className="mr-2 h-4 w-4" />
                      <span>Dark</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("system")}>
                      <Laptop className="mr-2 h-4 w-4" />
                      <span>System</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button onClick={handleLogout} variant="outline" className='w-full justify-start'>
                  {
                    logoutLoading ? <div className='animate-spin rounded-full h-4 w-4 px-2 border-b-2 border-primary-900'></div> : 'Logout'
                  }
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}