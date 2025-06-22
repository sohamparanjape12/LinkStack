'use client'

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DialogClose } from '@radix-ui/react-dialog'
import { SOCIAL_PLATFORMS } from '@/config/social-platforms'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { socialIcons, IconName } from '@/config/icons'
import { useState } from 'react'

interface LinkDialogProps {
  onSave: (data: { title: string; url: string; icon?: string }) => void;
  editingData?: { title: string; url: string; icon?: string };
  mode?: 'add' | 'edit';
}

export function LinkDialog({ onSave, editingData, mode = 'add' }: LinkDialogProps) {
  const [editingLinkData, setEditingLinkData] = useState({ 
    title: editingData?.title || '', 
    url: editingData?.url || '', 
    icon: editingData?.icon 
  });
  const [selectedPlatform, setSelectedPlatform] = useState(SOCIAL_PLATFORMS[SOCIAL_PLATFORMS.length - 1]);
  const [selectedIcon, setSelectedIcon] = useState<string | null>(editingData?.icon || null);
  const [isIconPickerOpen, setIsIconPickerOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  // ...existing dialog JSX from dashboard page...
}
