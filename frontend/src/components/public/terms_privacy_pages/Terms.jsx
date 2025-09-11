import React from "react";
import {
  Shield,
  Users,
  Home,
  AlertTriangle,
  FileText,
  Scale,
  Text,
  Lock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { colors } from "@/utils/colors";

export default function Terms() {
  const lastUpdated = "September 1, 2025";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div>
        <div className="max-w-4xl mx-auto px-6 pt-8">
          <div className="flex items-center gap-4 mb-2">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ backgroundColor: colors.lightPrimary }}
            >
              <Scale size={24} style={{ color: colors.primary }} />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Terms of Service
              </h1>
              <p className="text-gray-600 mt-1">Last updated: {lastUpdated}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="space-y-8">
          {/* Introduction */}
          <Card className="shadow-lg border-0 p-0">
            <CardHeader className="bg-gradient-to-r flex items-center p-2 from-blue-500 to-purple-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <FileText size={24} />
                1. Agreement to Terms
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <p className="text-gray-700 leading-relaxed">
                Welcome to <strong>Nest</strong>, a property rental and
                accommodation platform operated by Nest Technologies Private
                Limited ("Company," "we," "our," or "us"). These Terms of
                Service ("Terms") govern your use of our website, mobile
                application, and related services (collectively, the "Service").
              </p>
              <p className="text-gray-700 leading-relaxed">
                By accessing or using our Service, you agree to be bound by
                these Terms. If you disagree with any part of these terms, then
                you may not access the Service.
              </p>
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <div className="flex items-start gap-2">
                  <AlertTriangle
                    size={20}
                    className="text-blue-500 flex-shrink-0 mt-0.5"
                  />
                  <p className="text-blue-800 text-sm">
                    <strong>Important:</strong> These Terms constitute a legally
                    binding agreement. Please read them carefully before using
                    our Service.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* User Accounts */}
          <Card className="shadow-lg border-0 p-0">
            <CardHeader className="bg-gradient-to-r flex items-center p-2 from-green-500 to-teal-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Users size={24} />
                2. User Accounts
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Account Registration
              </h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>You must be at least 18 years old to create an account</li>
                <li>
                  You must provide accurate and complete information during
                  registration
                </li>
                <li>
                  You are responsible for maintaining the security of your
                  account and password
                </li>
                <li>
                  You must notify us immediately of any unauthorized use of your
                  account
                </li>
                <li>One person may not maintain more than one account</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-800 mt-6">
                Account Verification
              </h3>
              <p className="text-gray-700 leading-relaxed">
                We may require identity verification for certain services. You
                agree to provide valid government-issued identification and
                other documents as requested. Failure to complete verification
                may result in service limitations.
              </p>
            </CardContent>
          </Card>

          {/* Property Listings */}
          <Card className="shadow-lg border-0 p-0">
            <CardHeader className="bg-gradient-to-r flex items-center p-2 from-orange-500 to-red-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Home size={24} />
                3. Property Listings & Bookings
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">
                For Property Owners/Hosts
              </h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>
                  You must have legal authority to list and rent the property
                </li>
                <li>All listing information must be accurate and up-to-date</li>
                <li>
                  You must comply with local laws and regulations regarding
                  property rental
                </li>
                <li>
                  You are responsible for the condition and safety of your
                  property
                </li>
                <li>
                  You must honor confirmed bookings unless extraordinary
                  circumstances arise
                </li>
                <li>Service fees apply to all successful bookings</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-800 mt-6">
                For Tenants/Guests
              </h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>You must use properties only for their intended purpose</li>
                <li>
                  You agree to follow house rules and respect property
                  guidelines
                </li>
                <li>
                  You are responsible for any damage beyond normal wear and tear
                </li>
                <li>Maximum occupancy limits must be respected</li>
                <li>Illegal activities are strictly prohibited</li>
              </ul>
            </CardContent>
          </Card>

          {/* Payments */}
          <Card className="shadow-lg border-0 p-0">
            <CardHeader className="bg-gradient-to-r flex items-center p-2 from-purple-500 to-pink-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Shield size={24} />
                4. Payments & Fees
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Payment Terms
              </h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>
                  All payments are processed securely through our payment
                  partners
                </li>
                <li>
                  Tenants pay the full rental amount plus applicable service
                  fees
                </li>
                <li>
                  Security deposits may be required and will be held in escrow
                </li>
                <li>Payment is due at the time of booking confirmation</li>
                <li>We may charge additional fees for payment processing</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-800 mt-6">
                Refunds & Cancellations
              </h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>
                  Cancellation policies vary by property and are set by hosts
                </li>
                <li>Service fees are generally non-refundable</li>
                <li>Refunds are processed within 5-10 business days</li>
                <li>
                  We reserve the right to cancel bookings for policy violations
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Prohibited Uses */}
          <Card className="shadow-lg border-0 p-0">
            <CardHeader className="bg-gradient-to-r flex items-center p-2 from-red-500 to-pink-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle size={24} />
                5. Prohibited Uses
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <p className="text-gray-700 leading-relaxed">
                You may not use our Service:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>
                  For any unlawful purpose or to solicit others to perform
                  unlawful acts
                </li>
                <li>
                  To violate any international, federal, provincial, or state
                  regulations or laws
                </li>
                <li>
                  To infringe upon or violate our intellectual property rights
                  or the intellectual property rights of others
                </li>
                <li>
                  To harass, abuse, insult, harm, defame, slander, disparage,
                  intimidate, or discriminate
                </li>
                <li>To submit false or misleading information</li>
                <li>
                  To upload or transmit viruses or any other type of malicious
                  code
                </li>
                <li>
                  To spam, phish, pharm, pretext, spider, crawl, or scrape
                </li>
                <li>For any obscene or immoral purpose</li>
                <li>
                  To interfere with or circumvent the security features of the
                  Service
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Intellectual Property */}
          <Card className="shadow-lg border-0 p-0">
            <CardHeader className="bg-gradient-to-r flex items-center p-2 from-indigo-500 to-blue-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <FileText size={24} />
                6. Intellectual Property Rights
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <p className="text-gray-700 leading-relaxed">
                The Service and its original content, features, and
                functionality are and will remain the exclusive property of Nest
                Technologies Private Limited and its licensors. The Service is
                protected by copyright, trademark, and other laws.
              </p>
              <p className="text-gray-700 leading-relaxed">
                You may not use our trademarks, service marks, or copyrighted
                material without our prior written consent. User-generated
                content remains the property of the user, but you grant us a
                license to use such content in connection with the Service.
              </p>
            </CardContent>
          </Card>

          {/* Limitation of Liability */}
          <Card className="shadow-lg border-0 p-0">
            <CardHeader className="bg-gradient-to-r flex items-center p-2 from-gray-700 to-gray-900 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Text size={24} />
                7. Limitation of Liability
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <p className="text-gray-700 leading-relaxed">
                In no event shall Nest Technologies Private Limited, its
                directors, employees, partners, agents, suppliers, or affiliates
                be liable for any indirect, incidental, special, consequential,
                or punitive damages, including loss of profits, data, use, or
                goodwill, arising from your use of the Service.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Our total liability to you for all claims arising from the use
                of the Service shall not exceed the amount you paid to us in the
                12 months preceding the claim.
              </p>
            </CardContent>
          </Card>

          {/* Termination */}
          <Card className="shadow-lg border-0 p-0">
            <CardHeader className="bg-gradient-to-r flex items-center p-2 from-red-600 to-pink-700 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Lock size={24} />
                8. Termination
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <p className="text-gray-700 leading-relaxed">
                We may terminate or suspend your account and access to the
                Service immediately, without prior notice or liability, for any
                reason, including breach of these Terms. Upon termination, your
                right to use the Service will cease immediately.
              </p>
              <p className="text-gray-700 leading-relaxed">
                You may also terminate your account at any time by contacting
                us. However, you remain liable for all charges incurred prior to
                termination.
              </p>
            </CardContent>
          </Card>

          {/* Changes to Terms */}
          <Card className="shadow-lg border-0 p-0">
            <CardHeader className="bg-gradient-to-r flex items-center p-2 from-teal-500 to-green-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Text size={24} />
                9. Changes to Terms
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <p className="text-gray-700 leading-relaxed">
                We reserve the right to modify these Terms at any time. If we
                make material changes, we will notify you by email or by posting
                a notice on our Service prior to the effective date of the
                changes.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Your continued use of the Service after the effective date of
                the revised Terms constitutes acceptance of the changes.
              </p>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="shadow-lg border-0 p-0">
            <CardHeader className="bg-gradient-to-r flex items-center p-2 from-blue-600 to-purple-700 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Text size={24} />
                10. Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <p className="text-gray-700 leading-relaxed">
                If you have any questions about these Terms of Service, please
                contact us:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="space-y-2 text-gray-700">
                  <p>
                    <strong>Nest Technologies Private Limited</strong>
                  </p>
                  <p>Email: legal@nest.com</p>
                  <p>Phone: +91-800-123-4567</p>
                  <p>
                    Address: 123 Tech Park, Bangalore, Karnataka 560001, India
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
