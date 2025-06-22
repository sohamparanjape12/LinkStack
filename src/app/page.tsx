"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ExternalLink,
  Layers,
  Link2,
  Palette,
  Share2,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Aurora } from "@/components/aurora";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export default function Home() {
  const router = useRouter();

  const darkThemeColors = ["#3A29FF", "#00A9AA", "#7A00FF"]
  const lightThemeColors = ["#3A29FF", "#FFA9FF", "#7A00FF"]

  const [auroraColors, setAuroraColors] = useState<string[]>([])

  const { theme, setTheme } = useTheme()

  const useWidth = () => {
  const [width, setWidth] = useState(0)
  const handleResize = () => setWidth(window.innerWidth)
  useEffect(() => {
      handleResize()
      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return width
}

  const width = useWidth()


  useEffect(() => {
    if (theme === 'dark') {
      setAuroraColors(darkThemeColors)
    } else {
      setAuroraColors(lightThemeColors)
    }
  }, [theme])

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {/* Hero Section */}
      <div className="relative">
        <div className={`absolute inset-0 ${width <= 480 ? '-top-50' : '-top-20'} z-0`}>
          <Aurora
            colorStops={auroraColors as [string, string, string]}
            blend={0.5} // Softer blend
            amplitude={0.4} // Less aggressive amplitude
            speed={0.5} // Slower speed
          />
        </div>
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32 z-10 lg:pb-0 lg:pt-40 pr-5">
          <div className="max-w-3xl mx-auto text-center space-y-6 sm:space-y-8">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Your Links, Your Style
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground px-4 sm:px-0">
              Create a beautiful, customizable link landing page in minutes. Share
              all your important links in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 sm:px-0">
              <Button size="lg" className="gap-2" onClick={() => router.push('/signup')}>
                Get Started{" "}
                <Sparkles className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="gap-2">
                Learn More{" "}
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-35 py-16 sm:py-24 pt-0 pr-5">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-16">
          Everything you need
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 pr-5">
          <FeatureCard
            icon={<Palette className="h-8 w-8" />}
            title="Customizable Design"
            description="Personalize your page with custom themes, colors, and styles that match your brand."
          />
          <FeatureCard
            icon={<Link2 className="h-8 w-8" />}
            title="Unlimited Links"
            description="Add as many links as you want. Organize and categorize them your way."
          />
          <FeatureCard
            icon={<Share2 className="h-8 w-8" />}
            title="Easy Sharing"
            description="Share your profile with a single link. Perfect for social media bios."
          />
          <FeatureCard
            icon={<Layers className="h-8 w-8" />}
            title="Analytics"
            description="Track clicks and understand your audience with detailed analytics."
          />
          <FeatureCard
            icon={<Sparkles className="h-8 w-8" />}
            title="Social Icons"
            description="Choose from a wide variety of social media icons to enhance your links."
          />
          <FeatureCard
            icon={<ExternalLink className="h-8 w-8" />}
            title="Custom Domain"
            description="Use your own domain name for a more professional appearance."
          />
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary/5 py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            Ready to get started?
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground mb-8">
            Create your LinkStack profile in minutes. No credit card required.
          </p>
          <Button size="lg" className="gap-2">
            Create Your LinkStack{" "}
            <Sparkles className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t mt-auto">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
            <p className="text-sm text-muted-foreground order-2 sm:order-1">
              © 2024 LinkStack. All rights reserved.
            </p>
            <div className="flex gap-4 order-1 sm:order-2">
              <a
                href="#"
                className="text-sm text-muted-foreground hover:text-primary"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-sm text-muted-foreground hover:text-primary"
              >
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Update the FeatureCard component to be more responsive
function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card className="group hover:border-primary/50 transition-colors h-full">
      <CardContent className="pt-6 p-4 sm:p-6">
        <div className="mb-4 text-primary">{icon}</div>
        <h3 className="text-lg sm:text-xl font-semibold mb-2">{title}</h3>
        <p className="text-sm sm:text-base text-muted-foreground">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}
