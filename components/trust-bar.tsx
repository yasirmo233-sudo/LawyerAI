export function TrustBar() {
  const partners = ["TechCrunch", "Forbes", "Legal Tech News", "ABA Journal", "Law.com", "Above the Law"]

  return (
    <section className="border-b bg-muted/30 py-12">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm font-medium text-muted-foreground mb-8">
          Trusted by legal professionals worldwide
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 opacity-60">
          {partners.map((partner) => (
            <div
              key={partner}
              className="text-lg font-semibold text-muted-foreground hover:text-foreground transition-colors"
            >
              {partner}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
