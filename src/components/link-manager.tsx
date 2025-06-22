'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Trash2, GripVertical, Plus } from 'lucide-react'
import { supabase } from '@/lib/supabase-client'
import { Link } from '@/types/database'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { IconName, socialIcons } from '@/config/icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

interface LinkManagerProps {
  initialLinks: Link[]
}

export default function LinkManager({ initialLinks }: LinkManagerProps) {
  const [links, setLinks] = useState(initialLinks)
  const [newLink, setNewLink] = useState({ title: '', url: '' })
  const [loading, setLoading] = useState(false)

  const addLink = async () => {
    if (!newLink.title || !newLink.url) return
    
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    
    const { data, error } = await supabase
      .from('links')
      .insert({
        user_id: user!.id,
        title: newLink.title,
        url: newLink.url,
        is_active: false,
        position: links.length,
        icon: selectedIcon
      })
      .select()
      .single()

    if (!error && data) {
      setLinks([...links, data])
      setNewLink({ title: '', url: '' })
    }
    setLoading(false)
  }

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

  const [isIconPickerOpen, setIsIconPickerOpen] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);


  return (
    <div>
      {/* Links List */}
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
    </div>
  )
}