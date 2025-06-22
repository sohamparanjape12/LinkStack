import { IconName } from '@/config/icons';

export interface Profile {
  id: string
  username: string
  display_name?: string
  bio?: string
  avatar_url?: string
  theme_config: ThemeConfig
  created_at: string
}

export interface Link {
  id: string
  user_id: string
  title: string
  url: string
  icon?: IconName
  position: number
  is_active: boolean,
  created_at: string
}

export interface ThemeConfig {
  backgroundColor: string
  textColor: string
  linkTextColor: string
  fontFamily: string
  backgroundImage?: string
  backgroundStyle: 'solid' | 'gradient'
  buttonStyle: 'sharp' | 'rounded' | 'pill'
  linkFill: 'fill' | 'outline' | 'glass'
  linkShadow: 'none' | 'subtle' | 'hard'
  linkColor?: string
}