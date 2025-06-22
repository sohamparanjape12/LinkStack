'use client'

import { createServerClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import LinkManager from '@/components/link-manager'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Clock, MousePointerClick, Link as LinkIcon, ExternalLink, PenSquare, ChevronsUpDown, Check, Trash2, GripVertical } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import DashboardNav from '@/components/dashboard-nav'
import { AnalyticsChart } from '@/components/analytics-chart'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { socialIcons, IconName } from '@/config/icons';
import { VisitorAnalytics } from '@/components/visitor-analytics'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { useEffect, useState, useContext } from 'react' // Added useContext
import { cn } from '@/lib/utils'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { supabase } from '@/lib/supabase-client'
import { useDashboardContext, Profile } from '@/contexts/DashboardContext' // Import context

// Define types for our data structures to ensure type safety.
interface LinkType {
  id: string;
  user_id: string;
  profile: string;
  title: string;
  url: string;
  icon: string | null;
  is_active: boolean;
  position: number;
  created_at: string;
}

interface ClickType {
  link_id: string;
  created_at: string;
}

// A generic type for visitor data since we are selecting '*'
interface VisitorType {
  id: string;
  user_id: string;
  page_path: string;
  referrer: string | null;
  country: string | null;
  city: string | null;
  device: string | null;
  browser: string | null;
  os?: string | null;
  created_at: string;
}

