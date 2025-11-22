'use client';

import { LegalPageLayout } from '@/components/legal/LegalPageLayout';

const lastUpdated = '2024-01-15';

const versions = [
  {
    version: '1.1',
    date: '2024-01-15',
    changes: [
      'Updated cancellation timeframes',
      'Enhanced refund processing details',
      'Added special circumstances section',
    ],
    isCurrent: true,
  },
  {
    version: '1.0',
    date: '2023-12-01',
    changes: ['Initial version of Refund Policy'],
  },
];

export default function RefundPolicyPage() {
  return (
    <LegalPageLayout title="Refund Policy" lastUpdated={lastUpdated} versions={versions}>
      <section id="overview">
        <h2>1. Overview</h2>
        <p>
          This Refund Policy outlines the terms and conditions for refunds and cancellations for
          bookings made through Dama Home Realty. Please read this policy carefully before making a
          booking.
        </p>
      </section>

      <section id="cancellation-by-guest">
        <h2>2. Cancellation by Guest</h2>
        <h3>2.1 Cancellation Timeframes</h3>
        <p>Refund eligibility depends on when you cancel:</p>
        <ul>
          <li>
            <strong>More than 14 days before check-in:</strong> Full refund of deposit (minus
            processing fees)
          </li>
          <li>
            <strong>7-14 days before check-in:</strong> 50% refund of deposit
          </li>
          <li>
            <strong>Less than 7 days before check-in:</strong> No refund (unless property owner
            agrees otherwise)
          </li>
        </ul>

        <h3>2.2 How to Cancel</h3>
        <p>
          To cancel a booking, please contact us at{' '}
          <a href="mailto:support@dama-home.com">support@dama-home.com</a> or through your Tenant
          Portal. Cancellation requests must be made in writing.
        </p>
      </section>

      <section id="cancellation-by-owner">
        <h2>3. Cancellation by Property Owner</h2>
        <p>
          If a property owner cancels your booking, you will receive a full refund of all payments
          made, including the deposit. We will also assist you in finding alternative accommodation
          if available.
        </p>
      </section>

      <section id="cancellation-by-platform">
        <h2>4. Cancellation by Dama Home Realty</h2>
        <p>
          In rare cases where we must cancel a booking due to circumstances beyond our control
          (e.g., property damage, legal issues), you will receive a full refund and assistance
          finding alternative accommodation.
        </p>
      </section>

      <section id="refund-processing">
        <h2>5. Refund Processing</h2>
        <h3>5.1 Processing Time</h3>
        <p>
          Refunds are typically processed within 5-10 business days after approval. The refund will
          be issued to the original payment method used for the booking.
        </p>

        <h3>5.2 Processing Fees</h3>
        <p>
          A processing fee of 3% may be deducted from refunds to cover payment processing costs.
          This fee does not apply if the cancellation is due to our error or property owner
          cancellation.
        </p>

        <h3>5.3 Currency Conversion</h3>
        <p>
          If your payment was made in a different currency, the refund will be processed in the
          original currency. Exchange rates may vary, and any currency conversion fees are the
          responsibility of the customer.
        </p>
      </section>

      <section id="special-circumstances">
        <h2>6. Special Circumstances</h2>
        <h3>6.1 Force Majeure</h3>
        <p>
          In cases of force majeure (natural disasters, pandemics, government restrictions, etc.),
          refund policies may be adjusted on a case-by-case basis. We will work with both guests
          and property owners to find fair solutions.
        </p>

        <h3>6.2 Property Issues</h3>
        <p>
          If you encounter significant issues with the property (e.g., not as described, safety
          concerns, major maintenance problems), please contact us immediately. We will investigate
          and may offer a partial or full refund depending on the circumstances.
        </p>
      </section>

      <section id="no-show">
        <h2>7. No-Show Policy</h2>
        <p>
          If you fail to check in on the scheduled date without prior notice, your booking will be
          considered a no-show, and no refund will be issued unless otherwise agreed upon.
        </p>
      </section>

      <section id="disputes">
        <h2>8. Disputes</h2>
        <p>
          If you disagree with a refund decision, please contact us at{' '}
          <a href="mailto:disputes@dama-home.com">disputes@dama-home.com</a>. We will review your
          case and respond within 5 business days.
        </p>
      </section>

      <section id="property-specific">
        <h2>9. Property-Specific Policies</h2>
        <p>
          Some properties may have specific cancellation policies that differ from our standard
          policy. These will be clearly stated in the property listing and booking confirmation.
          Property-specific policies take precedence over this general policy.
        </p>
      </section>

      <section id="contact-refund">
        <h2>10. Contact Us</h2>
        <p>For refund requests or questions about this policy, please contact us:</p>
        <ul>
          <li>
            <strong>Email:</strong> <a href="mailto:support@dama-home.com">support@dama-home.com</a>
          </li>
          <li>
            <strong>Phone:</strong> <a href="tel:+963123456789">+963 123 456 789</a>
          </li>
          <li>
            <strong>Address:</strong> Damascus, Syria
          </li>
        </ul>
      </section>
    </LegalPageLayout>
  );
}
