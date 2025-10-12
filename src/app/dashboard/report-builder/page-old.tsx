'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useOrganisationBranch } from '@/hooks/useOrganisationBranch';
import {
  ChartBarIcon,
  UsersIcon,
  BanknotesIcon,
  CalendarIcon,
  HeartIcon,
  DocumentTextIcon,
  MapPinIcon,
  UserGroupIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import AttendanceReportBuilder from './components/AttendanceReportBuilder';
import MembershipReportBuilder from './components/MembershipReportBuilder';
import FinanceReportBuilder from './components/FinanceReportBuilder';
import BirthRegisterReportBuilder from './components/BirthRegisterReportBuilder';
import DeathRegisterReportBuilder from './components/DeathRegisterReportBuilder';
import SacramentsReportBuilder from './components/SacramentsReportBuilder';

const reportCategories = [
  {
    id: 'ATTENDANCE',
    name: 'Attendance Reports',
    description: 'Track attendance patterns, growth, and engagement',
    icon: CalendarIcon,
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-50',
    iconColor: 'text-blue-600',
  },
  {
    id: 'MEMBERSHIP',
    name: 'Membership Reports',
    description: 'Analyze member demographics and statistics',
    icon: UsersIcon,
    color: 'from-purple-500 to-purple-600',
    bgColor: 'bg-purple-50',
    iconColor: 'text-purple-600',
  },
  {
    id: 'FINANCE',
    name: 'Finance Reports',
    description: 'Track income, expenses, and financial health',
    icon: BanknotesIcon,
    color: 'from-green-500 to-green-600',
    bgColor: 'bg-green-50',
    iconColor: 'text-green-600',
  },
  {
    id: 'BIRTH_REGISTER',
    name: 'Birth Register',
    description: 'Birth records and statistics',
    icon: HeartIcon,
    color: 'from-pink-500 to-pink-600',
    bgColor: 'bg-pink-50',
    iconColor: 'text-pink-600',
  },
  {
    id: 'DEATH_REGISTER',
    name: 'Death Register',
    description: 'Death records and memorial statistics',
    icon: DocumentTextIcon,
    color: 'from-gray-500 to-gray-600',
    bgColor: 'bg-gray-50',
    iconColor: 'text-gray-600',
  },
  {
    id: 'SACRAMENTS',
    name: 'Sacraments Reports',
    description: 'Baptisms, confirmations, and certificates',
    icon: ChartBarIcon,
    color: 'from-indigo-500 to-indigo-600',
    bgColor: 'bg-indigo-50',
    iconColor: 'text-indigo-600',
  },
  {
    id: 'ZONES',
    name: 'Zones & Communities',
    description: 'Zone statistics and member distribution',
    icon: MapPinIcon,
    color: 'from-orange-500 to-orange-600',
    bgColor: 'bg-orange-50',
    iconColor: 'text-orange-600',
  },
  {
    id: 'GROUPS',
    name: 'Groups & Ministries',
    description: 'Group participation and engagement',
    icon: UserGroupIcon,
    color: 'from-teal-500 to-teal-600',
    bgColor: 'bg-teal-50',
    iconColor: 'text-teal-600',
  },
];

export default function ReportBuilderPage() {
  const { organisationId, branchId } = useOrganisationBranch();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-xl p-8 text-white"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-white/20 backdrop-blur-sm">
                <ChartBarIcon className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">Report Desk</h1>
                <p className="text-blue-100">
                  Build custom reports with dynamic filters and export options
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ClockIcon className="h-5 w-5" />
              <span className="text-sm">Quick Access</span>
            </div>
          </div>
        </motion.div>

        {/* Report Categories Grid */}
        {!selectedCategory ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {reportCategories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card
                  className="cursor-pointer hover:shadow-xl transition-all transform hover:-translate-y-1"
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <CardHeader className={`${category.bgColor} rounded-t-lg`}>
                    <div className="flex items-center justify-between">
                      <div className={`p-3 rounded-xl bg-white shadow-sm`}>
                        <category.icon className={`h-6 w-6 ${category.iconColor}`} />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <CardTitle className="text-lg mb-2">{category.name}</CardTitle>
                    <p className="text-sm text-gray-600">{category.description}</p>
                    <div className="mt-4 flex items-center text-sm text-blue-600 font-medium">
                      <span>Build Report</span>
                      <svg
                        className="w-4 h-4 ml-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <div>
            <button
              onClick={() => setSelectedCategory(null)}
              className="mb-4 flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Categories
            </button>

            {selectedCategory === 'ATTENDANCE' ? (
              <AttendanceReportBuilder />
            ) : selectedCategory === 'MEMBERSHIP' ? (
              <MembershipReportBuilder />
            ) : selectedCategory === 'FINANCE' ? (
              <FinanceReportBuilder />
            ) : selectedCategory === 'BIRTH_REGISTER' ? (
              <BirthRegisterReportBuilder />
            ) : selectedCategory === 'DEATH_REGISTER' ? (
              <DeathRegisterReportBuilder />
            ) : selectedCategory === 'SACRAMENTS' ? (
              <SacramentsReportBuilder />
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>
                    {reportCategories.find((c) => c.id === selectedCategory)?.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Report builder for {selectedCategory} coming soon...
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Saved Templates</p>
                  <p className="text-2xl font-bold">12</p>
                </div>
                <DocumentTextIcon className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Reports This Month</p>
                  <p className="text-2xl font-bold">48</p>
                </div>
                <ChartBarIcon className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Scheduled Reports</p>
                  <p className="text-2xl font-bold">5</p>
                </div>
                <ClockIcon className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