export default function DashboardPage() {
  const { 
    user, 
    currentProfile, 
    profiles, 
    profileSwitcherOpen, 
    setProfileSwitcherOpen, 
    profileSwitcherValue, 
    switchProfile,
    isLoadingUserAndProfiles 
  } = useDashboardContext()

  const [clickData, setClickData] = useState<ClickType[]>([])
  const [visitorData, setVisitorData] = useState<VisitorType[]>([])
  const [links, setLinks] = useState<LinkType[]>([])
  const [isIconPickerOpen, setIsIconPickerOpen] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const [loadingPageData, setLoadingPageData] = useState(true);

  useEffect(() => {
      async function getData(){
        if(user && currentProfile) {
          setLoadingPageData(true);
          const { data: fetchedLinks } = await supabase
            .from('links')
            .select('*')
            .eq('user_id', user.id)
            .eq('profile', currentProfile?.username)
            .order('position', { ascending: true })

          setLinks(fetchedLinks || [])

          // Get link clicks
          const { data: fetchedClickData } = await supabase
            .from('link_clicks')
            .select('link_id, created_at')
            .eq('user_id', user.id)
            .eq('profile', currentProfile.username)

          setClickData(fetchedClickData || [])

          // Get visitor analytics
          const { data: fetchedVisitorData } = await supabase
            .from('visitor_analytics')
            .select('*')
            .eq('user_id', user.id)
            .eq('page_path', '/' + currentProfile.username)
            .order('created_at', { ascending: false })

          setVisitorData(fetchedVisitorData || [])
          setLoadingPageData(false);
        } else {
          setLinks([]);
          setClickData([]);
          setVisitorData([]);
          setLoadingPageData(false);
        }
      }
      getData()
  }, [user, currentProfile])

  const deleteLink = async (id: string) => {
    const { error } = await supabase
      .from('links')
      .delete()
      .eq('id', id)

    if (!error) {
      setLinks(links.filter(link => link.id !== id))
    }
  }

  const toggleActive = async (id: string, isActive: boolean) => {
    const { error } = await supabase
      .from('links')
      .update({ is_active: !isActive })
      .eq('id', id)

    if (!error) {
      setLinks(links.map(link => 
        link.id === id ? { ...link, is_active: !isActive } : link
      ))
    }
  }
  

  
    

  const getLinkStats = (linkId: string) => {
    const linkClicks = clickData?.filter(click => click.link_id === linkId) || []
    const last24h = linkClicks.filter(click => {
      const clickTime = new Date(click.created_at)
      const now = new Date()
      const diff = now.getTime() - clickTime.getTime()
      return diff <= 86400000 // 24 hours in milliseconds
    }).length

    return {
      total: linkClicks.length,
      last24h
    }
  }

  // Calculate overall stats using all clicks
  const totalClicks = clickData?.length || 0
  const last24hClicks = clickData?.filter(click => {
    const clickTime = new Date(click.created_at)
    const now = new Date()
    return (now.getTime() - clickTime.getTime()) <= 86400000
  }).length || 0

  
  if (isLoadingUserAndProfiles || loadingPageData) {
    return <div className="flex items-center justify-center min-h-screen w-full">
      <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary-900'></div>
    </div>;
  }
  
  if (!user) redirect('/login'); // Should be handled by layout, but good fallback

  // If user is loaded, page data is not loading, but there's no current profile
  if (!currentProfile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen w-full p-4 text-center">
        <h2 className="text-xl font-semibold mb-2">No Profile Selected</h2>
        <p className="text-muted-foreground mb-4">
          Please create a new profile or select an existing one to view the dashboard.
        </p>
        {/* You might want to add a button here to guide the user, e.g., to /setup or to open the profile switcher */}
      </div>
    );
  }

  return (
    <div className="space-y-4 w-full md:space-y-6 p-4 md:p-6">
      <div className="flex flex-col md:px-15 sm:flex-row justify-between items-start sm:items-center gap-2">
        <div className='flex justify-center items-center gap-3'>
          <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
          <Link href={`/${currentProfile?.username}`}>
            <Button variant={"outline"}>
                View Profile
                <ExternalLink className="h-4 w-4" />
            </Button>
          </Link>
          <Link href={`/dashboard/editor`}>
            <Button variant={"outline"}>
                Editor
                <PenSquare className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <p className="text-sm text-gray-600 break-all sm:break-normal">Your page: <span className="font-mono">/{currentProfile.username}</span></p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 md:px-20">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
            <MousePointerClick className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClicks}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last 24h</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{last24hClicks}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Links</CardTitle>
            <LinkIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {links?.filter(l => l.is_active).length || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Clicks/Link</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {links?.length ? Math.round(totalClicks / links.length) : 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid - New Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-7 xl:grid-cols-12 gap-4 md:px-20">
        {/* Link Manager */}
        <div className="lg:col-span-3 xl:col-span-4">
          <Card>
            <CardHeader>
              <CardTitle>Manage Links</CardTitle>
              <CardDescription>
                <p>Add new links <a href='/dashboard/editor' className='underline'>here</a></p>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-[250px] overflow-scroll overflow-x-hidden py-2 px-2">
                {links.map((link) => (
                  <Card key={link.id} className={`${!link.is_active ? 'bg-muted' : ''}`}>
                    <CardContent className="flex items-center gap-3 py-0">
                      <GripVertical className="w-4 h-4 text-gray-400" />
                      <div className="flex-1">
                        <div className="font-medium">{link.title}</div>
                        <div className="text-sm text-gray-500 truncate w-[120px] md:w-[150px]">{link.url}</div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleActive(link.id, link.is_active)}
                      >
                        {link.is_active ? 'Active' : 'Inactive'}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteLink(link.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
        
              <Dialog open={isIconPickerOpen} onOpenChange={setIsIconPickerOpen}>
                <DialogContent className="max-w-3xl">
                  <DialogHeader>
                    <DialogTitle>Choose an Icon</DialogTitle>
                  </DialogHeader>
                  <div className="mt-4 px-4">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        setSelectedIcon(null);
                        setIsIconPickerOpen(false);
                      }}
                    >
                      No Icon
                    </Button>
                  </div>
                  <div className="grid grid-cols-8 gap-2 p-4 max-h-[60vh] overflow-y-auto">
                    {Object.entries(socialIcons).map(([name, icon]) => (
                      <Button
                        key={name}
                        variant="outline"
                        className="h-12 w-12 p-0"
                        onClick={() => {
                          setSelectedIcon(name);
                          setIsIconPickerOpen(false);
                        }}
                        name={name}
                      >
                        <FontAwesomeIcon icon={icon} className="h-8 w-8" />
                      </Button>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>

        {/* Analytics Chart */}
        <div className="lg:col-span-4 xl:col-span-5">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
            </CardHeader>
            <CardContent className="overflow-y-auto">
              <AnalyticsChart clickData={clickData || []} />
            </CardContent>
          </Card>
        </div>

        {/* Link Performance & Quick Stats */}
        <div className="lg:col-span-3 xl:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-4 xl:gap-0">
          {/* Link Performance Card */}
          <div className="w-full md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Link Performance</CardTitle>
              </CardHeader>
              <CardContent className="px-0">
                <div className="max-h-[300px] overflow-y-auto w-full border-t border-b">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[180px] min-w-[120px]">Link</TableHead>
                        <TableHead className="w-[80px] text-right">Total</TableHead>
                        <TableHead className="w-[80px] text-right">24h</TableHead>
                        <TableHead className="w-[100px] text-right">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {links?.map((link) => {
                        const stats = getLinkStats(link.id)
                        return (
                          <TableRow key={link.id}>
                            <TableCell className="font-medium truncate max-w-[150px]">
                              <div className="flex items-center gap-2">
                                {link.icon && (
                                  <FontAwesomeIcon 
                                    icon={socialIcons[link.icon as IconName]} 
                                    className="h-4 w-4 flex-shrink-0" 
                                  />
                                )}
                                <span className="truncate">{link.title}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">{stats.total}</TableCell>
                            <TableCell className="text-right">{stats.last24h}</TableCell>
                            <TableCell className="text-right">
                              <span className={`px-2 py-1 rounded-full text-xs whitespace-nowrap ${
                                link.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                              }`}>
                                {link.is_active ? 'Active' : 'Inactive'}
                              </span>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats Card */}
          <div className="w-full md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Total Links:</span>
                    <span className="font-bold">{links?.length || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Active Links:</span>
                    <span className="font-bold">
                      {links?.filter(l => l.is_active).length || 0}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Add Visitor Analytics */}
        <div className="lg:col-span-full">
          <VisitorAnalytics visitorData={
            (visitorData || []).map(v => ({
              ...v,
              country: v.country ?? '',
              os: v.os ?? '', // Provide a default value if os is missing
              referrer: v.referrer ?? '', // Ensure referrer is string, not null
              device: v.device ?? '',
              browser: v.browser ?? ''
            }))
          } />
        </div>
      </div>
    </div>
  )
}