"use client"

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check, Sparkles } from "lucide-react";
import { Navbar } from "@/components/navbar";

const plans = [
  {
    name: "Free",
    price: "0",
    description: "Perfect for getting started",
    features: [
      "Up to 5 links",
      "Basic analytics",
      "Basic customization",
      "Mobile-friendly design",
      "Link click tracking",
    ],
    limitations: ["No custom domain", "Limited themes", "Basic support"],
  },
  {
    name: "Pro",
    price: "5",
    description: "Best for creators and professionals",
    features: [
      "Unlimited links",
      "Advanced analytics",
      "Custom themes",
      "Priority support",
      "Custom domain",
      "Custom backgrounds",
      "Remove branding",
      "Social icons",
      "Priority support",
      "Link scheduling",
    ],
    popular: true,
  },
  {
    name: "Team",
    price: "12",
    description: "Perfect for small teams",
    features: [
      "Everything in Pro",
      "5 team members",
      "Team analytics",
      "Team workspace",
      "Admin controls",
      "Advanced security",
      "API access",
      "Custom integrations",
      "24/7 support",
      "99.9% uptime SLA",
    ],
  },
];

export default function Pricing() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Simple, Transparent Pricing
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Choose the perfect plan for your needs. All plans include a 14-day free
          trial.
        </p>
      </div>

      {/* Pricing Grid */}
      <div className="container mx-auto px-4 pb-16">
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`flex flex-col ${
                plan.popular ? "border-primary shadow-lg scale-105" : ""
              }`}
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {plan.name}
                  {plan.popular && (
                    <span className="px-2.5 py-0.5 text-xs font-semibold text-primary-foreground bg-primary rounded-full">
                      Popular
                    </span>
                  )}
                </CardTitle>
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold">${plan.price}</span>
                  <span className="text-muted-foreground ml-1">/month</span>
                </div>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-2">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center">
                      <Check className="h-4 w-4 text-primary mr-2" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                  {plan.limitations &&
                    plan.limitations.map((limitation) => (
                      <li
                        key={limitation}
                        className="flex items-center text-muted-foreground"
                      >
                        <Check className="h-4 w-4 mr-2 opacity-50" />
                        <span className="text-sm">{limitation}</span>
                      </li>
                    ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  variant={plan.popular ? "default" : "outline"}
                >
                  {plan.popular ? (
                    <>
                      Get Started{" "}
                      <Sparkles className="h-4 w-4 ml-2" />
                    </>
                  ) : (
                    "Get Started"
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-muted/50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Can I change plans later?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Yes, you can upgrade or downgrade your plan at any time. Your
                  billing will be adjusted accordingly.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  What payment methods do you accept?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We accept all major credit cards, PayPal, and support various
                  payment methods through Stripe.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Is there a free trial?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Yes, all paid plans come with a 14-day free trial. No credit
                  card required for the free plan.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Do you offer refunds?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Yes, we offer a 30-day money-back guarantee if you're not
                  satisfied with our service.
                </p>
              </CardContent>
            </Card>
          </div>
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
