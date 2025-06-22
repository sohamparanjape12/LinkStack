"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Brush,
  ExternalLink,
  Layers,
  Link2,
  Palette,
  Share2,
  Sparkles,
  BarChart3,
  Globe2,
  Smartphone,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";

export default function Features() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-16 pb-10 lg:py-25 text-center lg:pb-10">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Everything You Need in One Link
        </h1>
        <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto px-4 sm:px-0">
          LinkStack provides all the tools you need to create a powerful personal landing page.
        </p>
      </div>

      {/* Main Features Grid */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-35 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          <FeatureCard
            icon={<Palette className="h-8 w-8" />}
            title="Rich Customization"
            description="Choose from various themes, colors, and styles. Customize your background, buttons, and text to match your brand perfectly."
            features={[
              "Multiple color themes",
              "Custom backgrounds",
              "Font selections",
              "Button style options",
              "Layout customization",
            ]}
          />

          <FeatureCard
            icon={<Brush className="h-8 w-8" />}
            title="Beautiful Themes"
            description="Select from professionally designed themes or create your own unique style with our advanced theme editor."
            features={[
              "Dark/Light modes",
              "Glass effects",
              "Gradient backgrounds",
              "Custom CSS support",
              "Mobile-optimized designs",
            ]}
          />

          <FeatureCard
            icon={<Link2 className="h-8 w-8" />}
            title="Smart Link Management"
            description="Organize and manage all your important links in one place with our intuitive drag-and-drop interface."
            features={[
              "Unlimited links",
              "Link categories",
              "Custom icons",
              "Link scheduling",
              "Easy reordering",
            ]}
          />

          <FeatureCard
            icon={<BarChart3 className="h-8 w-8" />}
            title="Advanced Analytics"
            description="Track and analyze your link performance with detailed analytics and insights."
            features={[
              "Click tracking",
              "Visitor analytics",
              "Geographic data",
              "Real-time statistics",
              "Performance reports",
            ]}
          />

          <FeatureCard
            icon={<Globe2 className="h-8 w-8" />}
            title="Custom Domain"
            description="Use your own domain name for a more professional and branded appearance."
            features={[
              "Custom domains",
              "SSL certificates",
              "DNS management",
              "Domain privacy",
              "Quick setup",
            ]}
          />

          <FeatureCard
            icon={<ShieldCheck className="h-8 w-8" />}
            title="Security & Privacy"
            description="Your data is protected with enterprise-grade security and privacy features."
            features={[
              "SSL encryption",
              "2FA support",
              "Privacy controls",
              "Data backups",
              "GDPR compliance",
            ]}
          />
        </div>
      </div>

      {/* Additional Features Section */}
      <div className="bg-muted/50 py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-25">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">
            Additional Features
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            <div className="text-center p-4">
              <Smartphone className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-4 text-primary" />
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Mobile Optimized</h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                Perfect viewing experience on all devices and screen sizes.
              </p>
            </div>
            <div className="text-center p-4">
              <Zap className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-4 text-primary" />
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Lightning Fast</h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                Optimized performance for quick loading times.
              </p>
            </div>
            <div className="text-center p-4">
              <Share2 className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-4 text-primary" />
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Easy Sharing</h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                Share your profile anywhere with a single link.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary/5 py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground mb-6 sm:mb-8">
            Join thousands of creators and professionals using LinkStack.
          </p>
          <Button size="lg" className="w-full sm:w-auto gap-2">
            Create Your LinkStack <Sparkles className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t">
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

function FeatureCard({
  icon,
  title,
  description,
  features,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
}) {
  return (
    <Card className="group hover:border-primary/50 transition-colors h-full">
      <CardContent className="pt-6 p-4 sm:p-6">
        <div className="mb-4 text-primary">{icon}</div>
        <h3 className="text-lg sm:text-xl font-semibold mb-2">{title}</h3>
        <p className="text-sm sm:text-base text-muted-foreground mb-4">{description}</p>
        <ul className="space-y-2 text-sm sm:text-base">
          {features.map((feature, index) => (
            <li
              key={index}
              className="flex items-center text-sm text-muted-foreground"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-primary/60 mr-2" />
              {feature}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
