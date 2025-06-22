import React from 'react';
import ThemePresetsCard from './ThemePresetsCard';
import { Card, CardContent } from './ui/card';

const themePresets = [
  {
    "name": "Ocean Depth",
    "backgroundColor": "linear-gradient(145deg, #001F3F 0%, #003366 100%)",
    "textColor": "#FFFFFF",
    "linkTextColor": "#FFFFFF",
    "fontFamily": "'Inter', sans-serif",
    "backgroundStyle": "gradient",
    "buttonStyle": "rounded",
    "linkFill": "glass",
    "linkShadow": "subtle",
    "linkColor": "rgba(255,255,255,0.15)"
  },
  {
    "name": "Sand & Ivory",
    "backgroundColor": "#FAF8F5",
    "textColor": "#1A0A00",
    "linkTextColor": "#1A0A00",
    "fontFamily": "'Playfair Display', serif",
    "backgroundStyle": "solid",
    "buttonStyle": "pill",
    "linkFill": "outline",
    "linkShadow": "none",
    "linkColor": "#A67C52"
  },
  {
    "name": "Velvet Night",
    "backgroundColor": "linear-gradient(160deg, #0D0D0D 0%, #1C1C1C 100%)",
    "textColor": "#FFFFFF",
    "linkTextColor": "#FFFFFF",
    "fontFamily": "'Satoshi', sans-serif",
    "backgroundStyle": "gradient",
    "buttonStyle": "sharp",
    "linkFill": "fill",
    "linkShadow": "hard",
    "linkColor": "#FF0050"
  },
  {
    "name": "Charcoal Slate",
    "backgroundColor": "#202020",
    "textColor": "#FFFFFF",
    "linkTextColor": "#FFFFFF",
    "fontFamily": "'Montserrat', sans-serif",
    "backgroundStyle": "solid",
    "buttonStyle": "sharp",
    "linkFill": "glass",
    "linkShadow": "subtle",
    "linkColor": "rgba(255,255,255,0.12)"
  },
  {
    "name": "Lavender Mist",
    "backgroundColor": "linear-gradient(135deg, #BFA2DB 0%, #836FFF 100%)",
    "textColor": "#FFFFFF",
    "linkTextColor": "#FFFFFF",
    "fontFamily": "'Clash Display', sans-serif",
    "backgroundStyle": "gradient",
    "buttonStyle": "rounded",
    "linkFill": "fill",
    "linkShadow": "hard",
    "linkColor": "#5A31F4"
  },
  {
    "name": "Electric Plum",
    "backgroundColor": "linear-gradient(160deg, #2E003E 0%, #3D155F 100%)",
    "textColor": "#FFFFFF",
    "linkTextColor": "#FFFFFF",
    "fontFamily": "'Cabinet Grotesk', sans-serif",
    "backgroundStyle": "gradient",
    "buttonStyle": "sharp",
    "linkFill": "fill",
    "linkShadow": "hard",
    "linkColor": "#FF69B4"
  },
  {
    "name": "Forest Canopy",
    "backgroundColor": "linear-gradient(145deg, #0B3D20 0%, #14532D 100%)",
    "textColor": "#FFFFFF",
    "linkTextColor": "#FFFFFF",
    "fontFamily": "'Open Sans', sans-serif",
    "backgroundStyle": "gradient",
    "buttonStyle": "rounded",
    "linkFill": "glass",
    "linkShadow": "subtle",
    "linkColor": "rgba(255,255,255,0.13)"
  },
  {
    "name": "Coral Reef",
    "backgroundColor": "linear-gradient(135deg, #FF6B6B 0%, #FFA07A 100%)",
    "textColor": "#FFFFFF",
    "linkTextColor": "#FFFFFF",
    "fontFamily": "'Poppins', sans-serif",
    "backgroundStyle": "gradient",
    "buttonStyle": "pill",
    "linkFill": "fill",
    "linkShadow": "hard",
    "linkColor": "#D63447"
  },
  {
    "name": "Royal Aurora",
    "backgroundColor": "linear-gradient(160deg, #1F1147 0%, #3B3B98 100%)",
    "textColor": "#FFFFFF",
    "linkTextColor": "#FFFFFF",
    "fontFamily": "'Clash Display', sans-serif",
    "backgroundStyle": "gradient",
    "buttonStyle": "sharp",
    "linkFill": "glass",
    "linkShadow": "subtle",
    "linkColor": "rgba(255,255,255,0.14)"
  },
  {
    "name": "Cyber Lime",
    "backgroundColor": "linear-gradient(145deg, #0B0F0C 0%, #1E2D24 100%)",
    "textColor": "#FFFFFF",
    "linkTextColor": "#000000",
    "fontFamily": "'Satoshi', sans-serif",
    "backgroundStyle": "gradient",
    "buttonStyle": "pill",
    "linkFill": "fill",
    "linkShadow": "hard",
    "linkColor": "#D4FF00"
  },
  {
    "name": "Sunset Horizon",
    "backgroundColor": "linear-gradient(160deg, #1E3C72 0%, #2A5298 28%, #F67280 100%)",
    "textColor": "#FFFFFF",
    "linkTextColor": "#FFFFFF",
    "fontFamily": "'General Sans', sans-serif",
    "backgroundStyle": "gradient",
    "buttonStyle": "rounded",
    "linkFill": "glass",
    "linkShadow": "subtle",
    "linkColor": "rgba(255,255,255,0.15)"
  },
  {
    "name": "Neon Mirage",
    "backgroundColor": "linear-gradient(145deg, #0F2027 0%, #203A43 40%, #2C5364 50%, #00C9A7 100%)",
    "textColor": "#FFFFFF",
    "linkTextColor": "#000000",
    "fontFamily": "'Cabinet Grotesk', sans-serif",
    "backgroundStyle": "gradient",
    "buttonStyle": "sharp",
    "linkFill": "fill",
    "linkShadow": "hard",
    "linkColor": "#00FFB3"
  },
  {
    "name": "Crimson Bloom",
    "backgroundColor": "linear-gradient(135deg, #2D0036 0%, #9D4EDD 40%, #FF4F81 70%, #FF758F 100%)",
    "textColor": "#FFFFFF",
    "linkTextColor": "#FFFFFF",
    "fontFamily": "'Poppins', sans-serif",
    "backgroundStyle": "gradient",
    "buttonStyle": "pill",
    "linkFill": "fill",
    "linkShadow": "subtle",
    "linkColor": "#E61C5D"
  },
  {
    "name": "Citrus Circuit",
    "backgroundColor": "linear-gradient(145deg, #092B1E 0%, #3B7D5B 40%, #F6D32D 75%, #FF6F3C 100%)",
    "textColor": "#FFFFFF",
    "linkTextColor": "#1A0A00",
    "fontFamily": "'Inter', sans-serif",
    "backgroundStyle": "gradient",
    "buttonStyle": "pill",
    "linkFill": "fill",
    "linkShadow": "hard",
    "linkColor": "#FFF68F"
  },
  {
    "name": "Carbon Drift",
    "backgroundColor": "linear-gradient(135deg, #0D0D0D 0%, #1A1A1A 35%, #2B2B2B 70%, #3D3D3D 100%)",
    "textColor": "#FFFFFF",
    "linkTextColor": "#FFFFFF",
    "fontFamily": "'General Sans', sans-serif",
    "backgroundStyle": "gradient",
    "buttonStyle": "sharp",
    "linkFill": "glass",
    "linkShadow": "subtle",
    "linkColor": "rgba(255,255,255,0.14)"
  }
]



interface ThemePresetsProps {
  onApplyPreset: (preset: typeof themePresets[0]) => void;
}

const ThemePresets: React.FC<ThemePresetsProps> = ({ onApplyPreset }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[50vh] overflow-y-auto px-5 pl-4 py-2 mt-0">
        {themePresets.map((preset) => (
            <ThemePresetsCard key={preset.name} preset={preset} isAITheme={false} onApply={onApplyPreset} />
        ))}
    </div>
  );
};

export default ThemePresets;
