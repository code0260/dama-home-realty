import { Navbar } from '@/components/ui-custom/Navbar';
import { Footer } from '@/components/ui-custom/Footer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | Dama Home Realty',
  description: 'Terms of Service for Dama Home Realty - Legal terms and conditions for using our real estate platform.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold text-primary mb-8">Terms of Service</h1>
        <p className="text-gray-600 mb-6">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

        <div className="prose prose-lg max-w-none space-y-6 text-gray-700">
          <section>
            <h2 className="text-2xl font-semibold text-primary mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing and using Dama Home Realty's platform ("the Service"), you accept and agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use our Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-primary mb-4">2. Description of Service</h2>
            <p>
              Dama Home Realty provides an online platform that connects property owners, tenants, and real estate agents for property listings, bookings, and related services in Damascus, Syria.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-primary mb-4">3. User Accounts</h2>
            <h3 className="text-xl font-semibold mb-3">3.1 Registration</h3>
            <p>To use certain features of the Service, you must register for an account. You agree to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain and update your information to keep it accurate</li>
              <li>Maintain the security of your account credentials</li>
              <li>Accept responsibility for all activities under your account</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-4">3.2 Account Termination</h3>
            <p>We reserve the right to suspend or terminate your account if you violate these Terms or engage in fraudulent, abusive, or illegal activity.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-primary mb-4">4. Property Listings and Bookings</h2>
            <h3 className="text-xl font-semibold mb-3">4.1 Property Information</h3>
            <p>
              We strive to provide accurate property information, but we do not guarantee the accuracy, completeness, or reliability of any property listings. Property details, prices, and availability are subject to change without notice.
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-4">4.2 Booking Process</h3>
            <p>When you make a booking:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>You agree to pay the total price as displayed at the time of booking</li>
              <li>A deposit (typically 30% of the total) is required to confirm your booking</li>
              <li>The remaining balance is due according to the property owner's terms</li>
              <li>Bookings are subject to availability and property owner approval</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-4">4.3 Cancellation Policy</h3>
            <p>
              Cancellation policies vary by property. Please review the specific cancellation terms before booking. Refunds, if applicable, are processed according to our Refund Policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-primary mb-4">5. Payments</h2>
            <p>
              Payments are processed securely through Stripe. By making a payment, you agree to Stripe's Terms of Service. We are not responsible for payment processing errors or issues arising from third-party payment processors.
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>All prices are displayed in the currency specified (USD or SYP)</li>
              <li>You are responsible for any additional fees (e.g., currency conversion fees)</li>
              <li>Refunds, if applicable, will be processed to the original payment method</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-primary mb-4">6. User Conduct</h2>
            <p>You agree not to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Use the Service for any illegal or unauthorized purpose</li>
              <li>Violate any laws in your jurisdiction</li>
              <li>Infringe upon the rights of others</li>
              <li>Transmit any harmful code, viruses, or malware</li>
              <li>Attempt to gain unauthorized access to the Service</li>
              <li>Impersonate any person or entity</li>
              <li>Interfere with or disrupt the Service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-primary mb-4">7. Intellectual Property</h2>
            <p>
              All content on the Service, including text, graphics, logos, images, and software, is the property of Dama Home Realty or its content suppliers and is protected by copyright and other intellectual property laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-primary mb-4">8. Disclaimers</h2>
            <p>
              THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, OR SECURE.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-primary mb-4">9. Limitation of Liability</h2>
            <p>
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, DAMA HOME REALTY SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING OUT OF YOUR USE OF THE SERVICE.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-primary mb-4">10. Indemnification</h2>
            <p>
              You agree to indemnify and hold harmless Dama Home Realty from any claims, damages, losses, liabilities, and expenses arising out of your use of the Service or violation of these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-primary mb-4">11. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of Syria, without regard to its conflict of law provisions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-primary mb-4">12. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. We will notify users of any material changes by posting the updated Terms on this page. Your continued use of the Service after such changes constitutes acceptance of the new Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-primary mb-4">13. Contact Information</h2>
            <p>If you have any questions about these Terms, please contact us:</p>
            <ul className="list-none pl-0 space-y-2 mt-4">
              <li><strong>Email:</strong> <a href="mailto:legal@dama-home.com" className="text-primary hover:underline">legal@dama-home.com</a></li>
              <li><strong>Address:</strong> Damascus, Syria</li>
            </ul>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

