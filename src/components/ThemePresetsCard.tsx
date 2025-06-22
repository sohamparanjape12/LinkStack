import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DialogTrigger } from './ui/dialog';

interface ThemePreset {
  name: string
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

interface ThemePresetsCardProps {
  preset: ThemePreset;
  onApply: (preset: ThemePreset) => void;
  isAITheme: boolean;
}

const ThemePresetsCard: React.FC<ThemePresetsCardProps> = ({ preset, onApply, isAITheme }) => {
  
      if(!isAITheme)
        return (
          <DialogTrigger className='group'>
            <Card className="group-hover:my-[3px] transition-all duration-500 transition-ease cursor-pointer p-0 m-2 text-center" onClick={() => onApply(preset)}>
                <CardContent
                    className="h-full rounded-lg p-0 text-center"
                    style={{
                    background: preset.backgroundImage
                        ? `url(${preset.backgroundImage})`
                        : preset.backgroundColor,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    color: preset.textColor,
                    fontFamily: preset.fontFamily,
                    }}
                >
                    <div className="flex flex-col items-center justify-center h-full px-4 gap-2 mb-0 py-15">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <Button
                        key={index}
                        style={{
                        background: preset.linkFill === 'glass' 
                                ? 'rgba(255, 255, 255, 0.12)' 
                                : preset.linkFill === 'outline' 
                                ? 'transparent'
                                : preset.linkColor,
                            color: preset.linkTextColor,
                            border: preset.linkFill === 'outline' ? `1.5px solid ${preset.linkColor}` : preset.linkFill === 'glass' ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
                            boxShadow: preset.linkShadow === 'subtle' 
                                ? '0 2px 4px rgba(0,0,0,0.1)' 
                                : preset.linkShadow === 'hard'
                                ? '3px 4px 0px rgba(0,0,0,1)'
                                : 'none',
                            backdropFilter: preset.linkFill === 'glass' ? 'blur(12px)' : 'none',
                        }}
                        className={`w-full cursor-pointer ${
                                        preset.buttonStyle === 'rounded' ? 'rounded-lg' : 
                                        preset.buttonStyle === 'pill' ? 'rounded-full' : 
                                        'rounded-none'
                                      } `}
                        size="sm"
                    >
                    </Button>
                    ))}
                    </div>
                </CardContent>
            </Card>
            <p className='mt-0 group-hover:tracking-widest transition-all delay-100 duration-300' style={{ fontFamily: preset.fontFamily }}>{preset.name}</p>
        </DialogTrigger>
      )
      else
        return (
      <div className='flex flex-col w-full items-center'>
        <Card className="group-hover:my-[3px] transition-all w-50 duration-500 transition-ease cursor-pointer p-0 m-2 text-center" onClick={() => onApply(preset)}>
            <CardContent
                className="h-full rounded-lg p-0 text-center"
                style={{
                background: preset.backgroundImage
                    ? `url(${preset.backgroundImage})`
                    : preset.backgroundColor,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                color: preset.textColor,
                fontFamily: preset.fontFamily,
                }}
            >
                <div className="flex flex-col items-center justify-center h-full px-4 gap-2 mb-0 py-15">
                {Array.from({ length: 4 }).map((_, index) => (
                    <Button
                    key={index}
                    style={{
                    background: preset.linkFill === 'glass' 
                            ? 'rgba(255, 255, 255, 0.12)' 
                            : preset.linkFill === 'outline' 
                            ? 'transparent'
                            : preset.linkColor,
                        color: preset.linkTextColor,
                        border: preset.linkFill === 'outline' ? `1.5px solid ${preset.linkColor}` : preset.linkFill === 'glass' ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
                        boxShadow: preset.linkShadow === 'subtle' 
                            ? '0 2px 4px rgba(0,0,0,0.1)' 
                            : preset.linkShadow === 'hard'
                            ? '3px 4px 0px rgba(0,0,0,1)'
                            : 'none',
                        backdropFilter: preset.linkFill === 'glass' ? 'blur(12px)' : 'none',
                    }}
                    className={`w-full cursor-pointer ${
                                    preset.buttonStyle === 'rounded' ? 'rounded-lg' : 
                                    preset.buttonStyle === 'pill' ? 'rounded-full' : 
                                    'rounded-none'
                                  } `}
                    size="sm"
                >
                </Button>
                ))}
                </div>
            </CardContent>
        </Card>
        <p className='mt-0 group-hover:tracking-widest transition-all delay-100 duration-300' style={{ fontFamily: preset.fontFamily }}>{preset.name}</p>
        </div>
        )
};

export default ThemePresetsCard;
