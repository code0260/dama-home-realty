'use client';

import { LegalPageLayout } from '@/components/legal/LegalPageLayout';

const lastUpdated = '2024-01-15';

const versions = [
  {
    version: '1.1',
    date: '2024-01-15',
    changes: [
      'Added GDPR compliance section',
      'Updated data retention policies',
      'Enhanced cookie policy information',
    ],
    isCurrent: true,
  },
  {
    version: '1.0',
    date: '2023-12-01',
    changes: ['Initial version of Privacy Policy'],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <LegalPageLayout
      title="Privacy Policy"
      lastUpdated={lastUpdated}
      versions={versions}
      description="Learn how we collect, use, and protect your personal information when you use our services."
    >
      <section id="introduction">
        <h2>1. Introduction</h2>
        <p>
          Dama Home Realty ("we," "our," or "us") is committed to protecting your privacy. This
          Privacy Policy explains how we collect, use, disclose, and safeguard your information
          when you use our real estate platform and services.
        </p>
        <p>
          By using our services, you agree to the collection and use of information in accordance
          with this policy. We comply with the General Data Protection Regulation (GDPR) and other
          applicable data protection laws.
        </p>
      </section>

      <section id="information-we-collect">
        <h2>2. Information We Collect</h2>
        <h3>2.1 Personal Information</h3>
        <p>We may collect the following personal information:</p>
        <ul>
          <li>Name, email address, phone number</li>
          <li>Payment information (processed securely through Stripe)</li>
          <li>Booking and property inquiry information</li>
          <li>Account credentials and preferences</li>
          <li>Communication history with our agents</li>
        </ul>

        <h3>2.2 Automatically Collected Information</h3>
        <p>We may automatically collect:</p>
        <ul>
          <li>IP address and device information</li>
          <li>Browser type and version</li>
          <li>Pages visited and time spent on our platform</li>
          <li>Cookies and similar tracking technologies</li>
        </ul>
      </section>

      <section id="how-we-use">
        <h2>3. How We Use Your Information</h2>
        <p>We use the collected information for:</p>
        <ul>
          <li>Processing bookings and property inquiries</li>
          <li>Communicating with you about your bookings and services</li>
          <li>Sending booking confirmations and important updates</li>
          <li>Improving our services and user experience</li>
          <li>Complying with legal obligations</li>
          <li>Preventing fraud and ensuring platform security</li>
        </ul>
      </section>

      <section id="data-sharing">
        <h2>4. Data Sharing and Disclosure</h2>
        <p>
          We do not sell your personal information. We may share your information only in the
          following circumstances:
        </p>
        <ul>
          <li>
            <strong>Service Providers:</strong> With trusted third-party service providers (e.g.,
            Stripe for payments) who assist in operating our platform
          </li>
          <li>
            <strong>Legal Requirements:</strong> When required by law or to protect our rights and
            safety
          </li>
          <li>
            <strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale
            of assets
          </li>
          <li>
            <strong>With Your Consent:</strong> When you explicitly authorize us to share your
            information
          </li>
        </ul>
      </section>

      <section id="your-rights">
        <h2>5. Your Rights (GDPR)</h2>
        <p>Under GDPR, you have the following rights:</p>
        <ul>
          <li>
            <strong>Right to Access:</strong> Request a copy of your personal data
          </li>
          <li>
            <strong>Right to Rectification:</strong> Correct inaccurate or incomplete data
          </li>
          <li>
            <strong>Right to Erasure:</strong> Request deletion of your personal data
          </li>
          <li>
            <strong>Right to Restrict Processing:</strong> Limit how we use your data
          </li>
          <li>
            <strong>Right to Data Portability:</strong> Receive your data in a structured format
          </li>
          <li>
            <strong>Right to Object:</strong> Object to processing of your personal data
          </li>
          <li>
            <strong>Right to Withdraw Consent:</strong> Withdraw consent at any time
          </li>
        </ul>
        <p>
          To exercise these rights, please contact us at{' '}
          <a href="mailto:privacy@dama-home.com">privacy@dama-home.com</a>.
        </p>
      </section>

      <section id="data-security">
        <h2>6. Data Security</h2>
        <p>
          We implement appropriate technical and organizational measures to protect your personal
          information against unauthorized access, alteration, disclosure, or destruction. However,
          no method of transmission over the Internet is 100% secure.
        </p>
      </section>

      <section id="data-retention">
        <h2>7. Data Retention</h2>
        <p>
          We retain your personal information only for as long as necessary to fulfill the purposes
          outlined in this Privacy Policy, unless a longer retention period is required or permitted
          by law.
        </p>
      </section>

      <section id="cookies">
        <h2>8. Cookies</h2>
        <p>
          We use cookies to enhance your experience on our platform. You can control cookies through
          your browser settings. However, disabling cookies may limit your ability to use certain
          features.
        </p>
      </section>

      <section id="international-transfers">
        <h2>9. International Data Transfers</h2>
        <p>
          Your information may be transferred to and processed in countries outside the European
          Economic Area (EEA). We ensure appropriate safeguards are in place to protect your data in
          accordance with GDPR requirements.
        </p>
      </section>

      <section id="children-privacy">
        <h2>10. Children's Privacy</h2>
        <p>
          Our services are not intended for individuals under the age of 18. We do not knowingly
          collect personal information from children.
        </p>
      </section>

      <section id="changes">
        <h2>11. Changes to This Privacy Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. We will notify you of any changes by
          posting the new Privacy Policy on this page and updating the "Last updated" date.
        </p>
      </section>

      <section id="contact">
        <h2>12. Contact Us</h2>
        <p>If you have any questions about this Privacy Policy, please contact us:</p>
        <ul>
          <li>
            <strong>Email:</strong> <a href="mailto:privacy@dama-home.com">privacy@dama-home.com</a>
          </li>
          <li>
            <strong>Address:</strong> Damascus, Syria
          </li>
        </ul>
      </section>
    </LegalPageLayout>
  );
}
