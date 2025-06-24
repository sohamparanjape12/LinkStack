'use client'

import { useState, useEffect } from 'react'
import React from 'react'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { GripVertical, Edit, Trash2, ExternalLink, Save, PlusCircle, MinusCircle, Check, ImageIcon, Share, Copy, Sparkle, ArrowRight, Sparkles } from 'lucide-react'
import { toast, Toaster } from 'sonner'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { PopoverClose } from '@radix-ui/react-popover'
import './styles.css'
import { useRouter } from 'next/navigation'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Square, SquareRoundCorner, Circle, PaintBucket, Frame, Glasses, SunDim, CloudFog, Cloud } from 'lucide-react'
import { SOCIAL_PLATFORMS } from '@/config/social-platforms'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { socialIcons, IconName } from '@/config/icons';
import { FONTS } from '@/config/fonts'
import '../../globals.css'
import ThemePresets from '@/components/ThemePresets'
import ThemePresetsCard from '@/components/ThemePresetsCard'
import { Skeleton } from '@/components/ui/skeleton'
import { useDashboardContext, Profile } from '@/contexts/DashboardContext' // Import context

interface Link {
  id: string
  title: string
  url: string
  is_active: boolean
  position: number
  icon?: string
}

const BACKGROUND_COLORS = [
  { name: 'Default', value: '#111827' },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Purple', value: '#8b5cf6' },
  { name: 'Pink', value: '#ec4899' },
  { name: 'Green', value: '#074B34' },
  { name: 'Orange', value: '#f59e0b' },
  { name: 'Red', value: '#ef4444' },
  { name: 'Navy', value: '#1e3a8a' },
  { name: 'Emerald', value: '#047857' },
  { name: 'Violet', value: '#7c3aed' },
  { name: 'Rose', value: '#be123c' },
  { name: 'Slate', value: '#334155' },
  { name: 'Custom', value: 'custom' }
]

// Add Custom to LINK_COLORS
const LINK_COLORS = [
  { name: 'Default', value: '#111827' },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Purple', value: '#8b5cf6' },
  { name: 'Pink', value: '#ec4899' },
  { name: 'Green', value: '#074B34' },
  { name: 'Orange', value: '#f59e0b' },
  { name: 'Red', value: '#ef4444' },
  { name: 'Navy', value: '#1e3a8a' },
  { name: 'Emerald', value: '#047857' },
  { name: 'Violet', value: '#7c3aed' },
  { name: 'Rose', value: '#be123c' },
  { name: 'Slate', value: '#334155' },
  { name: 'Transparent', value: '#00000000' },
  { name: 'Custom', value: 'custom' }
]

// Add to BACKGROUND_COLORS array
const BACKGROUND_STYLES = [
  { name: 'Solid', value: 'solid' },
  { name: 'Gradient', value: 'gradient' },
] as const;

const TEXT_COLORS = [
  { name: 'Default', value: '#A9C7EA' },
  { name: 'White', value: '#FFFFFF' },
  { name: 'Blue', value: '#60a5fa' },
  { name: 'Purple', value: '#8b5cf6' },
  { name: 'Pink', value: '#ec4899' },
  { name: 'Green', value: '#22c55e' },
  { name: 'Yellow', value: '#fde047' },
  { name: 'Orange', value: '#fb923c' },
  { name: 'Red', value: '#ef4444' },
  { name: 'Gray', value: '#9ca3af' },
  { name: 'Custom', value: 'custom' }
]

export default function ProfileCanvasEditor() {
  const { 
    user, // Supabase user object from context
    currentProfile, 
    setCurrentProfile, // This is the state setter for currentProfile from context
  } = useDashboardContext();

  const [links, setLinks] = useState<Link[]>([])
  const [allProfileLinks, setAllProfileLinks] = useState<Link[]>([]); // Tracks all links for the current profile
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editingLink, setEditingLink] = useState<string | null>(null)
  const [newLink, setNewLink] = useState({ title: '', url: '' })
  const [availableLinks, setAvailableLinks] = useState<Link[]>([])
  const [canvasLinks, setCanvasLinks] = useState<Link[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [isEditingName, setIsEditingName] = useState(false)
  const [tempName, setTempName] = useState('')
  const [isEditingBio, setIsEditingBio] = useState(false)
  const [tempBio, setTempBio] = useState('')
  const [backgroundImage, setBackgroundImage] = useState<File | null>(null)
  const [editingLinkData, setEditingLinkData] = useState<{
    id: string;
    title: string;
    url: string;
    icon?: string;
  }>( { id: '', title: '', url: '' });
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);
  const [avatarImage, setAvatarImage] = useState<File | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState(SOCIAL_PLATFORMS[SOCIAL_PLATFORMS.length - 1])
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const [isIconPickerOpen, setIsIconPickerOpen] = useState(false);
  
  const [aiTheme, setAITheme] = useState<any | null>(null)
  const [aiThemes, setAIThemes] = useState<any[] | null>(null)
  const [aiThemeLoading, setAIThemeLoading] = useState(false)
  const [aiThemeError, setAIThemeError] = useState(false)

  
  const supabase = createClientComponentClient()

  useEffect(() => {
    // Only load links if the user or the profile's username changes.
    // Theme changes within currentProfile should not trigger this.
    if (user?.id && currentProfile?.username) {
      loadLinksForProfile();
    }
  }, [user?.id, currentProfile?.username]); // More specific dependencies

  const getStoragePathFromUrl = (publicUrl: string, bucketName: string): string | null => {
    try {
      const url = new URL(publicUrl);
      const pathSegments = url.pathname.split('/');
      const bucketIndex = pathSegments.indexOf(bucketName);
      if (bucketIndex !== -1 && bucketIndex < pathSegments.length - 1) {
        return pathSegments.slice(bucketIndex + 1).join('/');
      }
      return null;
    } catch (e) { return null; }
  };

  const loadLinksForProfile = async () => {
    if (!user?.id || !currentProfile?.username) { // Check for specific properties needed for fetching
      setLoading(false);
      return;
    }
    setLoading(true);
    try {

      // Load links
      const { data: linksData, error: linksError } = await supabase
        .from('links')
        .select('*')
        .eq('user_id', user.id)
        .eq('profile', currentProfile.username) 
        .order('position', { ascending: true })

      if (linksError) throw linksError
      setAllProfileLinks(linksData || []); // Store all links
      const activeLinks = linksData?.filter(link => link.is_active) || []
      const inactiveLinks = linksData?.filter(link => !link.is_active) || []
      // The local `links` state (setLinks) seems unused for active/inactive lists, consider removing if not used elsewhere.
      setCanvasLinks(activeLinks)
      setAvailableLinks(inactiveLinks)
    } catch (error) {
      console.error('Error loading links:', error)
      toast.error('Failed to load links for the profile')
    } finally {
      setLoading(false)
    }
  }

