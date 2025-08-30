import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, FileText, Shield, BookOpen, Upload, Zap } from "lucide-react"

const features = [
  {
    icon: Search,
    title: "Legal Research Copilot",
    description: "Get comprehensive case law research with instant citations and relevant precedents.",
  },
  {
    icon: FileText,
    title: "Contract Drafting Aid",
    description: "Generate and review contracts with AI-powered clause suggestions and risk analysis.",
  },
  {
    icon: Shield,
    title: "Compliance Q&A",
    description: "Navigate complex regulations with real-time compliance guidance and updates.",
  },
  {
    icon: BookOpen,
    title: "Citation-Ready Answers",
    description: "Receive properly formatted legal citations and references for all research queries.",
  },
  {
    icon: Upload,
    title: "Document Analysis",
    description: "Upload and analyze legal documents for key insights, risks, and recommendations.",
  },
  {
    icon: Zap,
    title: "Smart Integrations",
    description: "Connect with your existing legal tools and workflows for seamless productivity.",
  },
]

export function FeatureGrid() {
  return (
    <section className="py-20 sm:py-32">
      <div className="container max-w-screen-xl">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-balance">
            Everything you need for legal work
          </h2>
          <p className="mt-4 text-lg text-muted-foreground text-pretty">
            Comprehensive AI tools designed specifically for legal professionals and teams.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title} className="border-border/50 hover:border-border transition-colors">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
