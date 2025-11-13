"use client";

import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContextEnhanced";
import { useOrganisationBranch } from "@/hooks/useOrganisationBranch";
import { motion } from "framer-motion";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  WalletIcon,
  ChartBarIcon,
  BanknotesIcon,
  DocumentTextIcon,
  Cog6ToothIcon,
  BuildingLibraryIcon,
  SparklesIcon,
  CubeIcon,
} from "@heroicons/react/24/outline";

// Import new accounting components
import FinanceDashboard from "@/components/finance/accounting/FinanceDashboard";
import ChartOfAccounts from "@/components/finance/accounting/ChartOfAccounts";
import JournalEntries from "@/components/finance/accounting/JournalEntries";
import OfferingManagement from "@/components/finance/accounting/OfferingManagement";
import FinancialReports from "@/components/finance/accounting/FinancialReports";
import FiscalPeriods from "@/components/finance/accounting/FiscalPeriods";
import BankAccounts from "@/components/finance/accounting/BankAccounts";
import AssetManagement from "@/components/finance/accounting/AssetManagement";

// Import modals
import OfferingCounterModal from "@/components/finance/accounting/modals/OfferingCounterModal";
import CreateJournalEntryModal from "@/components/finance/accounting/modals/CreateJournalEntryModal";
import BankReconciliationModal from "@/components/finance/accounting/modals/BankReconciliationModal";

/**
 * Branch Finances Page - Comprehensive Accounting Module
 * 
 * This is the main finance page with full double-entry accounting system
 * Features:
 * - Dashboard with KPIs
 * - Chart of Accounts
 * - Journal Entries
 * - Offering Management
 * - Bank Accounts & Reconciliation
 * - Asset Management (Fixed Assets)
 * - Financial Reports
 * - Fiscal Period Management
 */
export default function BranchFinancesPage() {
  const { state } = useAuth();
  const user = state.user;
  const { organisationId, branchId } = useOrganisationBranch();
  
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isOfferingCounterOpen, setIsOfferingCounterOpen] = useState(false);
  const [isJournalEntryOpen, setIsJournalEntryOpen] = useState(false);
  const [isReconciliationOpen, setIsReconciliationOpen] = useState(false);
  const [selectedBankAccount, setSelectedBankAccount] = useState<{id: string; name: string} | null>(null);

  if (!organisationId || !branchId) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Loading organization data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50 to-emerald-50">
      {/* Modern Hero Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 p-8 md:p-12 text-white shadow-2xl"
      >
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -left-10 -bottom-10 w-60 h-60 bg-white/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 container mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
              <WalletIcon className="h-8 w-8" />
            </div>
            <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30">
              <SparklesIcon className="h-3 w-3 mr-1" />
              Double-Entry Accounting
            </Badge>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            Finance Management
          </h1>
          <p className="text-lg md:text-xl text-green-100 max-w-2xl">
            Comprehensive financial management with bank reconciliation, 
            journal entries, and real-time reporting
          </p>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          {/* Modern Navigation Tabs */}
          <div className="bg-white/60 backdrop-blur-lg rounded-2xl p-2 shadow-xl border border-white/20">
            <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 gap-2 bg-transparent">
              <TabsTrigger 
                value="dashboard"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl transition-all duration-300"
              >
                <ChartBarIcon className="h-4 w-4 mr-2" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger 
                value="offerings"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl transition-all duration-300"
              >
                Offerings
              </TabsTrigger>
              <TabsTrigger 
                value="accounts"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl transition-all duration-300"
              >
                Accounts
              </TabsTrigger>
              <TabsTrigger 
                value="journal"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl transition-all duration-300"
              >
                Journal
              </TabsTrigger>
              <TabsTrigger 
                value="bank"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl transition-all duration-300"
              >
                <BuildingLibraryIcon className="h-4 w-4 mr-2" />
                Bank
              </TabsTrigger>
              <TabsTrigger 
                value="assets"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl transition-all duration-300"
              >
                <CubeIcon className="h-4 w-4 mr-2" />
                Assets
              </TabsTrigger>
              <TabsTrigger 
                value="reports"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-500 data-[state=active]:to-green-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl transition-all duration-300"
              >
                <DocumentTextIcon className="h-4 w-4 mr-2" />
                Reports
              </TabsTrigger>
              <TabsTrigger 
                value="settings"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-gray-500 data-[state=active]:to-slate-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl transition-all duration-300"
              >
                <Cog6ToothIcon className="h-4 w-4 mr-2" />
                Settings
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <FinanceDashboard
              organisationId={organisationId}
              branchId={branchId}
              userId={user?.id || ""}
              onNavigateToTab={setActiveTab}
              onOpenOfferingCounter={() => setIsOfferingCounterOpen(true)}
              onOpenJournalEntry={() => setIsJournalEntryOpen(true)}
            />
          </TabsContent>

          {/* Offerings Tab */}
          <TabsContent value="offerings" className="space-y-6">
            <OfferingManagement
              organisationId={organisationId}
              branchId={branchId}
              userId={user?.id || ""}
            />
          </TabsContent>

          {/* Chart of Accounts Tab */}
          <TabsContent value="accounts" className="space-y-6">
            <ChartOfAccounts
              organisationId={organisationId}
              branchId={branchId}
              userId={user?.id || ""}
            />
          </TabsContent>

          {/* Journal Entries Tab */}
          <TabsContent value="journal" className="space-y-6">
            <JournalEntries
              organisationId={organisationId}
              branchId={branchId}
              userId={user?.id || ""}
            />
          </TabsContent>

          {/* Bank Accounts Tab */}
          <TabsContent value="bank" className="space-y-6">
            <BankAccounts
              organisationId={organisationId}
              branchId={branchId}
              userId={user?.id || ""}
              onOpenReconciliation={(accountId) => {
                setSelectedBankAccount({ id: accountId, name: "Bank Account" });
                setIsReconciliationOpen(true);
              }}
            />
          </TabsContent>

          {/* Assets Tab */}
          <TabsContent value="assets" className="space-y-6">
            <AssetManagement
              organisationId={organisationId}
              branchId={branchId}
              userId={user?.id || ""}
              onNavigateToJournal={() => setActiveTab('journal')}
            />
          </TabsContent>

          {/* Financial Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <FinancialReports
              organisationId={organisationId}
              branchId={branchId}
            />
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <FiscalPeriods
              organisationId={organisationId}
              branchId={branchId}
              userId={user?.id || ""}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Global Modals */}
      <OfferingCounterModal
        open={isOfferingCounterOpen}
        onClose={() => setIsOfferingCounterOpen(false)}
        organisationId={organisationId}
        branchId={branchId}
        userId={user?.id || ""}
      />

      <CreateJournalEntryModal
        open={isJournalEntryOpen}
        onClose={() => setIsJournalEntryOpen(false)}
        organisationId={organisationId}
        branchId={branchId}
        userId={user?.id || ""}
      />

      {selectedBankAccount && (
        <BankReconciliationModal
          open={isReconciliationOpen}
          onClose={() => {
            setIsReconciliationOpen(false);
            setSelectedBankAccount(null);
          }}
          accountId={selectedBankAccount.id}
          accountName={selectedBankAccount.name}
          userId={user?.id || ""}
          onSuccess={() => {
            // TODO: Refetch bank accounts
            console.log("Reconciliation saved successfully");
          }}
        />
      )}
    </div>
  );
}
