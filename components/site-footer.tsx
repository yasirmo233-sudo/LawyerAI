import Link from "next/link"

export function SiteFooter() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container max-w-screen-xl py-8 md:py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-lg font-bold">Psalm</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground max-w-xs">
              AI legal assistant tuned to your jurisdiction.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold">Product</h3>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="#use-cases" className="hover:text-foreground transition-colors">
                  Use Cases
                </Link>
              </li>
              <li>
                <Link href="#pricing" className="hover:text-foreground transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/app" className="hover:text-foreground transition-colors">
                  Try Now
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold">Legal</h3>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/legal/terms" className="hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/legal/privacy" className="hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold">Support</h3>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="#faq" className="hover:text-foreground transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="mailto:support@psalm.com" className="hover:text-foreground transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>© 2024 Psalm. All rights reserved.</p>
          <p className="mt-2 text-xs">
            <strong>Disclaimer:</strong> Psalm is an AI assistant, not a law firm. It does not provide legal advice.
          </p>
        </div>
      </div>
    </footer>
  )
}
