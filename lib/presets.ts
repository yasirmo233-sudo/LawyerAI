import { FileText, Scale, Shield, Building2, Users, Gavel } from "lucide-react"

export interface LegalPreset {
  id: string
  label: string
  description: string
  icon: any
  system: string
  prefill: string
  category: "contracts" | "research" | "compliance" | "corporate" | "litigation"
}

export const LEGAL_PRESETS: LegalPreset[] = [
  {
    id: "contract-review",
    label: "Contract Review",
    description: "Analyze contracts for risks and key terms",
    icon: FileText,
    category: "contracts",
    system: `You are a jurisdiction-aware AI legal assistant. Give practical, {{jurisdiction}}-specific analysis. Always: (1) identify key risks with clause references, (2) summarise party obligations, (3) propose negotiation levers, (4) draft redline-ready clause suggestions, (5) list open questions. If documents exist, cite them by filename/section. Include a brief "not legal advice" reminder.`,
    prefill: `Contract Review — {{jurisdiction}}

Counterparty: {{counterparty}}
Documents: {{documents}}  (attach files or paste key clauses)
Context: [deal type, value, term, deliverables]
Priorities: {{priorities}}  (e.g., liability cap ≥ fees x2; mutual indemnity; IP stays with us)
Clauses of concern: {{clauses_of_concern}}  (e.g., indemnity, termination for convenience)

Output:
- Risk summary table (Issue • Why it matters • Clause ref • Risk: Low/Med/High)
- Obligations by party (bullets)
- Negotiation levers (ranked)
- Suggested redline text (concise, copyable)
- Open questions to resolve`,
  },
  {
    id: "legal-research",
    label: "Legal Research",
    description: "Research case law and precedents",
    icon: Scale,
    category: "research",
    system: `You are a precise legal researcher for {{jurisdiction}}. Deliver: (A) Short Answer, (B) structured Analysis with tests/elements, (C) authorities with proper citations, (D) practical next steps. Do not invent citations; note gaps and recency limits. Include "not legal advice."`,
    prefill: `Legal Research — {{jurisdiction}}

Question: {{question}}
Key facts: {{facts}}
Time horizon: {{time_horizon}}  (e.g., current law; mention notable proposed changes if any)

Please provide:
- Short Answer (1 paragraph)
- Analysis (elements/tests; apply to facts)
- Authorities (statutes, regs, leading cases) with citations
- Practical next steps & risks
- Open issues / missing facts`,
  },
  {
    id: "compliance-check",
    label: "Compliance Check",
    description: "Verify regulatory compliance",
    icon: Shield,
    category: "compliance",
    system: `You map regulatory obligations for {{jurisdiction}}. Produce gap analysis, required controls, records, notices/consents, DPIA/TRA triggers, cross-border transfer rules, retention, incident duties. Reference relevant frameworks (e.g., UK/EU GDPR, CPRA, HIPAA, sectoral rules). Include "not legal advice."`,
    prefill: `Compliance Check — {{jurisdiction}}

Activity: {{activity}}  (what the org is doing)
Data categories: {{data_categories}}  (e.g., customer PII, payment data)
Roles: {{roles}}  (controller/processor; vendors)
Locations: {{locations}}  (collection, storage, access, transfers)
Frameworks: {{frameworks}}  (e.g., UK GDPR, EU GDPR, CPRA)

Output:
- Summary risk rating (Low/Med/High) + why
- Obligations checklist (bullets with citations)
- Gap analysis (Current vs Required)
- Required artefacts (RoPA, DPA, SCCs, policy set)
- DPIA/TRA need? (yes/no + reason)
- Cross-border transfer mechanism (if relevant)
- Recommended controls & next steps`,
  },
  {
    id: "corporate-governance",
    label: "Corporate Governance",
    description: "Board resolutions and corporate matters",
    icon: Building2,
    category: "corporate",
    system: `You are a corporate law specialist with expertise in {{jurisdiction}} corporate governance. You assist with:

1. Board resolutions and corporate documentation
2. Shareholder rights and obligations
3. Director duties and liabilities
4. Corporate structure and compliance
5. Merger, acquisition, and restructuring matters

Ensure all advice aligns with {{jurisdiction}} corporate law requirements and best practices for corporate governance.`,
    prefill:
      "I need assistance with [describe corporate matter]. Please provide guidance on the proper procedures and documentation required.",
  },
  {
    id: "employment-law",
    label: "Employment Law",
    description: "Workplace policies and employment issues",
    icon: Users,
    category: "corporate",
    system: `You are an employment law specialist with comprehensive knowledge of {{jurisdiction}} workplace regulations. You provide guidance on:

1. Employment contracts and workplace policies
2. Discrimination, harassment, and workplace rights
3. Termination procedures and severance
4. Wage and hour compliance
5. Health and safety requirements

Always consider {{jurisdiction}} employment standards, labor codes, and recent regulatory changes in your analysis.`,
    prefill:
      "I have an employment law question regarding [describe situation]. Please advise on the legal requirements and best practices.",
  },
  {
    id: "litigation-support",
    label: "Litigation Support",
    description: "Case strategy and legal arguments",
    icon: Gavel,
    category: "litigation",
    system: `You are a litigation support specialist with expertise in {{jurisdiction}} court procedures and case law. You assist with:

1. Case analysis and legal strategy development
2. Identifying relevant precedents and authorities
3. Drafting legal arguments and motions
4. Discovery planning and evidence analysis
5. Settlement negotiations and risk assessment

Focus on {{jurisdiction}} procedural rules, local court practices, and applicable substantive law for the strongest possible legal position.`,
    prefill:
      "I need help developing legal strategy for [describe case/dispute]. Please analyze the key issues and suggest potential arguments.",
  },
]

export function getPresetById(id: string): LegalPreset | undefined {
  return LEGAL_PRESETS.find((preset) => preset.id === id)
}

export function getPresetsByCategory(category: LegalPreset["category"]): LegalPreset[] {
  return LEGAL_PRESETS.filter((preset) => preset.category === category)
}

export function applyJurisdictionToPreset(preset: LegalPreset, jurisdiction: string): LegalPreset {
  const substitutions = {
    jurisdiction,
    counterparty: "[Enter counterparty name]",
    documents: "[Attach files or paste key clauses]",
    priorities: "[e.g., liability cap ≥ fees x2; mutual indemnity; IP stays with us]",
    clauses_of_concern: "[e.g., indemnity, termination for convenience]",
    question: "[Enter your legal question]",
    facts: "[Describe relevant facts]",
    time_horizon: "[e.g., current law; mention notable proposed changes if any]",
    activity: "[what the org is doing]",
    data_categories: "[e.g., customer PII, payment data]",
    roles: "[controller/processor; vendors]",
    locations: "[collection, storage, access, transfers]",
    frameworks: "[e.g., UK GDPR, EU GDPR, CPRA]",
  }

  let system = preset.system
  let prefill = preset.prefill

  // Apply all substitutions
  Object.entries(substitutions).forEach(([key, value]) => {
    const regex = new RegExp(`\\{\\{${key}\\}\\}`, "g")
    system = system.replace(regex, value)
    prefill = prefill.replace(regex, value)
  })

  return {
    ...preset,
    system,
    prefill,
  }
}
