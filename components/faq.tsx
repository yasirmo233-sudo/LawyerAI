"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqs = [
  {
    question: "How does LawyerAI handle my confidential data?",
    answer:
      "We take data security seriously. All communications are encrypted in transit and at rest. We don't store your conversations permanently, and we never use your data to train our models. Your confidential information remains private and secure.",
  },
  {
    question: "Is LawyerAI's advice legally binding?",
    answer:
      "No, LawyerAI provides information and assistance but does not constitute legal advice. Our AI assistant is designed to help with research and drafting, but you should always consult with qualified legal professionals for specific legal matters and final decisions.",
  },
  {
    question: "What AI models does LawyerAI support?",
    answer:
      "LawyerAI works with leading AI models including GPT-4, Claude, and other specialized legal AI models. You can configure your preferred model and endpoint through our settings panel to match your organization's requirements.",
  },
  {
    question: "Can I upload and analyze my own documents?",
    answer:
      "Yes, Pro and Business plans support document upload and analysis. You can upload PDFs, Word documents, and text files for AI-powered review, summarization, and risk analysis. All uploaded documents are processed securely and deleted after analysis.",
  },
  {
    question: "How accurate are the legal citations?",
    answer:
      "Our AI is trained on extensive legal databases and provides properly formatted citations. However, we recommend verifying all citations and legal references independently, as AI can occasionally make errors. Always double-check important legal sources.",
  },
  {
    question: "Can I integrate LawyerAI with my existing legal tools?",
    answer:
      "Yes, our Business plan includes API access and integrations with popular legal practice management systems. We also support custom endpoints so you can connect LawyerAI to your organization's preferred AI infrastructure.",
  },
]

export function FAQ() {
  return (
    <section id="faq" className="bg-muted/30 py-20 sm:py-32">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-balance">Frequently asked questions</h2>
          <p className="mt-4 text-lg text-muted-foreground text-pretty">
            Everything you need to know about LawyerAI and how it works.
          </p>
        </div>

        <div className="mx-auto max-w-3xl">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-background border border-border/50 rounded-lg px-6"
              >
                <AccordionTrigger className="text-left hover:no-underline">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
