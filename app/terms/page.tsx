import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function TermsOfUsePage() {
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms of Use</h1>
          <p className="text-gray-600 mb-8">Effective Date: January 1, 2025</p>

          <div className="prose prose-gray max-w-none">
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Welcome to LiteFi Microfinance Bank ("LiteFi," "we," "us," or "our"). These Terms of Use ("Terms") 
                govern your access to and use of our website, mobile applications, and financial services 
                (collectively, the "Services"). By accessing or using our Services, you agree to be bound by these Terms.
              </p>
              <p className="text-gray-700 leading-relaxed">
                If you do not agree to these Terms, please do not use our Services. We may update these Terms 
                from time to time, and your continued use of our Services constitutes acceptance of any changes.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">2. About LiteFi</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                LiteFi is a licensed microfinance bank providing digital financial services including:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li>Digital wallet services and money transfers</li>
                <li>Microloans and credit facilities</li>
                <li>Investment and savings products</li>
                <li>Financial planning and advisory services</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                Our Services are regulated by the Central Bank and we are committed to providing secure, 
                reliable financial solutions to help you achieve financial freedom.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Eligibility and Account Registration</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                To use our Services, you must:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li>Be at least 18 years of age</li>
                <li>Have legal capacity to enter into binding agreements</li>
                <li>Provide accurate, complete, and current information during registration</li>
                <li>Maintain the security of your account credentials</li>
                <li>Comply with all applicable laws and regulations</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                You are responsible for all activities that occur under your account. Please notify us immediately 
                of any unauthorized use of your account.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Financial Services Terms</h2>
              
              <h3 className="text-lg font-medium text-gray-900 mb-3">4.1 Loans and Credit</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Loan approvals are subject to our credit assessment and risk evaluation. Interest rates, 
                fees, and repayment terms will be clearly disclosed before you accept any loan offer. 
                Late payments may result in additional fees and impact your credit score.
              </p>

              <h3 className="text-lg font-medium text-gray-900 mb-3">4.2 Investment Services</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Investment products carry inherent risks, and past performance does not guarantee future results. 
                We provide information and tools to help you make informed decisions, but you are responsible 
                for your investment choices.
              </p>

              <h3 className="text-lg font-medium text-gray-900 mb-3">4.3 Digital Wallet</h3>
              <p className="text-gray-700 leading-relaxed">
                Your digital wallet allows you to store, send, and receive money electronically. Transaction 
                limits and fees apply as disclosed in our fee schedule. We use industry-standard security 
                measures to protect your funds.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Fees and Charges</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Our current fee schedule is available on our website and in your account dashboard. 
                We reserve the right to modify fees with 30 days' advance notice. You will be notified 
                of any fee changes through email or in-app notifications.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Privacy and Data Protection</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We take your privacy seriously. Our collection, use, and protection of your personal 
                information is governed by our Privacy Policy, which is incorporated into these Terms by reference.
              </p>
              <p className="text-gray-700 leading-relaxed">
                By using our Services, you consent to the collection and use of your information as 
                described in our Privacy Policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Prohibited Activities</h2>
              <p className="text-gray-700 leading-relaxed mb-4">You agree not to:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li>Use our Services for any illegal or unauthorized purpose</li>
                <li>Violate any laws, regulations, or third-party rights</li>
                <li>Engage in fraudulent, deceptive, or misleading activities</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Interfere with or disrupt our Services</li>
                <li>Use our Services to launder money or finance terrorism</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Limitation of Liability</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                To the maximum extent permitted by law, LiteFi shall not be liable for any indirect, 
                incidental, special, consequential, or punitive damages, including but not limited to 
                loss of profits, data, or business opportunities.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Our total liability to you for any claims arising from or related to these Terms or 
                our Services shall not exceed the amount of fees you paid to us in the 12 months 
                preceding the claim.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">9. Termination</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                You may terminate your account at any time by contacting our customer support. 
                We may suspend or terminate your account if you violate these Terms or engage 
                in activities that pose a risk to us or other users.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Upon termination, you remain liable for any outstanding obligations, and we will 
                return any remaining account balance in accordance with applicable laws.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">10. Governing Law</h2>
              <p className="text-gray-700 leading-relaxed">
                These Terms are governed by the laws of [Your Jurisdiction]. Any disputes arising 
                from these Terms or our Services shall be resolved through binding arbitration 
                in accordance with the rules of [Arbitration Body].
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">11. Contact Information</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                If you have any questions about these Terms, please contact us:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700"><strong>Email:</strong> legal@litefi.com</p>
                <p className="text-gray-700"><strong>Phone:</strong> +1 (555) 123-4567</p>
                <p className="text-gray-700"><strong>Address:</strong> 123 Financial District, Suite 100, City, State 12345</p>
              </div>
            </section>
          </div>

          {/* Footer Links */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
              <Link 
                href="/privacy" 
                className="text-red-600 hover:text-red-700 font-medium"
              >
                Privacy Policy
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