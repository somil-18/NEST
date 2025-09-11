import React from "react";
import {
  Shield,
  Lock,
  Eye,
  Database,
  Users,
  FileText,
  Globe,
  Settings,
  SatelliteDish,
  EarthIcon,
  FlagTriangleLeft,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { colors } from "@/utils/colors";

export default function Policy() {
  const lastUpdated = "September 1, 2025";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div>
        <div className="max-w-4xl mx-auto px-6 pt-8">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <Shield size={24} className="text-blue-600" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Privacy Policy
              </h1>
              <p className="text-gray-600 mt-1">Last updated: {lastUpdated}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="space-y-8">
          {/* Information Collection */}
          <Card className="shadow-lg border-0 p-0">
            <CardHeader className="bg-gradient-to-r flex items-center p-2 from-green-500 to-blue-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Eye size={24} />
                1. Information We Collect
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <p className="text-gray-700 leading-relaxed">
                At <strong>Nest</strong>, we collect information to provide you
                with the best property rental experience.
              </p>

              <h3 className="text-lg font-semibold text-gray-800 mt-6">
                Personal Information
              </h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>
                  <strong>Account Details:</strong> Name, email address, phone
                  number, date of birth
                </li>
                <li>
                  <strong>Profile Information:</strong> Profile photo, bio,
                  preferences
                </li>
                <li>
                  <strong>Identity Verification:</strong> Government-issued ID,
                  address documents
                </li>
                <li>
                  <strong>Payment Information:</strong> Credit/debit card
                  details, bank information
                </li>
                <li>
                  <strong>Communication Data:</strong> Messages, reviews,
                  support requests
                </li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-800 mt-6">
                Automatically Collected Data
              </h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>
                  <strong>Device Information:</strong> IP address, browser type,
                  device identifiers
                </li>
                <li>
                  <strong>Usage Data:</strong> Pages visited, time spent, search
                  queries
                </li>
                <li>
                  <strong>Location Data:</strong> GPS coordinates, city/country
                  information
                </li>
                <li>
                  <strong>Cookies & Analytics:</strong> Session data,
                  preferences, tracking pixels
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* How We Use Information */}
          <Card className="shadow-lg border-0 p-0">
            <CardHeader className="bg-gradient-to-r flex items-center p-2 from-purple-500 to-pink-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Settings size={24} />
                2. How We Use Your Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Service Provision
              </h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Create and manage your account</li>
                <li>Process bookings and payments</li>
                <li>Facilitate communication between users</li>
                <li>Provide customer support</li>
                <li>Verify identity and prevent fraud</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-800 mt-6">
                Service Improvement
              </h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Analyze usage patterns and trends</li>
                <li>Improve our platform and user experience</li>
                <li>Develop new features and functionality</li>
                <li>Conduct research and surveys</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-800 mt-6">
                Marketing & Communication
              </h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Send promotional emails and notifications</li>
                <li>Personalize content and recommendations</li>
                <li>Inform about new features and services</li>
                <li>Send important updates and policy changes</li>
              </ul>
            </CardContent>
          </Card>

          {/* Information Sharing */}
          <Card className="shadow-lg border-0 p-0">
            <CardHeader className="bg-gradient-to-r flex items-center p-2 from-orange-500 to-red-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Users size={24} />
                3. Information Sharing & Disclosure
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">
                With Other Users
              </h3>
              <p className="text-gray-700 leading-relaxed">
                We share certain information with other users to facilitate
                bookings and communication, including your name, profile photo,
                and property/booking details.
              </p>

              <h3 className="text-lg font-semibold text-gray-800 mt-6">
                With Service Providers
              </h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>
                  <strong>Payment Processors:</strong> For secure payment
                  processing
                </li>
                <li>
                  <strong>Cloud Storage:</strong> For data hosting and backup
                </li>
                <li>
                  <strong>Analytics Services:</strong> For usage analysis and
                  insights
                </li>
                <li>
                  <strong>Customer Support:</strong> For providing user
                  assistance
                </li>
                <li>
                  <strong>Marketing Partners:</strong> For advertising and
                  promotions
                </li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-800 mt-6">
                Legal Requirements
              </h3>
              <p className="text-gray-700 leading-relaxed">
                We may disclose your information when required by law, legal
                process, or to protect our rights, property, or safety.
              </p>
            </CardContent>
          </Card>

          {/* Data Security */}
          <Card className="shadow-lg border-0 p-0">
            <CardHeader className="bg-gradient-to-r flex items-center p-2 from-blue-500 to-indigo-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Lock size={24} />
                4. Data Security
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <p className="text-gray-700 leading-relaxed">
                We implement appropriate security measures to protect your
                personal information against unauthorized access, alteration,
                disclosure, or destruction.
              </p>

              <h3 className="text-lg font-semibold text-gray-800 mt-4">
                Security Measures
              </h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>SSL encryption for data transmission</li>
                <li>Regular security audits and monitoring</li>
                <li>Access controls and authentication</li>
                <li>Data backup and recovery procedures</li>
                <li>Employee training on data protection</li>
              </ul>

              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <p className="text-blue-800 text-sm">
                  <strong>Important:</strong> While we implement strong security
                  measures, no method of transmission over the internet is 100%
                  secure.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Data Retention */}
          <Card className="shadow-lg border-0 p-0">
            <CardHeader className="bg-gradient-to-r flex items-center p-2 from-teal-500 to-green-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Database size={24} />
                5. Data Retention
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <p className="text-gray-700 leading-relaxed">
                We retain your personal information for as long as necessary to
                provide our services and comply with legal obligations.
              </p>

              <h3 className="text-lg font-semibold text-gray-800 mt-4">
                Retention Periods
              </h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>
                  <strong>Account Data:</strong> Until account deletion or 7
                  years after last activity
                </li>
                <li>
                  <strong>Transaction Data:</strong> 7 years for tax and legal
                  compliance
                </li>
                <li>
                  <strong>Communication Data:</strong> 3 years after last
                  communication
                </li>
                <li>
                  <strong>Marketing Data:</strong> Until you unsubscribe or
                  object
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Your Rights */}
          <Card className="shadow-lg border-0 p-0">
            <CardHeader className="bg-gradient-to-r flex items-center p-2 from-purple-600 to-pink-700 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <FileText size={24} />
                6. Your Data Rights
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <p className="text-gray-700 leading-relaxed">
                You have certain rights regarding your personal information:
              </p>

              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>
                  <strong>Access:</strong> Request access to your personal
                  information
                </li>
                <li>
                  <strong>Correction:</strong> Request correction of inaccurate
                  information
                </li>
                <li>
                  <strong>Deletion:</strong> Request deletion of your personal
                  information
                </li>
                <li>
                  <strong>Portability:</strong> Request transfer of your data in
                  a portable format
                </li>
                <li>
                  <strong>Restriction:</strong> Request restriction of
                  processing activities
                </li>
                <li>
                  <strong>Objection:</strong> Object to certain processing
                  activities
                </li>
                <li>
                  <strong>Withdrawal:</strong> Withdraw consent where processing
                  is based on consent
                </li>
              </ul>

              <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded">
                <p className="text-purple-800 text-sm">
                  <strong>To exercise your rights:</strong> Contact us at
                  privacy@nest.com. We will respond within 30 days.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* International Transfers */}
          <Card className="shadow-lg border-0 p-0">
            <CardHeader className="bg-gradient-to-r flex items-center p-2 from-indigo-500 to-purple-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Globe size={24} />
                7. International Data Transfers
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <p className="text-gray-700 leading-relaxed">
                Your information may be transferred to and processed in
                countries other than your own. We ensure appropriate safeguards
                are in place.
              </p>
            </CardContent>
          </Card>

          {/* Children's Privacy */}
          <Card className="shadow-lg border-0 p-0">
            <CardHeader className="bg-gradient-to-r flex items-center p-2 from-pink-500 to-red-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <FlagTriangleLeft size={24} />
                8. Children&apos;s Privacy
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <p className="text-gray-700 leading-relaxed">
                Our Service is not intended for individuals under 18. We do not
                knowingly collect personal information from children under 18.
              </p>
            </CardContent>
          </Card>

          {/* Changes to Privacy Policy */}
          <Card className="shadow-lg border-0 p-0">
            <CardHeader className="bg-gradient-to-r flex items-center p-2 from-gray-600 to-gray-800 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <EarthIcon size={24} />
                9. Changes to This Policy
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <p className="text-gray-700 leading-relaxed">
                We may update this Privacy Policy from time to time. We will
                notify you of any material changes by posting the new policy on
                this page.
              </p>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="shadow-lg border-0 p-0">
            <CardHeader className="bg-gradient-to-r flex items-center p-2 from-blue-600 to-purple-700 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <SatelliteDish size={24} />
                10. Contact Us
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <p className="text-gray-700 leading-relaxed">
                For questions about this Privacy Policy, please contact us:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="space-y-2 text-gray-700">
                  <p>
                    <strong>Data Protection Officer</strong>
                  </p>
                  <p>Email: privacy@nest.com</p>
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
