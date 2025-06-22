import {
  Youtube,
  Instagram,
  Twitter,
  Linkedin,
  Facebook,
  Github,
  Twitch,
  Globe,
  Mail,
  Music,
  Link as LinkIcon,
} from 'lucide-react'

export const SOCIAL_PLATFORMS = [
  {
    name: 'Instagram',
    icon: Instagram,
    baseUrl: 'https://instagram.com/',
    placeholder: 'username',
  },
  {
    name: 'YouTube',
    icon: Youtube,
    baseUrl: 'https://youtube.com/@',
    placeholder: 'channel',
  },
  {
    name: 'LinkedIn',
    icon: Linkedin,
    baseUrl: 'https://linkedin.com/in/',
    placeholder: 'username',
  },
  {
    name: 'Twitter',
    icon: Twitter,
    baseUrl: 'https://twitter.com/',
    placeholder: 'username',
  },
  {
    name: 'GitHub',
    icon: Github,
    baseUrl: 'https://github.com/',
    placeholder: 'username',
  },
  {
    name: 'Twitch',
    icon: Twitch,
    baseUrl: 'https://twitch.tv/',
    placeholder: 'username',
  },
  {
    name: 'Facebook',
    icon: Facebook,
    baseUrl: 'https://facebook.com/',
    placeholder: 'username or page',
  },
  {
    name: 'Email',
    icon: Mail,
    baseUrl: 'mailto:',
    placeholder: 'email@example.com',
  },
  {
    name: 'Spotify',
    icon: Music,
    baseUrl: 'https://open.spotify.com/',
    placeholder: 'artist/user link',
  },
  {
    name: 'Custom Link',
    icon: Globe,
    baseUrl: '',
    placeholder: 'https://',
  },
] as const
