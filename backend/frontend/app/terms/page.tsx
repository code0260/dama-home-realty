'use client';

import { LegalPageLayout } from '@/components/legal/LegalPageLayout';

const lastUpdated = '2024-01-15';

const versions = [
  {
    version: '1.1',
    date: '2024-01-15',
    changes: [
      'Updated payment terms',
      'Enhanced cancellation policy',
      'Added dispute resolution section',
    ],
    isCurrent: true,
  },
  {
    version: '1.0',
    date: '2023-12-01',
    changes: ['Initial version of Terms of Service'],
  },
];

export default function TermsPage() {
  return (
    <LegalPageLayout 
      title="Terms of Service" 
      lastUpdated={lastUpdated} 
      versions={versions}
      description="Please read these terms and conditions carefully before using our platform and services."
    >
      <section id="acceptance">
        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing and using Dama Home Realty's platform ("the Service"), you accept and agree
          to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms,
          please do not use our Service.
        </p>
      </section>

      <section id="description">
        <h2>2. Description of Service</h2>
        <p>
          Dama Home Realty provides an online platform that connects property owners, tenants, and
          real estate agents for property listings, bookings, and related services in Damascus,
          Syria.
        </p>
      </section>

      <section id="user-accounts">
        <h2>3. User Accounts</h2>
        <h3>3.1 Registration</h3>
        <p>To use certain features of the Service, you must register for an account. You agree to:</p>
        <ul>
          <li>Provide accurate, current, and complete information</li>
          <li>Maintain and update your information to keep it accurate</li>
          <li>Maintain the security of your account credentials</li>
          <li>Accept responsibility for all activities under your account</li>
        </ul>

        <h3>3.2 Account Termination</h3>
        <p>
          We reserve the right to suspend or terminate your account if you violate these Terms or
          engage in fraudulent, abusive, or illegal activity.
        </p>
      </section>

      <section id="property-listings">
        <h2>4. Property Listings and Bookings</h2>
        <h3>4.1 Property Information</h3>
        <p>
          We strive to provide accurate property information, but we do not guarantee the accuracy,
          completeness, or reliability of any property listings. Property details, prices, and
          availability are subject to change without notice.
        </p>

        <h3>4.2 Booking Process</h3>
        <p>When you make a booking:</p>
        <ul>
          <li>You agree to pay the total price as displayed at the time of booking</li>
          <li>A deposit (typically 30% of the total) is required to confirm your booking</li>
          <li>The remaining balance is due according to the property owner's terms</li>
          <li>Bookings are subject to availability and property owner approval</li>
        </ul>

        <h3>4.3 Cancellation Policy</h3>
        <p>
          Cancellation policies vary by property. Please review the specific cancellation terms
          before booking. Refunds, if applicable, are processed according to our Refund Policy.
        </p>
      </section>

      <section id="payments">
        <h2>5. Payments</h2>
        <p>
          Payments are processed securely through Stripe. By making a payment, you agree to
          Stripe's Terms of Service. We are not responsible for payment processing errors or issues
          arising from third-party payment processors.
        </p>
        <ul>
          <li>All prices are displayed in the currency specified (USD or SYP)</li>
          <li>You are responsible for any additional fees (e.g., currency conversion fees)</li>
          <li>Refunds, if applicable, will be processed to the original payment method</li>
        </ul>
      </section>

      <section id="user-conduct">
        <h2>6. User Conduct</h2>
        <p>You agree not to:</p>
        <ul>
          <li>Use the Service for any illegal or unauthorized purpose</li>
          <li>Violate any laws in your jurisdiction</li>
          <li>Infringe upon the rights of others</li>
          <li>Transmit any harmful code, viruses, or malware</li>
          <li>Attempt to gain unauthorized access to the Service</li>
          <li>Impersonate any person or entity</li>
          <li>Interfere with or disrupt the Service</li>
        </ul>
      </section>

      <section id="intellectual-property">
        <h2>7. Intellectual Property</h2>
        <p>
          All content on the Service, including text, graphics, logos, images, and software, is the
          property of Dama Home Realty or its content suppliers and is protected by copyright and
          other intellectual property laws.
        </p>
      </section>

      <section id="disclaimers">
        <h2>8. Disclaimers</h2>
        <p>
          THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER
          EXPRESS OR IMPLIED. WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED,
          ERROR-FREE, OR SECURE.
        </p>
      </section>

      <section id="limitation-liability">
        <h2>9. Limitation of Liability</h2>
        <p>
          TO THE MAXIMUM EXTENT PERMITTED BY LAW, DAMA HOME REALTY SHALL NOT BE LIABLE FOR ANY
          INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING OUT OF YOUR USE
          OF THE SERVICE.
        </p>
      </section>

      <section id="indemnification">
        <h2>10. Indemnification</h2>
        <p>
          You agree to indemnify and hold harmless Dama Home Realty from any claims, damages,
          losses, liabilities, and expenses arising out of your use of the Service or violation of
          these Terms.
        </p>
      </section>

      <section id="governing-law">
        <h2>11. Governing Law</h2>
        <p>
          These Terms shall be governed by and construed in accordance with the laws of Syria,
          without regard to its conflict of law provisions.
        </p>
      </section>

      <section id="changes-terms">
        <h2>12. Changes to Terms</h2>
        <p>
          We reserve the right to modify these Terms at any time. We will notify users of any
          material changes by posting the updated Terms on this page. Your continued use of the
          Service after such changes constitutes acceptance of the new Terms.
        </p>
      </section>

      <section id="contact-terms">
        <h2>13. Contact Information</h2>
        <p>If you have any questions about these Terms, please contact us:</p>
        <ul>
          <li>
            <strong>Email:</strong> <a href="mailto:legal@dama-home.com">legal@dama-home.com</a>
          </li>
          <li>
            <strong>Address:</strong> Damascus, Syria
          </li>
        </ul>
      </section>
    </LegalPageLayout>
  );
}
