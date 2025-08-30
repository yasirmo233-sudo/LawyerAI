"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"

const plans = [
  {
    name: "Free",
    price: { monthly: 0, annual: 0 },
    description: "Perfect for trying out Psalm",
    features: ["50 messages per month", "Basic legal research", "Community support", "Standard response time"],
    cta: "Start free",
    popular: false,
  },
  {
    name: "Pro",
    price: { monthly: 29, annual: 290 },
    description: "For active legal professionals",
    features: [
      "Unlimited messages",
      "Advanced research tools",
      "Document upload & analysis",
      "Priority support",
      "Export capabilities",
      "Citation formatting",
    ],
    cta: "Start Pro trial",
    popular: true,
  },
  {
    name: "Business",
    price: { monthly: 99, annual: 990 },
    description: "For teams and organizations",
    features: [
      "Everything in Pro",
      "Team collaboration (5 seats)",
      "SSO integration",
      "Audit logs",
      "Custom endpoints",
      "Dedicated support",
      "Advanced analytics",
    ],
    cta: "Contact sales",
    popular: false,
  },
]

export function Pricing() {
  const [isAnnual, setIsAnnual] = useState(false)

  return (
    <section id="pricing" className="py-16 sm:py-24">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-balance">Simple, transparent pricing</h2>
          <p className="mt-4 text-lg text-muted-foreground text-pretty">
            Choose the plan that fits your legal practice. Upgrade or downgrade at any time.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">Early access. Limits and features may change.</p>

          <div className="mt-8 flex items-center justify-center gap-4">
            <span className={`text-sm ${!isAnnual ? "text-foreground" : "text-muted-foreground"}`}>Monthly</span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isAnnual ? "bg-primary" : "bg-muted"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isAnnual ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
            <span className={`text-sm ${isAnnual ? "text-foreground" : "text-muted-foreground"}`}>Annual</span>
            {isAnnual && (
              <Badge variant="secondary" className="ml-2">
                Save 17%
              </Badge>
            )}
          </div>
        </div>

  <div className="grid gap-8 lg:grid-cols-3 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative ${plan.popular ? "border-primary shadow-lg scale-105" : "border-border/50"}`}
            >
              {plan.popular && <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">Most Popular</Badge>}

              <CardHeader className="text-center">
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">${isAnnual ? plan.price.annual : plan.price.monthly}</span>
                  <span className="text-muted-foreground">
                    {plan.price.monthly > 0 ? (isAnnual ? "/year" : "/month") : ""}
                  </span>
                </div>
                <CardDescription className="mt-2">{plan.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <Check className="h-4 w-4 text-primary flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button asChild className="w-full" variant={plan.popular ? "default" : "outline"}>
                  <Link href="/app">{plan.cta}</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
