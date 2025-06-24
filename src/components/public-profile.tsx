'use client'
import { Card, CardContent } from '@/components/ui/card'
import { ExternalLink } from 'lucide-react'
import type { Profile, Link } from '@/types/database'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { socialIcons, IconName } from '@/config/icons'
import "../app/dashboard/editor/styles.css"
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { supabase } from '@/lib/supabase-client'
import { useEffect, useState } from 'react'
import { Button } from './ui/button'
import '../app/globals.css'
import { User } from '@supabase/supabase-js'

interface Props {
  profile: Profile
  links: Link[]
}

export default function PublicProfile({ profile, links }: Props) {
  const themeConfig = profile.theme_config || {}

    const handleLinkClick = async (linkId: string, userId: string) => {
      await supabase
        .from('link_clicks')
        .insert({
          link_id: linkId,
          user_id: userId,
          profile: profile.username
        })
    }

  const [currentUser, setCurrentUser] = useState<User | null | undefined>(undefined);

  const adjust = (color: string, amount: number) => {
    return '#' + color.replace(/^#/, '').replace(/../g, color => ('0'+Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2));
  }

  const fetchUser = async () => {
    const { data } = await supabase.auth.getUser();
    setCurrentUser(data?.user || null);
  };

  useEffect(() => {
  const runTracking = async () => {
    const { data: userData } = await supabase.auth.getUser();
    setCurrentUser(userData?.user || null);

    // Check if a visitor row already exists
    const { data: visitorData, error } = await supabase.from('visitor_analytics')
      .select('*')
      .eq('user_id', profile.id)
      .eq('page_path', window.location.pathname)
      .eq('visited_by', userData?.user?.id)

    if (visitorData && visitorData.length > 0) {
      // Already recorded
      return;
    }else if ((!userData?.user?.id || profile.id !== userData.user.id) || (currentUser === null)) {
      const ua = window.navigator.userAgent;
      const device = /mobile/i.test(ua) ? 'Mobile' : 'Desktop';
      const browser = getBrowser(ua);
      const os = getOS(ua);

      const { error: insertError } = await supabase.from('visitor_analytics').insert({
        user_id: profile.id,
        page_path: window.location.pathname,
        referrer: document.referrer,
        browser,
        os,
        device,
        visited_by: userData.user ? userData.user.id : null
      });

      if (insertError) {
        console.error('Error inserting visitor data:', insertError);
      }
    }
  };

  runTracking();
  // Don't include `currentUser` in deps — it's handled inside
}, [profile]);


  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const getGradientBackground = (color: string) => {
    const rgb = hexToRgb(color);
    if (!rgb) return color;
    return `linear-gradient(135deg, 
      rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1), 
      rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.7)
    )`;
  };

  // Helper functions to detect browser and OS
  const getBrowser = (ua: string) => {
    if (ua.includes('Chrome')) return 'Chrome'
    if (ua.includes('Firefox')) return 'Firefox'
    if (ua.includes('Safari')) return 'Safari'
    if (ua.includes('Edge')) return 'Edge'
    return 'Other'
  }

  const getOS = (ua: string) => {
    if (ua.includes('Windows')) return 'Windows'
    if (ua.includes('Mac')) return 'MacOS'
    if (ua.includes('Linux')) return 'Linux'
    if (ua.includes('Android')) return 'Android'
    if (ua.includes('iOS')) return 'iOS'
    return 'Other'
  }

  return (
    <div 
      className="min-h-screen py-0 px-0 align-middle flex flex-col items-center justify-center"
      style={{ 
        background: profile.theme_config?.backgroundImage 
          ? `url(${profile.theme_config.backgroundImage})` 
          : profile.theme_config.backgroundStyle === 'gradient'
          ? getGradientBackground(profile.theme_config?.backgroundColor)
          : profile.theme_config?.backgroundColor,
        color: profile.theme_config.textColor,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'top center',
        fontFamily: profile.theme_config.fontFamily || 'Inter, sans-serif',
        minHeight: '100vh',
      }}
    > 
      {profile.id === currentUser?.id && (
        <Button variant={'default'} style={{ fontFamily: 'Inter, sans-serif' }} className="absolute top-4 right-4" onClick={() => window.location.href = '/dashboard/editor'}>
          Edit Profile
        </Button>
      )}

      {/* Profile Content */}
      <div className="w-full flex-4 min-[720px]:max-w-[450px] mx-auto gap-4 flex flex-col items-center justify-center">
        <div className='flex flex-col items-center justify-center gap-5 w-full'>
          {/* Profile Header */}
          <div className="text-center flex-2 h-fit gap-0 flex flex-col items-center justify-center">
            <Avatar className="h-20 w-20 mx-auto mb-1">
                <AvatarImage src={profile.avatar_url || ''} />
                <AvatarFallback className="text-xl" style={{ color: profile.theme_config.linkFill !== 'glass' ? profile.theme_config.linkColor : '#ffffff', backgroundColor: profile.theme_config.linkFill !== 'glass' ? profile.theme_config.linkTextColor : '#010101' }}>
                  {profile.display_name?.charAt(0) || profile.username.charAt(0).toUpperCase()}
                </AvatarFallback>
            </Avatar>
            <div className='text-center p-0 m-0 flex flex-col items-center justify-center gap-0' style={{ color: profile.theme_config.textColor }}>
              <h1 className="text-2xl font-bold p-0 m-0">
                {profile.display_name || profile.username}
              </h1>
              <p className="text-gray-600 p-0 m-0">@{profile.username}</p>
              {profile.bio && (
                <p className="mt-1" style={{color: profile.theme_config.textColor}}>{profile.bio}</p>
              )}
            </div>
          </div>

          {/* Links */}
          <div className="flex flex-2 flex-col items-center justify-center gap-2 min-w-[350px] max-w-[400px]">
            {links.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full group" 
                onClick={() => {
                      if((currentUser?.id !== link.user_id) || (currentUser === null)) {
                        handleLinkClick(link.id, profile.id);
                      }
                    }
                }
              >
                <Card 
                  style={{ 
                    background: themeConfig.linkFill === 'glass' 
                      ? 'rgba(255, 255, 255, 0.12)'
                      : themeConfig.linkFill === 'outline' 
                      ? 'transparent'
                      : themeConfig.linkColor || adjust(themeConfig.backgroundColor, 30),
                    color: themeConfig.linkTextColor,
                    border: themeConfig.linkFill === 'outline' ? `1.5px solid ${profile.theme_config.linkColor}` : themeConfig.linkFill === 'glass' ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
                    boxShadow: themeConfig.linkShadow === 'subtle' 
                      ? '0 2px 4px rgba(0,0,0,0.1)' 
                      : themeConfig.linkShadow === 'hard'
                      ? '3px 4px 0px rgba(0,0,0,1)'
                      : 'none',
                    backdropFilter: profile.theme_config.linkFill === 'glass' ? 'blur(12px)' : 'none',
                  }} 
                  className={`hover:opacity-90 transition-all cursor-pointer ${
                    themeConfig.buttonStyle === 'rounded' ? 'rounded-lg' : 
                    themeConfig.buttonStyle === 'pill' ? 'rounded-full' : 
                    'rounded-none'
                  } h-fit`}
                >
                  <CardContent className="flex items-center justify-center group relative">
                    {link.icon && socialIcons[link.icon as IconName] ? (
                      <FontAwesomeIcon 
                        icon={socialIcons[link.icon as IconName]} 
                        className="absolute left-5"
                        size='lg'
                      />
                    ) : null}
                    <span className="font-medium">{link.title}</span>
                    <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity absolute top-auto right-5" />
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>
        </div>

        
      </div>
      <div className="flex-1 h-10 align-middle flex items-center justify-center" style={{ color: themeConfig.linkTextColor }}>
        LinkStack
      </div>
    </div>
  )
}