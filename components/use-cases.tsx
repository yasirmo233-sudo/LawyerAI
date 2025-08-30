import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Users, Briefcase, Rocket, FileCheck } from "lucide-react"

const useCases = [
  {
    icon: Rocket,
    title: "Founders",
    description: "Get legal guidance for startups without expensive law firm retainers.",
  },
  {
    icon: Building2,
    title: "In-House",
    description: "Streamline legal research and contract review for corporate legal teams.",
  },
  {
    icon: Users,
    title: "Legal Ops",
    description: "Optimize legal workflows and improve team efficiency with AI assistance.",
  },
  {
    icon: Briefcase,
    title: "Startups",
    description: "Navigate legal requirements and compliance for growing businesses.",
  },
  {
    icon: FileCheck,
    title: "Compliance",
    description: "Stay current with regulatory changes and ensure ongoing compliance.",
  },
]

export function UseCases() {
  return (
    <section id="use-cases" className="bg-muted/30 py-20 sm:py-32">
      <div className="container max-w-screen-xl">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-balance">
            Built for every legal professional
          </h2>
          <p className="mt-4 text-lg text-muted-foreground text-pretty">
            Whether you're a solo practitioner or part of a large legal team, Psalm adapts to your jurisdiction and
            needs.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {useCases.map((useCase) => (
            <Card key={useCase.title} className="bg-background border-border/50">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/20">
                    <useCase.icon className="h-4 w-4 text-accent-foreground" />
                  </div>
                  <CardTitle className="text-base">{useCase.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="leading-relaxed">{useCase.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
