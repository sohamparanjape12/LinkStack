import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { 
  faTwitter, 
  faFacebook, 
  faInstagram, 
  faLinkedin, 
  faGithub, 
  faYoutube, 
  faTwitch,
  faDiscord,
  faTiktok,
  faSpotify,
  faMedium,
  faPatreon,
  faWhatsapp
} from '@fortawesome/free-brands-svg-icons';

import {
  faLink,
  faEnvelope,
  faMobile,
  faGlobe,
  faStore,
  faNewspaper,
  faPodcast,
  faCalendar
} from '@fortawesome/free-solid-svg-icons';

export const socialIcons = {
  twitter: faTwitter,
  facebook: faFacebook,
  instagram: faInstagram,
  whatsapp: faWhatsapp,
  linkedin: faLinkedin,
  github: faGithub,
  youtube: faYoutube,
  twitch: faTwitch,
  discord: faDiscord,
  tiktok: faTiktok,
  spotify: faSpotify,
  medium: faMedium,
  patreon: faPatreon,
  email: faEnvelope,
  mobile: faMobile,
  website: faGlobe,
  store: faStore,
  blog: faNewspaper,
  podcast: faPodcast,
  calendar: faCalendar,
  link: faLink
};

export type IconName = keyof typeof socialIcons;
