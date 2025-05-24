import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center">
              <Image 
                src="/assets/images/logo.png" 
                alt="LiteFi Logo" 
                width={120}
                height={36}
                style={{ width: 'auto', height: 'auto' }}
              />
            </Link>
            <Link 
              href="/auth/login" 
              className="text-red-600 hover:text-red-700 font-medium"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
          <p className="text-gray-600 mb-8">Effective Date: January 1, 2025</p>

          <div className="prose prose-gray max-w-none">
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                LiteFi Microfinance Bank ("LiteFi," "we," "us," or "our") is committed to protecting your privacy 
                and ensuring the security of your personal information. This Privacy Policy explains how we collect, 
                use, disclose, and safeguard your information when you use our financial services, website, and 
                mobile applications.
              </p>
              <p className="text-gray-700 leading-relaxed">
                By using our services, you consent to the collection and use of your information as described 
                in this Privacy Policy. If you do not agree with our policies and practices, please do not use our services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Information We Collect</h2>
              
              <h3 className="text-lg font-medium text-gray-900 mb-3">2.1 Personal Information</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                We collect personal information that you provide directly to us, including:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li>Full name, date of birth, and government-issued ID numbers</li>
                <li>Contact information (email address, phone number, mailing address)</li>
                <li>Financial information (bank account details, income, employment status)</li>
                <li>Transaction history and account activity</li>
                <li>Biometric data for identity verification (where permitted by law)</li>
                <li>Photos and documents for account verification</li>
              </ul>

              <h3 className="text-lg font-medium text-gray-900 mb-3">2.2 Automatically Collected Information</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                When you use our services, we automatically collect certain information:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li>Device information (IP address, browser type, operating system)</li>
                <li>Usage data (pages visited, time spent, click patterns)</li>
                <li>Location data (with your consent)</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>

              <h3 className="text-lg font-medium text-gray-900 mb-3">2.3 Information from Third Parties</h3>
              <p className="text-gray-700 leading-relaxed">
                We may receive information about you from credit bureaus, identity verification services, 
                fraud prevention services, and other financial institutions to verify your identity and 
                assess creditworthiness.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">3. How We Use Your Information</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We use your information for the following purposes:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li>Providing and maintaining our financial services</li>
                <li>Processing transactions and managing your account</li>
                <li>Verifying your identity and preventing fraud</li>
                <li>Assessing creditworthiness and managing risk</li>
                <li>Complying with legal and regulatory requirements</li>
                <li>Communicating with you about your account and our services</li>
                <li>Improving our services and developing new features</li>
                <li>Marketing our products and services (with your consent)</li>
                <li>Resolving disputes and providing customer support</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Information Sharing and Disclosure</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We may share your information in the following circumstances:
              </p>

              <h3 className="text-lg font-medium text-gray-900 mb-3">4.1 With Your Consent</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                We may share your information when you explicitly consent to such sharing.
              </p>

              <h3 className="text-lg font-medium text-gray-900 mb-3">4.2 Service Providers</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                We work with trusted third-party service providers who help us operate our business, 
                including payment processors, cloud storage providers, and customer support services.
              </p>

              <h3 className="text-lg font-medium text-gray-900 mb-3">4.3 Legal Requirements</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                We may disclose your information when required by law, regulation, legal process, 
                or government request, including anti-money laundering and counter-terrorism financing requirements.
              </p>

              <h3 className="text-lg font-medium text-gray-900 mb-3">4.4 Business Transfers</h3>
              <p className="text-gray-700 leading-relaxed">
                In the event of a merger, acquisition, or sale of assets, your information may be 
                transferred as part of the transaction, subject to appropriate confidentiality protections.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Data Security</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We implement robust security measures to protect your information:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li>End-to-end encryption for sensitive data transmission</li>
                <li>Multi-factor authentication for account access</li>
                <li>Regular security audits and penetration testing</li>
                <li>Secure data centers with physical access controls</li>
                <li>Employee training on data protection and privacy</li>
                <li>Incident response procedures for security breaches</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                While we strive to protect your information, no method of transmission over the internet 
                or electronic storage is 100% secure. We cannot guarantee absolute security.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Your Rights and Choices</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Depending on your location, you may have the following rights:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li><strong>Access:</strong> Request access to your personal information</li>
                <li><strong>Correction:</strong> Request correction of inaccurate information</li>
                <li><strong>Deletion:</strong> Request deletion of your information (subject to legal requirements)</li>
                <li><strong>Portability:</strong> Request a copy of your information in a portable format</li>
                <li><strong>Opt-out:</strong> Opt out of marketing communications</li>
                <li><strong>Restriction:</strong> Request restriction of processing in certain circumstances</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                To exercise these rights, please contact us using the information provided below. 
                We may need to verify your identity before processing your request.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Cookies and Tracking Technologies</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We use cookies and similar technologies to:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li>Remember your preferences and settings</li>
                <li>Authenticate your identity and maintain session security</li>
                <li>Analyze website usage and improve our services</li>
                <li>Provide personalized content and advertisements</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                You can control cookies through your browser settings, but disabling certain cookies 
                may affect the functionality of our services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Data Retention</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We retain your information for as long as necessary to:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li>Provide our services and maintain your account</li>
                <li>Comply with legal and regulatory requirements</li>
                <li>Resolve disputes and enforce our agreements</li>
                <li>Prevent fraud and maintain security</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                When information is no longer needed, we securely delete or anonymize it in accordance 
                with our data retention policies and applicable laws.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">9. International Data Transfers</h2>
              <p className="text-gray-700 leading-relaxed">
                Your information may be transferred to and processed in countries other than your country 
                of residence. We ensure that such transfers are conducted in accordance with applicable 
                data protection laws and implement appropriate safeguards to protect your information.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">10. Children's Privacy</h2>
              <p className="text-gray-700 leading-relaxed">
                Our services are not intended for individuals under the age of 18. We do not knowingly 
                collect personal information from children. If we become aware that we have collected 
                information from a child, we will take steps to delete such information promptly.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">11. Changes to This Privacy Policy</h2>
              <p className="text-gray-700 leading-relaxed">
                We may update this Privacy Policy from time to time to reflect changes in our practices 
                or applicable laws. We will notify you of material changes by email or through our services. 
                Your continued use of our services after such notification constitutes acceptance of the updated policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">12. Contact Us</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                If you have any questions about this Privacy Policy or our privacy practices, please contact us:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700"><strong>Privacy Officer</strong></p>
                <p className="text-gray-700"><strong>Email:</strong> privacy@litefi.com</p>
                <p className="text-gray-700"><strong>Phone:</strong> +1 (555) 123-4567</p>
                <p className="text-gray-700"><strong>Address:</strong> 123 Financial District, Suite 100, City, State 12345</p>
              </div>
            </section>
          </div>

          {/* Footer Links */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
              <Link 
                href="/terms" 
                className="text-red-600 hover:text-red-700 font-medium"
              >
                Terms of Use
              </Link>
              <Link 
                href="/auth/sign-up" 
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-none font-medium transition-colors"
              >
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 