const handleDragEnd = async (result: any) => {
  const { source, destination, draggableId } = result
  
  if (!destination) return

  // Handle drag from canvas to available links (REMOVE from canvas)
  if (source.droppableId === 'links' && destination.droppableId === 'available-links') {
    
    const draggedLink = canvasLinks[source.index]
    if (!draggedLink) return

    try {
      await supabase
        .from('links')
        .update({ is_active: false })
        .eq('id', draggedLink.id)

      const updatedCanvasLinks = canvasLinks.filter((_, index) => index !== source.index)
      const reindexedCanvasLinks = updatedCanvasLinks.map((link, index) => ({ 
        ...link, 
        position: index 
      }))
      
      // Update position for remaining canvas links
      for (const link of reindexedCanvasLinks) {
        await supabase
          .from('links')
          .update({ position: link.position})
          .eq('id', link.id)
      }

      setCanvasLinks(reindexedCanvasLinks)
      setAvailableLinks([...availableLinks, { ...draggedLink, is_active: false }])
      toast.success('Link removed from canvas!')
    } catch (error) {
      console.error('Error removing link:', error)
      toast.error('Failed to remove link')
    }
    return
  }

  // Handle canvas reordering
  if (source.droppableId === 'links' && destination.droppableId === 'links') {
    const items = Array.from(canvasLinks)
    const [reorderedItem] = items.splice(source.index, 1)
    items.splice(destination.index, 0, reorderedItem)

    const updatedItems = items.map((item, index) => ({
      ...item,
      position: index
    }))

    setCanvasLinks(updatedItems)

    try {
      for (const item of updatedItems) {
        await supabase
          .from('links')
          .update({ position: item.position })
          .eq('id', item.id)
      }
      toast.success('Links reordered!')
    } catch (error) {
      console.error('Error updating order:', error)
      toast.error('Failed to update order')
      loadLinksForProfile() // Reload on error
    }
  }
}

  const addNewLink = async () => {
    if (!editingLinkData.title || !editingLinkData.url || !currentProfile || !user) return

    // Calculate the next position safely
    const newPosition = allProfileLinks.length > 0
        ? Math.max(...allProfileLinks.map(link => link.position), -1) + 1 // Ensure Math.max doesn't get -Infinity for empty array, start from 0
        : 0;

    try {
      const { data, error } = await supabase
        .from('links')
        .insert({
          user_id: user.id, // Use user.id from context
          title: editingLinkData.title,
          url: editingLinkData.url,
          position: newPosition,
          is_active: false,
          icon: selectedIcon || null,
          created_at: new Date().toISOString(),
          profile: currentProfile.username
        })
        .select()
        .single()

        if (error) throw error

        // Add to available links immediately
        setAllProfileLinks(prev => [...prev, data]);
        setAvailableLinks([...availableLinks, data])
        setEditingLinkData({ id: '', title: '', url: '' })
        setSelectedIcon(null)
        setDialogOpen(false)
        toast.success('Link added! Drag it to your canvas.')
    } catch (error) {
        console.error('Error adding link:', error)
        toast.error('Failed to add link')
    }
  }

  const deleteLink = async (linkId: string) => {
    try {
      // Delete from Supabase first
      const { error } = await supabase
        .from('links')
        .delete()
        .eq('id', linkId)

      if (error) throw error

      // Update both local states after successful database deletion
      setAllProfileLinks(prev => prev.filter(link => link.id !== linkId));
      setCanvasLinks(prev => prev.filter(link => link.id !== linkId));
      setAvailableLinks(prev => prev.filter(link => link.id !== linkId));
      setLinks(prev => prev.filter(link => link.id !== linkId));
      
      toast.success('Link deleted!')
    } catch (error) {
      console.error('Error deleting link:', error)
      toast.error('Failed to delete link')
      // Reload links in case of error to ensure UI is in sync with database
      loadLinksForProfile();
    }
  }

  const saveProfile = async () => {
    if (!currentProfile || !user) return

    setSaving(true)
    let success = false; // Flag to track if core operations succeeded
    try {
      let backgroundImageUrl = currentProfile.theme_config.backgroundImage

      // Upload new image if one is selected
      if (backgroundImage) {
        // Validate file size (max 2MB)
        if (backgroundImage.size > 2 * 1024 * 1024) {
          throw new Error('Image size must be less than 2MB')
        }

        // Get file extension and validate
        const fileExt = backgroundImage.name.split('.').pop()?.toLowerCase()
        if (!fileExt || !['jpg', 'jpeg', 'png', 'gif'].includes(fileExt)) {
          throw new Error('Invalid file type. Please upload a JPG, PNG or GIF')
        }

        // Create unique filename
        const fileName = `${Date.now()}.${fileExt}`
        const filePath = `backgrounds/${user.id}/${fileName}`

        // Delete old image if exists and is not a URL
        if (backgroundImageUrl && backgroundImageUrl.includes('supabase')) {
          const oldPath = backgroundImageUrl.split('/').pop()
          if (oldPath) {
            await supabase.storage
              .from('backgrounds')
              .remove([`backgrounds/${user.id}/${oldPath}`])
          }
        }

        // Compress image before upload
        const compressedImage = await new Promise((resolve) => {
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')
          const img = new Image()
          img.onload = () => {
            const maxSize = 800
            let width = img.width
            let height = img.height
            if (width > height && width > maxSize) {
              height *= maxSize / width
              width = maxSize
            } else if (height > maxSize) {
              width *= maxSize / height
              height = maxSize
            }
            canvas.width = width
            canvas.height = height
            ctx?.drawImage(img, 0, 0, width, height)
            canvas.toBlob(resolve, 'image/jpeg', 0.8)
          }
          img.src = URL.createObjectURL(backgroundImage)
        })

        const { error: uploadError } = await supabase.storage
          .from('backgrounds')
          .upload(filePath, compressedImage as Blob, {
            cacheControl: '31536000',
            upsert: true
          })

        if (uploadError) {
          console.error('SaveProfile: Upload error:', uploadError)
          throw new Error('Failed to upload image')
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('backgrounds')
          .getPublicUrl(filePath)
        backgroundImageUrl = publicUrl
      }

      // Update profile
      const { error } = await supabase
        .from('profiles')
        .update({
          display_name: currentProfile.display_name,
          bio: currentProfile.bio,
          avatar_url: currentProfile.avatar_url,
          theme_config: {
            ...currentProfile.theme_config,
            backgroundImage: backgroundImageUrl
          },
        })
        .eq('id', user.id)
        .eq('username', currentProfile.username)

      if (error) {
        console.error('SaveProfile: Profile update error:', error);
        throw error;
      }
    
      // Update local state
      setCurrentProfile(prevProfile => {
        return prevProfile ? {
          ...prevProfile,
          theme_config: {
            ...prevProfile.theme_config,
            backgroundImage: backgroundImageUrl
          }
        } : null;
      })
      setBackgroundImage(null)
      toast.success('Profile saved!')
      success = true;

    } catch (error) {
      console.error('SaveProfile: Catch block error:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to save profile')
      // Ensure saving is false on error, before any refresh attempt
      setSaving(false);
    }

    // Only refresh if the core save operations were successful
    if (success) {
      setSaving(false); // Update UI first to remove "Saving..."

      // Allow React to process state update and re-render before router.refresh()
      await new Promise(resolve => setTimeout(resolve, 0)); 

      // Refresh the route to ensure the layout and context re-fetch the latest profile data
      router.refresh();
    }
  }

  const handleNameUpdate = async () => {
    if (!currentProfile) return
    try {
      setCurrentProfile(prev => prev ? { ...prev, display_name: tempName } : null)
      setIsEditingName(false)
      toast.success('Name updated!')
    } catch (error) {
      console.error('Error updating name:', error)
      toast.error('Failed to update name')
    }
  }

  const handleBioUpdate = async () => {
    if (!currentProfile) return
    try {
      setCurrentProfile(prev => prev ? { ...prev, bio: tempBio } : null)
      setIsEditingBio(false)
      toast.success('Bio updated!')
    } catch (error) {
      console.error('Error updating bio:', error)
      toast.error('Failed to update bio')
    }
  }

  const handleLinkUpdate = async () => {
    if (!editingLinkData.id || !editingLinkData.title || !editingLinkData.url) return;

    try {
      const { error } = await supabase
        .from('links')
        .update({
          title: editingLinkData.title,
          url: editingLinkData.url,
          icon: editingLinkData.icon // Add this line
        })
        .eq('id', editingLinkData.id);

      if (error) throw error;

      // Update local state
      setCanvasLinks(canvasLinks.map(link => 
        link.id === editingLinkData.id 
          ? { ...link, title: editingLinkData.title, url: editingLinkData.url, icon: editingLinkData.icon }
          : link
      ));
      setAvailableLinks(availableLinks.map(link => 
        link.id === editingLinkData.id 
          ? { ...link, title: editingLinkData.title, url: editingLinkData.url, icon: editingLinkData.icon }
          : link
      ));

      setEditingLinkData({ id: '', title: '', url: '' });
      setSelectedIcon(null);
      setDialogOpen(false);
      toast.success('Link updated!')
    } catch (error) {
      console.error('Error updating link:', error);
      toast.error('Failed to update link')
    }
  }

  const handleEditLink = (link: Link) => {
    setEditingLinkData({
      id: link.id,
      title: link.title,
      url: link.url,
      icon: link.icon // Add this line
    });
    setSelectedIcon(link.icon || null); // Add this line
    setDialogOpen(true);
  }

  const handleAvatarUpdate = async (file: File) => {
    if (!currentProfile || !user) return;
    try {
      if (file.size > 2 * 1024 * 1024) {
        throw new Error('Image size must be less than 2MB');
      }

      const fileExt = file.name.split('.').pop()?.toLowerCase();
      if (!fileExt || !['jpg', 'jpeg', 'png'].includes(fileExt)) {
        throw new Error('Please upload a JPG or PNG file');
      }

      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `avatars/${user.id}/${fileName}`;

      // Remove old avatar if exists
      if (currentProfile.avatar_url) {
        const oldStoragePath = getStoragePathFromUrl(currentProfile.avatar_url, 'avatars');
        if (oldStoragePath) {
          await supabase.storage
            .from('avatars')
            .remove([oldStoragePath]);
        }
      }

      // Compress avatar before upload
      const compressedImage = await new Promise((resolve) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.onload = () => {
          const size = 400;
          canvas.width = size;
          canvas.height = size;
          ctx?.drawImage(img, 0, 0, size, size);
          canvas.toBlob(resolve, 'image/jpeg', 0.8);
        };
        img.src = URL.createObjectURL(file);
      });

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, compressedImage as Blob, {
          cacheControl: '31536000',
          upsert: true
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);

      setCurrentProfile(prev => prev ?{ ...prev, avatar_url: publicUrl } : null);
      setIsEditingAvatar(false);
      setAvatarImage(null);
      toast.success('Avatar updated!');
    } catch (error) {
      console.error('Error updating avatar:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update avatar');
    }
  }

  const adjust = (color: string, amount: number) => {
      return '#' + color.replace(/^#/, '').replace(/../g, color => ('0'+Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2));
  }

  const handleRemoveAvatar = async () => {
    if (!currentProfile) return;

    try {
      if (currentProfile.avatar_url) {
        const storagePath = getStoragePathFromUrl(currentProfile.avatar_url, 'avatars');
        if (storagePath) {
          const { error: deleteError } = await supabase.storage
            .from('avatars')
            .remove([storagePath]);

          if (deleteError) {
            console.error('Error deleting avatar from storage:', deleteError);
            toast.error('Could not remove stored avatar image, but will clear from profile.');
          }
        }
      }

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: null })
        .eq('id', user?.id)
        .eq('username', currentProfile.username);

      if (updateError) throw updateError;

      setCurrentProfile(prev => prev ? { ...prev, avatar_url: undefined } : null);
      setIsEditingAvatar(false);
      setAvatarImage(null);
      toast.success('Avatar removed!');
    } catch (error) {
      console.error('Error removing avatar:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to remove avatar');
    }
  };

  function extractGradientColors(gradientString: string) {
    const matches = [...gradientString.matchAll(/#([0-9a-fA-F]{6})/g)];
    return matches.map(m => `#${m[1]}`);
  }

  const linkstackUrl = process.env.NEXT_PUBLIC_URL + '/' + currentProfile?.username

  interface SocialPlatform {
    name: string;
    icon: React.ComponentType<{ className?: string }>;
    baseUrl: string;
    placeholder: string;
  }

  function shareToPlatform(platform: SocialPlatform, linkstackUrl: string): void {
    const encoded = encodeURIComponent(linkstackUrl);
    let shareUrl = '';

    switch (platform.name) {
      case 'Twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encoded}`;
        break;
      case 'Facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encoded}`;
        break;
      case 'LinkedIn':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`;
        break;
      case 'Email':
        shareUrl = `mailto:?subject=Check out my Linkstack&body=${encoded}`;
        break;
      case 'WhatsApp':
        shareUrl = `https://wa.me/?text=${encoded}`;
        break;
      case 'Telegram':
        shareUrl = `https://t.me/share/url?url=${encoded}`;
        break;
      default:
        alert(`Sharing to ${platform.name} not supported.`);
        return;
    }

    window.open(shareUrl, '_blank');
  }

  const handleGenerateAIThemes = async () => {
    setAIThemeError(false)
    setAIThemes([])
    setAIThemeLoading(true)
    try{
      const res = await fetch(`/api/aithemes?ts=${Date.now()}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      });

      const data = await res.json();

      if (Array.isArray(data.result) && data.result.length > 0) {
        // Pick one of the returned themes, e.g., randomly:

        setAIThemes(data.result);
      } else {
        console.error('Invalid result format or empty array:', data);
      }
    } catch (err) {
      console.error('Failed to fetch AI theme:', err);
    }

    setAIThemeLoading(false);
  }


  const router = useRouter()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen w-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-900"></div>
      </div>
    )
  }

  if (!currentProfile) return <div>Select or create a profile to start editing.</div>

  return (
    <div className="w-full">
      <Toaster position="bottom-right" richColors closeButton />

      <div className="flex flex-col lg:flex-row w-full h-full relative">
        {/* Sidebar - Controls */}
        <div className={`w-full h-full relative border-0 flex-4 lg:border-r-2 p-4 lg:p-6 flex flex-col gap-4 ${
          isPreviewMode ? 'hidden lg:flex' : 'flex'
        }`}>
          <div className='lg:absolute lg:right-5 lg:bottom-5 lg:z-1000 flex flex-row gap-2 w-full lg:w-auto mb-4 lg:mb-0'>
            <Button 
              onClick={() => window.open('/' + currentProfile.username)}
              className="flex-1 lg:flex-none"
            >
              <span className="hidden lg:inline">View LinkStack</span>
              <span className="lg:hidden">View</span>
              <ExternalLink className="h-4 w-4" />
            </Button>
            <Button 
              onClick={saveProfile} 
              disabled={saving}
              className="flex-1 lg:flex-none"
            >
              <Save className="h-4 w-4" />
              {saving ? 'Saving...' : 'Save Profile'}
            </Button>
            <Button 
              onClick={() => setIsPreviewMode(true)}
              className="flex-1 lg:hidden"
              variant="default"
            >
              <span>Preview</span>
              <ExternalLink className="h-4 w-4 ml-2" />
            </Button>
          </div>

          {/* Links */}
          <Card className=''>
              <CardHeader>
                <CardTitle className='flex items-center justify-between'>
                    <h1>Links</h1>
                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                      <form>
                        <DialogTrigger asChild>
                          <span className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 cursor-pointer">
    Add Link
  </span>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>
                              {editingLinkData.id ? 'Edit Link' : 'Add Link'}
                            </DialogTitle>
                            <DialogDescription>
                              {editingLinkData.id ? 'Update your link details.' : 'Choose a platform or add a custom link'}
                            </DialogDescription>
                          </DialogHeader>
                          
                          {!editingLinkData.id && (
                            <div className="grid grid-cols-2 gap-2 mb-4">
                              {SOCIAL_PLATFORMS.map((platform) => (
                                <Button
                                  key={platform.name}
                                  variant={selectedPlatform.name === platform.name ? 'default' : 'outline'}
                                  className="w-full flex items-center gap-2"
                                  onClick={() => {
                                    setSelectedPlatform(platform)
                                    setEditingLinkData({
                                      ...editingLinkData,
                                      title: platform.name,
                                      url: platform.baseUrl
                                    })
                                  }}
                                >
                                  <platform.icon className="h-4 w-4" />
                                  {platform.name}
                                </Button>
                              ))}
                            </div>
                          )}

                          <div className="space-y-4">
                            <div className="flex items-center gap-2">
                              <div className="flex-1 space-y-2">
                                <Label>Title</Label>
                                <Input
                                  placeholder="Link title"
                                  value={editingLinkData.title}
                                  onChange={(e) => setEditingLinkData({...editingLinkData, title: e.target.value})}
                                />
                              </div>
                              <div className="pt-6">
                                <Button
                                  variant="outline"
                                  onClick={() => setIsIconPickerOpen(true)}
                                >
                                  {selectedIcon ? (
                                    <FontAwesomeIcon icon={socialIcons[selectedIcon as IconName]} className="h-6 w-6" />
                                  ) : (
                                    "Add Icon"
                                  )}
                                </Button>
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <Label>URL</Label>
                              <div className="flex gap-2">
                                {selectedPlatform.baseUrl && !editingLinkData.id && (
                                  <div className="flex items-center px-3 rounded-lg bg-muted text-sm">
                                    {selectedPlatform.baseUrl}
                                  </div>
                                )}
                                <Input
                                  className={selectedPlatform.baseUrl && !editingLinkData.id ? "rounded-lg" : ""}
                                  placeholder={selectedPlatform.placeholder}
                                  value={editingLinkData.id ? editingLinkData.url : editingLinkData.url.replace(selectedPlatform.baseUrl, '')}
                                  onChange={(e) => setEditingLinkData({
                                    ...editingLinkData,
                                    url: editingLinkData.id 
                                      ? e.target.value 
                                      : selectedPlatform.baseUrl + e.target.value
                                  })}
                                />
                              </div>
                            </div>
                          </div>
                          
                          <DialogFooter>
                            <DialogClose asChild>
                              <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button 
                              onClick={editingLinkData.id ? handleLinkUpdate : addNewLink}
                              disabled={
                                editingLinkData.title.trim() === '' ||
                                !editingLinkData.url ||
                                editingLinkData.url.split('/').pop() === '' ||
                                (editingLinkData.url.split('/').pop()?.length ?? 0) < 2 ||
                                saving
                                  ? true
                                  : false
                              }
                            >
                              {editingLinkData.id ? 'Save Changes' : 'Add Link'}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </form>
                  </Dialog>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <DragDropContext onDragEnd={handleDragEnd}>
                  <div className='max-h-[150px] overflow-y-auto py-2 px-4'>
                    <Droppable droppableId="available-links">
                      {(provided) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className="space-y-2"
                        >
                          {availableLinks.length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-4">
                              No available links
                            </p>
                          ) : (
                            availableLinks.map((link, index) => (
                              <Draggable key={link.id} draggableId={link.id} index={index}>
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className="p-3 bg-muted rounded-lg border group hover:bg-muted/80"
                                  >
                                    <div className="flex items-center justify-between">
                                      
                                      <span className="text-sm font-medium truncate">
                                        {link.icon && socialIcons[link.icon as IconName] && (
                                          <FontAwesomeIcon 
                                            icon={socialIcons[link.icon as IconName]} 
                                            className="h-6 w-6 mr-2" 
                                          />
                                        )}
                                        {link.title}
                                      </span>
                                      <div className="flex gap-1">
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          className="h-8 w-8 p-0"
                                          onClick={() => window.open(link.url, '_blank')}
                                        >
                                          <ExternalLink className="h-4 w-4" />
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          className="h-8 w-8 p-0"
                                          onClick={async () => {
                                            try {
                                              await supabase
                                                .from('links')
                                                .update({ 
                                                  is_active: true,
                                                  position: canvasLinks.length 
                                                })
                                                .eq('id', link.id)
                                            
                                              setAvailableLinks(availableLinks.filter(l => l.id !== link.id))
                                              setCanvasLinks([...canvasLinks, { ...link, is_active: true }])
                                              toast.success('Link added to canvas')
                                            } catch (error) {
                                              console.error('Error activating link:', error)
                                              toast.error('Failed to add link to canvas')
                                            }
                                          }}
                                        >
                                          <PlusCircle className="h-4 w-4" />
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          className="h-8 w-8 p-0 text-red-600 hover:bg-red-100"
                                          onClick={() => deleteLink(link.id)}
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </Draggable>
                            ))
                          )}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                </DragDropContext>
              </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Theme</CardTitle>
            </CardHeader>
            <CardContent className='flex flex-col gap-2 flex-wrap'>
              {/* Background controls */}
              <div className='flex flex-wrap gap-2'>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant={'outline'} className="justify-between" disabled={currentProfile.theme_config.backgroundImage || backgroundImage !== null ? true : false}>
                      <div style={{ background: currentProfile.theme_config.backgroundColor }} className='w-4 h-4 rounded border'></div>
                      Background
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="flex flex-col gap-4">
                    <div>
                      <Label className="text-sm font-medium mb-2">Style</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {BACKGROUND_STYLES.map((style) => (
                          <Button
                            key={style.value}
                            variant="outline"
                            className={`w-full ${
                              currentProfile.theme_config.backgroundStyle === style.value
                                ? 'border-2 border-primary ring-2 ring-primary/20'
                                : ''
                            }`}
                            onClick={() => setCurrentProfile(prev => prev ? {
                              ...prev,
                              theme_config: {
                                ...prev.theme_config,
                                backgroundStyle: style.value,
                                backgroundColor: style.value === 'gradient' ? `linear-gradient(135deg, #FFFFFF 0%, #0f0f0f 100%)` : '#0a0a0a'
                              }
                            } : null)}
                          >
                            {style.name}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div>
                      {
                        currentProfile.theme_config.backgroundStyle === 'gradient' ? (
                          <div>
                            <Label className="text-sm font-medium mb-2">Gradient</Label>
                            <div className="flex items-center justify-center gap-2 h-15">
                              <input
                                type="color"
                                className='w-full h-full'
                                value={extractGradientColors(currentProfile.theme_config.backgroundColor)[0]}
                                onChange={(e) => {
                                  const newBG = currentProfile.theme_config.backgroundColor.replace(
                                    /(#([0-9a-fA-F]{6}))/,
                                    e.target.value.toUpperCase()
                                  );

                                  setCurrentProfile(prev => prev ? {
                                    ...prev,
                                    theme_config: {...prev.theme_config,
                                      backgroundColor: newBG
                                    }
                                    } : null)
                                }}
                              />
                              <ArrowRight size={40} />
                              <input
                                type='color'
                                className='w-full h-full'
                                value={extractGradientColors(currentProfile.theme_config.backgroundColor)[1]}
                                onChange={(e) => {
                                  const colors = [...currentProfile.theme_config.backgroundColor.matchAll(/#([0-9a-fA-F]{6})/g)];
                                  if (colors.length < 2) return '' // Not a valid 2-color gradient

                                  const lastColor = colors[colors.length - 1][0];
                                  const newBG = currentProfile.theme_config.backgroundColor.replace(lastColor, e.target.value.toUpperCase());

                                  setCurrentProfile(prev => prev ? {
                                    ...prev,
                                    theme_config: {...prev.theme_config,
                                      backgroundColor: newBG
                                    }
                                    } : null)
                                }}
                              />
                            </div>
                          </div>
                        ) : (
                          <>
                          <Label className="text-sm font-medium mb-2">Color</Label>
                          <div className="grid grid-cols-3 gap-2">
                            {BACKGROUND_COLORS.map((color) => (
                              <PopoverClose
                                key={color.value}
                                onClick={() => {
                                  if (color.value === 'custom') {
                                    // Create and trigger a hidden color input
                                    const input = document.createElement('input')
                                    input.type = 'color'
                                    input.value = currentProfile.theme_config.backgroundColor
                                    input.onchange = (e) => {
                                      setCurrentProfile(prev => prev ? {
                                        ...prev,
                                        theme_config: {
                                          ...prev.theme_config,
                                          backgroundColor: (e.target && (e.target as HTMLInputElement).value) || prev.theme_config.backgroundColor || '#111827'
                                        }
                                      } : null)
                                    }
                                    input.click()
                                  } else {
                                    setCurrentProfile(prev => prev ? {
                                      ...prev,
                                      theme_config: {
                                        ...prev.theme_config,
                                        backgroundColor: color.value
                                      }
                                    } : null)
                                  }
                                }}
                                className={`w-full h-10 rounded-lg border-2 transition-all ${
                                  currentProfile.theme_config.backgroundColor === color.value
                                    ? 'border-foreground ring-2 ring-foreground/20'
                                    : 'border-border hover:border-foreground/50'
                                }`}
                                style={{ 
                                  backgroundColor: color.value === 'custom' ? '#ffffff' : color.value,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}
                                title={color.name}
                              >
                                {color.value === 'custom' && '🎨'}
                              </PopoverClose>
                            ))}
                          </div>
                          </>
                        )
                      }
                    </div>
                  </PopoverContent>
                </Popover>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant={'outline'} className="justify-between">
                      <div style={{ backgroundColor: currentProfile.theme_config.textColor }} className='w-4 h-4 rounded border'></div>
                      Text
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <div className="grid grid-cols-3 gap-2">
                      {TEXT_COLORS.map((color) => (
                        <PopoverClose
                          key={color.value}
                          onClick={() => {
                            if(color.value === 'custom') {
                              // Create and trigger a hidden color input
                              const input = document.createElement('input')
                              input.type = 'color'
                              input.value = currentProfile.theme_config.textColor
                              input.onchange = (e) => {
                                setCurrentProfile(prev => prev ? {
                                  ...prev,
                                  theme_config: {
                                    ...prev.theme_config,
                                    textColor: (e.target && (e.target as HTMLInputElement).value) || prev.theme_config.textColor || '#A9C7EA'
                                  }
                                } : null)
                              }
                              input.click()
                            }
                            else{
                              setCurrentProfile(prev => prev ? {...prev, theme_config: {...prev.theme_config, textColor: color.value || prev.theme_config.textColor || '#A9C7EA'}} : null)
                            }
                          }}
                          className={`w-full h-10 rounded-lg border-2 transition-all ${
                            currentProfile.theme_config.textColor === color.value
                              ? 'border-foreground ring-2 ring-foreground/20'
                              : 'border-border hover:border-foreground/50'
                          }`}
                          style={{ 
                              backgroundColor: color.value === 'custom' ? '#ffffff' : color.value,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                            title={color.name}
                          >
                            {color.value === 'custom' && '🎨'}
                          </PopoverClose>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>

                <Select 
                  value={currentProfile.theme_config.fontFamily}
                  onValueChange={(value) => setCurrentProfile(prev => prev ? {
                    ...prev,
                    theme_config: { ...prev.theme_config, fontFamily: value }
                  } : null)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue>
                      <div className="flex items-center gap-2">
                        <span style={{ fontFamily: currentProfile.theme_config.fontFamily }}>Aa</span>
                        <span>{FONTS.find(f => f.value === currentProfile.theme_config.fontFamily)?.name || 'Default'}</span>
                      </div>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {FONTS.map((font) => (
                      <SelectItem 
                        key={font.value} 
                        value={font.value}
                        className="flex items-center gap-2"
                      >
                        <div className="flex items-center gap-2">
                          <span style={{ fontFamily: font.value }}>Aa</span>
                          <span>{font.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant={'outline'} className="justify-between align-center flex items-center">
                      <ImageIcon className='h-4 w-4' />
                      <p>Image</p>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <div className="flex flex-col gap-2">
                      <h1 className='font-bold mb-1'>Background Image</h1>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            setBackgroundImage(file)
                            const reader = new FileReader()
                            reader.onloadend = () => {
                              setCurrentProfile(prev => prev ? {
                                ...prev, 
                                theme_config: {
                                  ...prev.theme_config, 
                                  backgroundImage: reader.result as string
                                }
                              } : null)
                            }
                            reader.readAsDataURL(file)
                          }
                        }}
                      />
                      {currentProfile.theme_config.backgroundImage && (
                          <img src={currentProfile.theme_config.backgroundImage} alt="Background" width={'100%'} height={100} style={{ objectFit: "cover", borderRadius: 5, }} />
                      )}
                      {currentProfile.theme_config.backgroundImage && (
                        <Button 
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            setCurrentProfile(prev => prev ? {
                              ...prev,
                              theme_config: {
                                ...prev.theme_config,
                                backgroundImage: undefined
                              }
                            } : null)
                            setBackgroundImage(null)
                          }}
                        >
                          Remove Background
                        </Button>
                      )}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              
              {/* Link Style Controls */}
              <div className="space-y-0">
                <div className="space-y-0">
                  <div className="flex flex-wrap gap-2">

                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant={'outline'} className="justify-between">
                          <div style={{ backgroundColor: currentProfile.theme_config.linkTextColor }} className='w-4 h-4 rounded border'></div>
                          Link Text
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent>
                        <div className="grid grid-cols-3 gap-2">
                          {TEXT_COLORS.map((color) => (
                            <PopoverClose
                              key={color.value}
                              onClick={() => {
                                if (color.value === 'custom') {
                                  // Create and trigger a hidden color input
                                  const input = document.createElement('input')
                                  input.type = 'color'
                                  input.value = currentProfile.theme_config.linkTextColor
                                  input.onchange = (e) => {
                                    setCurrentProfile(prev => prev ? {
                                      ...prev,
                                      theme_config: {
                                        ...prev.theme_config,
                                        linkTextColor: (e.target && (e.target as HTMLInputElement).value) || prev.theme_config.linkTextColor || '#A9C7EA'
                                      }
                                    } : null)
                                  }
                                  input.click()
                                }
                                else{
                                  setCurrentProfile(prev => prev ? {...prev, theme_config: {...prev.theme_config, linkTextColor: color.value}} : null)
                                }
                                }
                              }
                              className={`w-full h-10 rounded-lg border-2 transition-all ${
                                currentProfile.theme_config.linkTextColor === color.value
                                  ? 'border-foreground ring-2 ring-foreground/20'
                                  : 'border-border hover:border-foreground/50'
                              }`}
                              style={{ 
                              backgroundColor: color.value === 'custom' ? '#ffffff' : color.value,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                            title={color.name}
                          >
                            {color.value === 'custom' && '🎨'}
                          </PopoverClose>
                          ))}
                        </div>
                      </PopoverContent>
                    </Popover>

                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant={'outline'} className="justify-between">
                          <div style={{ backgroundColor: currentProfile.theme_config.linkColor }} className='w-4 h-4 rounded border'></div>
                          Link Color
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent>
                        <div className="grid grid-cols-3 gap-2">
                          {LINK_COLORS.map((color) => (
                            <PopoverClose
                              key={color.value}
                              onClick={() => {
                                if (color.value === 'custom') {
                                // Create and trigger a hidden color input
                                const input = document.createElement('input')
                                input.type = 'color'
                                input.value = currentProfile.theme_config.linkColor || ''
                                input.onchange = (e) => {
                                  setCurrentProfile(prev => prev ? {
                                    ...prev,
                                    theme_config: {
                                      ...prev.theme_config,
                                      linkColor: (e.target && (e.target as HTMLInputElement).value) || prev.theme_config.linkColor || '#111827'
                                    }
                                  } : null)
                                }
                                input.click()
                              }
                                else{
                                  setCurrentProfile(prev => prev ? {...prev, theme_config: {...prev.theme_config, linkColor: color.value}} : null)
                                }
                              }}
                              className={`w-full h-10 rounded-lg border-2 transition-all ${
                                currentProfile.theme_config.linkColor === color.value
                                  ? 'border-foreground ring-2 ring-foreground/20'
                                  : 'border-border hover:border-foreground/50'
                              }`}
                              style={{ 
                              backgroundColor: color.value === 'custom' ? '#ffffff' : color.value,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                            title={color.name}
                          >
                            {color.value === 'custom' && '🎨'}
                          </PopoverClose>
                          ))}
                        </div>
                      </PopoverContent>
                    </Popover>

                    <Select 
                      value={currentProfile.theme_config.buttonStyle}
                      onValueChange={(value) => setCurrentProfile(prev => prev ? {
                                              ...prev,
                                              theme_config: { ...prev.theme_config, buttonStyle: value as "sharp" | "rounded" | "pill" }
                                            } : null)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select style" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sharp">
                          <div className="flex items-center gap-2">
                            <Square className="h-4 w-4" />
                            <span>Sharp</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="rounded">
                          <div className="flex items-center gap-2">
                            <SquareRoundCorner className="h-4 w-4" />
                            <span>Rounded</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="pill">
                          <div className="flex items-center gap-2">
                            <Circle className="h-4 w-4" />
                            <span>Pill</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>

                    <Select
                      value={currentProfile.theme_config.linkFill}
                      onValueChange={(value) => setCurrentProfile(prev => prev ? {
                        ...prev,
                        theme_config: { ...prev.theme_config, linkFill: value as "fill" | "outline" | "glass" }
                      } : null)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select fill" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fill">
                          <div className="flex items-center gap-2">
                            <PaintBucket className="h-4 w-4" />
                            <span>Fill</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="outline">
                          <div className="flex items-center gap-2">
                            <Frame className="h-4 w-4" />
                            <span>Outline</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="glass">
                          <div className="flex items-center gap-2">
                            <Glasses className="h-4 w-4" />
                            <span>Glass</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>

                    <Select
                      value={currentProfile.theme_config.linkShadow}
                      onValueChange={(value) => setCurrentProfile(prev => prev ? {
                        ...prev,
                        theme_config: { ...prev.theme_config, linkShadow: value as "none" | "subtle" | "hard" }
                      } : null)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select shadow" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">
                          <div className="flex items-center gap-2">
                            <SunDim className="h-4 w-4" />
                            <span>None</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="subtle">
                          <div className="flex items-center gap-2">
                            <CloudFog className="h-4 w-4" />
                            <span>Subtle</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="hard">
                          <div className="flex items-center gap-2">
                            <Cloud className="h-4 w-4" />
                            <span>Hard</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <div className='flex gap-2 mt-6 mb-2'>

                <Dialog>
                  <DialogTrigger>
                    <Button className='w-full hover:px-4 transition-all duration-400'>
                      <Sparkle />
                      Theme Presets
                    </Button>
                  </DialogTrigger>
                  <DialogContent className='min-w-[50vw]'>
                    <DialogHeader>
                      <DialogTitle>Theme Presets</DialogTitle>
                    </DialogHeader>
                    <ThemePresets onApplyPreset={(e) => {setCurrentProfile(prev => prev ? {
                      ...prev,
                      theme_config: {
                        ...prev.theme_config,
                        backgroundColor: e.backgroundColor,
                        textColor: e.textColor,
                        linkTextColor: e.linkTextColor,
                        fontFamily: e.fontFamily,
                        backgroundStyle: e.backgroundStyle as "solid" | "gradient",
                        buttonStyle: e.buttonStyle as "sharp" | "rounded" | "pill",
                        linkFill: e.linkFill as "fill" | "outline" | "glass",
                        linkShadow: e.linkShadow as "none" | "subtle" | "hard",
                        linkColor: e.linkColor
                      }
                    } : null)}} />
                  </DialogContent>
                </Dialog>

                <Dialog>
                  <DialogTrigger>
                    <Button
                      className='w-full hover:px-4 transition-all duration-400'
                      onClick={handleGenerateAIThemes}
                    >
                      <Sparkles />
                      AI Theme
                    </Button>
                  </DialogTrigger>
                  <DialogContent className='min-w-fit min-h-[70vh]'>
                    <DialogHeader>
                      <DialogTitle>AI Theme</DialogTitle>
                    </DialogHeader>
                    
                    {
                      !aiThemeError ? 
                          aiThemeLoading ? (
                            <div className='w-full flex flex-col items-center justify-center px-5'>
                              <div className='flex gap-4 sm:flex-col'>
                                {
                                  Array.from({length: 3}).map((_, i) => (
                                      <div className='flex flex-col gap-1 items-center justify-center'>
                                        <Skeleton className='h-[260px] w-[190px] rounded-lg' />
                                        <Skeleton className='h-[15px] w-[150px] rounded-sm mt-1 mb-6' />
                                      </div>
                                  ))
                                }
                              </div>
                              <Button disabled={true}>
                                <Sparkles />
                                Regenerate
                              </Button>
                            </div>
                          ) : (
                            <div className='w-full flex flex-col items-center justify-center px-5'>
                              <div className='flex'>
                                {
                                  aiThemes !== null && aiThemes.map((theme) => (
                                    <ThemePresetsCard preset={theme} isAITheme={true} onApply={() => {
                                      toast.success('Theme applied!')
                                      setCurrentProfile(prev => prev ? {...prev, theme_config: theme} : null)
                                    }} />
                                  ))
                                }
                              </div>
                              <Button
                                className='mt-6 mb-2 hover:px-4 transition-all duration-400'
                                onClick={handleGenerateAIThemes}
                              >
                                <Sparkles />
                                Regenerate
                              </Button>
                            </div>
                          )
                      : (
                        <div>
                          <p>There was an Error!</p>
                        </div>
                      )
                    }

                  </DialogContent>
                </Dialog>
              


              </div>
            </CardContent>
          </Card>
          
        </div>


        {/* Canvas - Main Editor */}
        <div className={`w-full h-full flex-2 p-4 lg:mx-4 flex items-center justify-center ${
          !isPreviewMode && 'hidden lg:flex'
        } ${isPreviewMode && 'fixed inset-0 z-50 bg-background'}`}>
          {isPreviewMode && (
            <Button
              onClick={() => setIsPreviewMode(false)}
              className="absolute top-4 right-4 lg:hidden"
              variant="outline"
            >
              Close Preview
            </Button>
          )}
          
          <Popover>
            <PopoverTrigger asChild>
              <Button
                className={!isPreviewMode ? "absolute top-2 right-2" : "absolute left-4 top-4"}
                variant="outline"
                size={'icon'}
              >
                <Share className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className={!isPreviewMode ? "w-100 mr-2 mt-1" : "w-85 ml-2 mt-1"}>
              <div className="flex flex-col gap-2">
                <p className="text-sm text-muted-foreground">
                  Share your profile with others using this link:
                </p>
                <div className='flex flex-row items-center justify-between p-2 px-0 pt-0 gap-2'>
                  <Input
                    readOnly
                    value={`${process.env.NEXT_PUBLIC_URL}/${currentProfile.username}`}
                    className="cursor-pointer"
                    onClick={(e) => {
                      (e.target as HTMLInputElement).select();
                      document.execCommand('copy');
                      toast.success('Link copied to clipboard!');
                    }}
                  />
                  <Button
                    variant={'outline'}
                    size="icon"
                    onClick={(e) => {
                      (e.target as HTMLInputElement).select();
                      document.execCommand('copy');
                      toast.success('Link copied to clipboard!');
                    }}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  You can also share your profile on social media.
                </p>
                <div className='flex flex-wrap gap-3 items-center mt-1'>
                  {SOCIAL_PLATFORMS.map((platform) => {
                    if(platform.name !== 'Custom Link')
                      return (<Button
                        key={platform.name}
                        variant={'outline'}
                        size={"icon"}
                        onClick={() => shareToPlatform(platform, linkstackUrl)}
                        className="items-center"
                      >
                        <platform.icon className="h-4 w-4" />
                      </Button>
                    )
                  })}
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <Card className="flex p-0 shadow-lg">
            <CardContent className="p-0 sm:p-4 flex-1 flex flex-col items-center justify-center">
              <div 
                className={`${currentProfile.theme_config.fontFamily} p-4 rounded-lg border-0 min-h-[500px] lg:max-h-[600px] overflow-y-auto`}
                style={{ 
                  background: currentProfile.theme_config.backgroundImage 
                    ? `url(${currentProfile.theme_config.backgroundImage})` 
                    : currentProfile.theme_config.backgroundColor,
                  backgroundSize: 'cover',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center',
                  borderColor: 'transparent',
                  fontFamily: currentProfile.theme_config.fontFamily,
                  color: currentProfile.theme_config.textColor
                }}
              >
                {/* Profile Header */}
                <div className="text-center mb-8">
                  <div className="relative group">
                    <Avatar className="h-20 w-20 mx-auto mb-4 cursor-pointer group-hover:opacity-75">
                      <AvatarImage src={currentProfile.avatar_url || ''} />
                      <AvatarFallback className="text-xl" style={{ color: currentProfile.theme_config.linkFill !== 'glass' ? currentProfile.theme_config.linkColor : '#ffffff', backgroundColor: currentProfile.theme_config.linkFill !== 'glass' ? currentProfile.theme_config.linkTextColor : '#010101' }}>
                        {currentProfile.display_name?.charAt(0) || currentProfile.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute bottom-6 right-1/2 transform translate-x-20 opacity-0 group-hover:opacity-100"
                      onClick={() => setIsEditingAvatar(true)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="relative inline-block group">
                    {isEditingName ? (
                      <div className="flex items-center gap-2 justify-center" style={{ color: 'white' }}>
                        <Input
                          type="text"
                          value={tempName}
                          onChange={(e) => setTempName(e.target.value)}
                          className="flex font-bold mb-1 text-center outline-none"
                          style={{ color: currentProfile.theme_config.textColor || '#111827', backgroundColor: currentProfile.theme_config.backgroundColor || '#ffffff' }}
                          autoFocus
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 absolute -right-10"
                          onClick={handleNameUpdate}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <>
                        <h2 className="text-2xl font-bold mb-1" style={{ color: currentProfile.theme_config.textColor }}>
                          {currentProfile.display_name || currentProfile.username}
                        </h2>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 absolute -right-10 top-0"
                          onClick={() => {
                            setTempName(currentProfile.display_name || currentProfile.username)
                            setIsEditingName(true)
                          }}
                        >
                          <Edit className="h-4 w-4" color={currentProfile.theme_config.textColor} />
                        </Button>
                      </>
                    )}
                  </div>
                  
                  <p className="text-muted-foreground mb-3">@{currentProfile.username}</p>

                  <div className="relative inline-block group">
                    {isEditingBio ? (
                      <div className="flex items-center gap-2 justify-center">
                        <Textarea
                          value={tempBio}
                          onChange={(e) => setTempBio(e.target.value)}
                          className="flex text-sm min-w-100 mx-auto w-full outline-none resize-none"
                          style={{ color: currentProfile.theme_config.textColor || '#111827', backgroundColor: currentProfile.theme_config.backgroundColor || '#ffffff' }}
                          placeholder="Tell everyone about yourself..."
                          rows={2}
                          autoFocus
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 absolute -right-10"
                          onClick={handleBioUpdate}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <>
                        {currentProfile.bio ? (
                          <p className="text-sm max-w-sm mx-auto" style={{ color: currentProfile.theme_config.textColor || '#111827' }}>
                            {currentProfile.bio}
                          </p>
                        ) : (
                          <p 
                            className="text-sm max-w-sm mx-auto text-red cursor-pointer hover:text-muted-foreground"
                            onClick={() => {
                              setTempBio('')
                              setIsEditingBio(true)
                            }}
                          >
                            Add a bio...
                          </p>
                        )}
                        {currentProfile.bio && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 absolute -right-10 -top-1"
                            onClick={() => {
                              setTempBio(currentProfile.bio || '')
                              setIsEditingBio(true)
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </div>
                
                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="links">
                    {(provided) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="space-y-2"
                      >
                        {
                          canvasLinks.length === 0 && (
                            <p className="text-muted-foreground text-center">
                              No links added yet.
                              <br/>
                              Add links from the left panel to start.
                            </p>
                          )
                        }
                        {canvasLinks.map((link, index) => (
                          <Draggable key={link.id} draggableId={link.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className={`group relative ${
                                  snapshot.isDragging ? 'rotate-2 scale-105' : ''
                                }`}
                              >
                                <div
                                  className={`flex items-center gap-4 transition-all ${
                                    currentProfile.theme_config.buttonStyle === 'rounded' ? 'rounded-lg' : 
                                    currentProfile.theme_config.buttonStyle === 'pill' ? 'rounded-full' : 
                                    'rounded-none'
                                  } ${
                                    snapshot.isDragging 
                                      ? 'border-primary shadow-lg bg-background' 
                                      : 'hover:opacity-90'
                                  }`}
                                  style={{ 
                                    backgroundColor: currentProfile.theme_config.linkFill === 'glass' 
                                      ? 'rgba(255, 255, 255, 0.12)'
                                      : currentProfile.theme_config.linkFill === 'outline'
                                      ? 'transparent'
                                      : currentProfile.theme_config.linkColor || adjust(currentProfile.theme_config.backgroundColor, 30),
                                    border: currentProfile.theme_config.linkFill === 'outline' ? `1.5px solid ${currentProfile.theme_config.linkColor}` : currentProfile.theme_config.linkFill === 'glass'
                                      ? '1px solid rgba(255, 255, 255, 0.1)'
                                      : 'none',
                                    boxShadow: currentProfile.theme_config.linkShadow === 'subtle'
                                      ? '0 2px 4px rgba(0,0,0,0.1)'
                                      : currentProfile.theme_config.linkShadow === 'hard'
                                      ? '3px 5px 0px rgba(0,0,0,1)'
                                      : 'none',
                                    backdropFilter: currentProfile.theme_config.linkFill === 'glass' ? 'blur(12px)' : 'none',
                                    color: currentProfile.theme_config.linkTextColor
                                  }}
                                >
                                  <div className="flex items-center w-full gap-3 p-4">
                                    {/* Drag handle */}
                                    <div
                                      {...provided.dragHandleProps}
                                      className="cursor-grab active:cursor-grabbing"
                                    >
                                      <GripVertical className="h-5 w-5" style={{ color: currentProfile.theme_config.linkTextColor }} />
                                    </div>

                                    {/* Link icon and title */}
                                    <div className="flex-1 font-medium flex items-center gap-2" style={{ color: currentProfile.theme_config.linkTextColor }}>
                                      {link.icon && socialIcons[link.icon as IconName] && (
                                        <FontAwesomeIcon 
                                          icon={socialIcons[link.icon as IconName]} 
                                          className="h-4 w-4" 
                                        /> // Make sure link.icon is a valid IconName
                                      )}
                                      {link.title}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-1">
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        className="h-8 w-8 p-0 hover:bg-white/20"
                                        onClick={() => window.open(link.url, '_blank')}
                                        style={{ color: currentProfile.theme_config.linkTextColor }}
                                      >
                                        <ExternalLink className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        className="h-8 w-8 p-0 hover:bg-white/20"
                                        onClick={() => {setSelectedIcon(link.icon ?? null); handleEditLink(link)}}
                                        style={{ color: currentProfile.theme_config.linkTextColor }}
                                      >
                                        <Edit className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        className="h-8 w-8 p-0 hover:bg-white/20"
                                        style={{ color: currentProfile.theme_config.linkTextColor }}
                                        onClick={async () => {
                                          try {
                                            await supabase
                                              .from('links')
                                              .update({ is_active: false })
                                              .eq('id', link.id)
                                          
                                            setCanvasLinks(canvasLinks.filter(l => l.id !== link.id))
                                            setAvailableLinks([...availableLinks, { ...link, is_active: false }])
                                            toast.success('Link moved to available links')
                                          } catch (error) {
                                            console.error('Error deactivating link:', error)
                                            toast.error('Failed to move link')
                                          }
                                        }}
                                      >
                                        <MinusCircle className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        className="h-8 w-8 p-0 text-red-600 hover:bg-red-500/20"
                                        onClick={() => deleteLink(link.id)}
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>

                  </div>
              </CardContent>
            </Card>
          </div>

      </div>

      {/* Avatar Update Dialog */}
      <Dialog open={isEditingAvatar} onOpenChange={setIsEditingAvatar}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Avatar</DialogTitle>
            <DialogDescription>
              Choose a new avatar image. JPG or PNG only. Max 2MB
            </DialogDescription>
          </DialogHeader>
          <Input
            type="file"
            accept="image/jpeg,image/png"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) {
                if (file.size > 2 * 1024 * 1024) {
                  toast.error('Image size must be less than 2MB. Please choose a smaller file.');
                  e.target.value = ''; // Clear the input
                  setAvatarImage(null);
                  return;
                }
                const fileExt = file.name.split('.').pop()?.toLowerCase();
                if (!fileExt || !['jpg', 'jpeg', 'png'].includes(fileExt)) {
                  toast.error('Invalid file type. Please upload a JPG or PNG.');
                  e.target.value = ''; // Clear the input
                  setAvatarImage(null);
                  return;
                }
                setAvatarImage(file);
              }
            }}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsEditingAvatar(false);
              setAvatarImage(null); // Reset selected image on cancel
            }}>
              Cancel
            </Button>
            {currentProfile.avatar_url && (
              <Button variant="destructive" onClick={handleRemoveAvatar}>
                Remove Avatar
              </Button>
            )}
            <Button
              disabled={!avatarImage}
              onClick={() => avatarImage && handleAvatarUpdate(avatarImage)}
            >
              Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Icon Picker Dialog */}
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
                const updatedData = { ...editingLinkData };
                updatedData.icon = undefined;
                setEditingLinkData(updatedData);
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
                  const updatedData = { ...editingLinkData };
                  updatedData.icon = name;
                  setEditingLinkData(updatedData);
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
    </div>
  )
}