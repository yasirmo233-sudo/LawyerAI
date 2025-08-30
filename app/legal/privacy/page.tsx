import { LegalPage } from "@/components/legal-page"

export const metadata = {
  title: "Privacy Policy - LawyerAI",
  description: "Privacy Policy for LawyerAI - AI Legal Assistant",
}

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" lastUpdated="January 1, 2024">
      <h2 id="introduction">1. Introduction</h2>
      <p>
        LawyerAI ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we
        collect, use, disclose, and safeguard your information when you use our AI legal assistant service.
      </p>

      <h2 id="information-collect">2. Information We Collect</h2>
      <p>
        We collect information you provide directly to us and information we obtain automatically when you use our
        Service.
      </p>

      <h3 id="information-provide">2.1 Information You Provide</h3>
      <ul>
        <li>
          <strong>Account Information:</strong> Email address, name, and password when you create an account
        </li>
        <li>
          <strong>Chat Data:</strong> Messages, questions, and conversations with our AI assistant
        </li>
        <li>
          <strong>Documents:</strong> Files you upload for analysis or review
        </li>
        <li>
          <strong>Settings:</strong> Your preferences and configuration choices
        </li>
        <li>
          <strong>Payment Information:</strong> Billing details for paid subscriptions (processed by third-party
          providers)
        </li>
      </ul>

      <h3 id="automatic-information">2.2 Information Collected Automatically</h3>
      <ul>
        <li>
          <strong>Usage Data:</strong> How you interact with our Service, features used, and time spent
        </li>
        <li>
          <strong>Device Information:</strong> IP address, browser type, operating system, and device identifiers
        </li>
        <li>
          <strong>Log Data:</strong> Server logs, error reports, and performance metrics
        </li>
        <li>
          <strong>Cookies:</strong> Small data files stored on your device to enhance your experience
        </li>
      </ul>

      <h2 id="how-use-information">3. How We Use Your Information</h2>
      <p>We use the information we collect to:</p>
      <ul>
        <li>Provide, maintain, and improve our AI legal assistant service</li>
        <li>Process your requests and respond to your inquiries</li>
        <li>Personalize your experience and provide relevant suggestions</li>
        <li>Communicate with you about your account and our services</li>
        <li>Ensure the security and integrity of our Service</li>
        <li>Comply with legal obligations and resolve disputes</li>
        <li>Develop new features and improve our AI models</li>
      </ul>

      <h3 id="ai-training">3.1 AI Model Training</h3>
      <p>
        <strong>Important:</strong> We do not use your personal conversations, uploaded documents, or confidential
        information to train our AI models. Your data remains private and is not shared with third-party AI training
        datasets.
      </p>

      <h2 id="information-sharing">4. Information Sharing and Disclosure</h2>
      <p>
        We do not sell, trade, or rent your personal information to third parties. We may share your information only in
        the following circumstances:
      </p>

      <h3 id="service-providers">4.1 Service Providers</h3>
      <p>
        We may share information with trusted third-party service providers who assist us in operating our Service, such
        as cloud hosting, payment processing, and customer support. These providers are bound by confidentiality
        agreements.
      </p>

      <h3 id="legal-requirements">4.2 Legal Requirements</h3>
      <p>
        We may disclose your information if required by law, court order, or government request, or to protect our
        rights, property, or safety, or that of our users or the public.
      </p>

      <h3 id="business-transfers">4.3 Business Transfers</h3>
      <p>
        In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of that
        transaction, subject to the same privacy protections.
      </p>

      <h2 id="data-security">5. Data Security</h2>
      <p>We implement appropriate technical and organizational measures to protect your information:</p>
      <ul>
        <li>
          <strong>Encryption:</strong> Data is encrypted in transit and at rest using industry-standard protocols
        </li>
        <li>
          <strong>Access Controls:</strong> Strict access controls limit who can view your information
        </li>
        <li>
          <strong>Regular Audits:</strong> We conduct regular security assessments and updates
        </li>
        <li>
          <strong>Secure Infrastructure:</strong> Our systems are hosted on secure, compliant cloud platforms
        </li>
      </ul>

      <h2 id="data-retention">6. Data Retention</h2>
      <p>
        We retain your information for as long as necessary to provide our services and comply with legal obligations.
        Chat conversations are stored for the duration of your account unless you delete them. Uploaded documents are
        processed and then securely deleted within 30 days unless you save them to your account.
      </p>

      <h2 id="your-rights">7. Your Rights and Choices</h2>
      <p>You have the following rights regarding your personal information:</p>
      <ul>
        <li>
          <strong>Access:</strong> Request a copy of the personal information we hold about you
        </li>
        <li>
          <strong>Correction:</strong> Request correction of inaccurate or incomplete information
        </li>
        <li>
          <strong>Deletion:</strong> Request deletion of your personal information
        </li>
        <li>
          <strong>Portability:</strong> Request transfer of your data to another service
        </li>
        <li>
          <strong>Opt-out:</strong> Unsubscribe from marketing communications
        </li>
      </ul>

      <h3 id="account-controls">7.1 Account Controls</h3>
      <p>
        You can access, update, or delete your account information through your account settings. You can also delete
        individual conversations or uploaded documents at any time.
      </p>

      <h2 id="international-transfers">8. International Data Transfers</h2>
      <p>
        Your information may be transferred to and processed in countries other than your own. We ensure appropriate
        safeguards are in place to protect your information in accordance with this Privacy Policy.
      </p>

      <h2 id="children-privacy">9. Children's Privacy</h2>
      <p>
        Our Service is not intended for children under 13 years of age. We do not knowingly collect personal information
        from children under 13. If you become aware that a child has provided us with personal information, please
        contact us.
      </p>

      <h2 id="changes-policy">10. Changes to This Privacy Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the
        new Privacy Policy on this page and updating the "Last updated" date.
      </p>

      <h2 id="contact-privacy">11. Contact Us</h2>
      <p>If you have any questions about this Privacy Policy or our privacy practices, please contact us at:</p>
      <ul>
        <li>
          Email:{" "}
          <a href="mailto:privacy@lawyerai.com" className="text-primary hover:underline">
            privacy@lawyerai.com
          </a>
        </li>
        <li>Subject Line: Privacy Policy Inquiry</li>
      </ul>

      <h2 id="gdpr-ccpa">12. Additional Rights (GDPR/CCPA)</h2>
      <p>
        If you are a resident of the European Union or California, you may have additional rights under GDPR or CCPA
        respectively. Please contact us using the information above to exercise these rights.
      </p>
    </LegalPage>
  )
}
