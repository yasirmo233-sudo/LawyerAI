import { LegalPage } from "@/components/legal-page"

export const metadata = {
  title: "Terms of Service - LawyerAI",
  description: "Terms of Service for LawyerAI - AI Legal Assistant",
}

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service" lastUpdated="January 1, 2024">
      <h2 id="acceptance">1. Acceptance of Terms</h2>
      <p>
        By accessing and using LawyerAI ("the Service"), you accept and agree to be bound by the terms and provision of
        this agreement. If you do not agree to abide by the above, please do not use this service.
      </p>

      <h2 id="description">2. Service Description</h2>
      <p>
        LawyerAI is an artificial intelligence-powered legal assistant that provides information, research assistance,
        and document analysis tools. The Service is designed to assist legal professionals and individuals with legal
        research and document preparation.
      </p>

      <h3 id="not-legal-advice">2.1 Not Legal Advice</h3>
      <p>
        <strong>Important:</strong> LawyerAI does not provide legal advice. The information and assistance provided by
        our AI system is for informational purposes only and should not be construed as legal advice. You should always
        consult with qualified legal professionals for specific legal matters and decisions.
      </p>

      <h2 id="user-accounts">3. User Accounts</h2>
      <p>
        When you create an account with us, you must provide information that is accurate, complete, and current at all
        times. You are responsible for safeguarding the password and for all activities that occur under your account.
      </p>

      <h3 id="account-security">3.1 Account Security</h3>
      <p>
        You agree to notify us immediately of any unauthorized access to or use of your username or password or any
        other breach of security. You may not use another user's account without permission.
      </p>

      <h2 id="acceptable-use">4. Acceptable Use</h2>
      <p>You agree to use LawyerAI only for lawful purposes and in accordance with these Terms. You agree not to:</p>
      <ul>
        <li>Use the Service for any illegal or unauthorized purpose</li>
        <li>Violate any applicable laws or regulations</li>
        <li>Infringe upon the rights of others</li>
        <li>Upload or transmit malicious code or harmful content</li>
        <li>Attempt to gain unauthorized access to our systems</li>
        <li>Use the Service to provide legal advice to third parties without proper licensing</li>
      </ul>

      <h2 id="data-privacy">5. Data and Privacy</h2>
      <p>
        Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your information
        when you use our Service. By using LawyerAI, you agree to the collection and use of information in accordance
        with our Privacy Policy.
      </p>

      <h3 id="confidentiality">5.1 Confidentiality</h3>
      <p>
        We understand that you may share confidential information through our Service. We implement appropriate security
        measures to protect your data, but you should be aware of the inherent risks in transmitting information over
        the internet.
      </p>

      <h2 id="intellectual-property">6. Intellectual Property</h2>
      <p>
        The Service and its original content, features, and functionality are and will remain the exclusive property of
        LawyerAI and its licensors. The Service is protected by copyright, trademark, and other laws.
      </p>

      <h2 id="limitation-liability">7. Limitation of Liability</h2>
      <p>
        In no event shall LawyerAI, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable
        for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of
        profits, data, use, goodwill, or other intangible losses, resulting from your use of the Service.
      </p>

      <h2 id="disclaimers">8. Disclaimers</h2>
      <p>
        The information on this Service is provided on an "as is" basis. To the fullest extent permitted by law, this
        Company excludes all representations, warranties, conditions, and terms whether express or implied.
      </p>

      <h2 id="termination">9. Termination</h2>
      <p>
        We may terminate or suspend your account and bar access to the Service immediately, without prior notice or
        liability, under our sole discretion, for any reason whatsoever, including without limitation if you breach the
        Terms.
      </p>

      <h2 id="governing-law">10. Governing Law</h2>
      <p>
        These Terms shall be interpreted and governed by the laws of the jurisdiction in which LawyerAI operates,
        without regard to its conflict of law provisions.
      </p>

      <h2 id="changes-terms">11. Changes to Terms</h2>
      <p>
        We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is
        material, we will provide at least 30 days notice prior to any new terms taking effect.
      </p>

      <h2 id="contact">12. Contact Information</h2>
      <p>
        If you have any questions about these Terms of Service, please contact us at{" "}
        <a href="mailto:legal@lawyerai.com" className="text-primary hover:underline">
          legal@lawyerai.com
        </a>
        .
      </p>
    </LegalPage>
  )
}
