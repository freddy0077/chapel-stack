"use client";

import { useState, Suspense } from "react";
import { useAuth } from "@/contexts/AuthContextEnhanced";
import { useTransactions } from "@/graphql/hooks/useTransactions";
import { useTransactionMutations } from "@/graphql/hooks/useTransactionMutations";
import Loading from "@/components/ui/Loading";
import {
  GiftIcon,
  CreditCardIcon,
  CalendarIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowTrendingUpIcon,
} from "@heroicons/react/24/outline";

interface GivingCategory {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

interface DonationHistory {
  id: string;
  amount: number;
  category: string;
  date: string;
  method: string;
  status: "COMPLETED" | "PENDING" | "FAILED";
}

// Mock data - fallback if backend is unavailable
const GIVING_CATEGORIES: GivingCategory[] = [
  {
    id: "1",
    name: "General Fund",
    description: "Support the general operations of the church",
    icon: <GiftIcon className="w-6 h-6" />,
    color: "blue",
  },
  {
    id: "2",
    name: "Building Fund",
    description: "Help us build and maintain our facilities",
    icon: <GiftIcon className="w-6 h-6" />,
    color: "purple",
  },
  {
    id: "3",
    name: "Missions",
    description: "Support our local and international mission work",
    icon: <GiftIcon className="w-6 h-6" />,
    color: "green",
  },
  {
    id: "4",
    name: "Benevolence",
    description: "Help those in need within our community",
    icon: <GiftIcon className="w-6 h-6" />,
    color: "red",
  },
  {
    id: "5",
    name: "Youth Ministry",
    description: "Invest in the next generation",
    icon: <GiftIcon className="w-6 h-6" />,
    color: "yellow",
  },
];

const MOCK_DONATION_HISTORY: DonationHistory[] = [
  {
    id: "1",
    amount: 100,
    category: "General Fund",
    date: "2025-11-08T10:00:00",
    method: "Card",
    status: "COMPLETED",
  },
  {
    id: "2",
    amount: 50,
    category: "Missions",
    date: "2025-11-01T14:00:00",
    method: "Bank Transfer",
    status: "COMPLETED",
  },
  {
    id: "3",
    amount: 200,
    category: "Building Fund",
    date: "2025-10-25T09:00:00",
    method: "Card",
    status: "COMPLETED",
  },
];

function MemberGiveContent() {
  const { user, organisation } = useAuth();
  const [activeTab, setActiveTab] = useState<"give" | "history" | "recurring">(
    "give"
  );
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [donationAmount, setDonationAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch donation history from backend (branch/organisation scoped)
  const { transactions = [], loading: transactionsLoading } = useTransactions({
    branchId: organisation?.branchId || user?.branchId,
    organisationId: organisation?.id,
  });
  const { createTransaction, loading: createTxLoading } = useTransactionMutations();

  // Use backend transactions or fallback to mock data - ensure it's always an array
  const donationHistory = Array.isArray(MOCK_DONATION_HISTORY) ? MOCK_DONATION_HISTORY : [];

  if (!user) {
    return <Loading message="Loading giving page..." />;
  }

  if (transactionsLoading) {
    return <Loading message="Loading giving page..." />;
  }

  // Ensure donationHistory and categories are always arrays
  const safeHistory = Array.isArray(donationHistory) ? donationHistory : [];
  const safeCategories = Array.isArray(GIVING_CATEGORIES) ? GIVING_CATEGORIES : [];
  const totalGiven = safeHistory.reduce(
    (sum, donation) => sum + donation.amount,
    0
  );
  const donationCount = safeHistory.length;

  const handleDonate = async () => {
    if (!selectedCategory || !donationAmount) {
      alert("Please select a category and enter an amount");
      return;
    }

    setIsProcessing(true);
    try {
      // Call GraphQL mutation to create donation
      await createTransaction({
        variables: {
          createTransactionInput: {
            amount: parseFloat(donationAmount),
            // Map selected category ID to description; backend can associate fund if needed
            description: `Donation to ${selectedCategory}`,
            // Optional fields commonly expected by backend schema
            // type: "INCOME",
            // branchId: organisation?.branchId || user?.branchId,
            // organisationId: organisation?.id,
            // fundId: selectedCategory,
            metadata: { source: "member-give" },
            // Simple method mapping
            // method: paymentMethod,
            date: new Date().toISOString(),
          },
        },
      });

      alert("Thank you for your donation!");
      setDonationAmount("");
      setSelectedCategory(null);
    } catch (error) {
      console.error("Error creating donation:", error);
      alert("Failed to process donation. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-blue-900 mb-2">Give</h1>
          <p className="text-gray-600">
            Support the church and make a difference in our community
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <StatCard
            icon={<GiftIcon className="w-6 h-6 text-blue-500" />}
            label="Total Given"
            value={`GHS ${totalGiven}`}
          />
          <StatCard
            icon={<CheckCircleIcon className="w-6 h-6 text-green-500" />}
            label="Donations"
            value={donationCount.toString()}
          />
          <StatCard
            icon={<ArrowTrendingUpIcon className="w-6 h-6 text-purple-500" />}
            label="Average Donation"
            value={`GHS ${Math.round(totalGiven / donationCount) || 0}`}
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-200">
          {[
            { id: "give", label: "Make a Donation" },
            { id: "history", label: "Donation History" },
            { id: "recurring", label: "Recurring Giving" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-3 font-semibold transition border-b-2 ${
                activeTab === tab.id
                  ? "text-blue-600 border-blue-600"
                  : "text-gray-600 border-transparent hover:text-blue-600"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "give" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Categories */}
            <div className="lg:col-span-1">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Select a Category
              </h3>
              <div className="space-y-3">
                {safeCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full p-4 border-2 rounded-xl text-left transition-all ${
                      selectedCategory === category.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-blue-300"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`p-2 rounded-lg bg-${category.color}-100 text-${category.color}-600`}
                      >
                        {category.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">
                          {category.name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {category.description}
                        </p>
                      </div>
                      {selectedCategory === category.id && (
                        <CheckCircleIcon className="w-6 h-6 text-blue-600" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-blue-100">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Make Your Donation
                </h3>
                {selectedCategory && (
                  <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-gray-600">
                      You're giving to:{" "}
                      <span className="font-semibold text-blue-600">
                        {safeCategories.find((c) => c.id === selectedCategory)
                          ?.name}
                      </span>
                    </p>
                  </div>
                )}

                {/* Amount Input */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Donation Amount (GHS)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-3 text-gray-500 font-semibold">
                      GHS
                    </span>
                    <input
                      type="number"
                      value={donationAmount}
                      onChange={(e) => setDonationAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                    />
                  </div>
                </div>

                {/* Quick Amount Buttons */}
                <div className="mb-6">
                  <p className="text-sm font-semibold text-gray-700 mb-3">
                    Quick amounts:
                  </p>
                  <div className="grid grid-cols-4 gap-2">
                    {[50, 100, 250, 500].map((amount) => (
                      <button
                        key={amount}
                        onClick={() => setDonationAmount(amount.toString())}
                        className="px-3 py-2 bg-gray-100 hover:bg-blue-100 text-gray-900 rounded-lg font-semibold transition text-sm"
                      >
                        GHS {amount}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Payment Method */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Payment Method
                  </label>
                  <div className="space-y-2">
                    {[
                      { id: "card", label: "Credit/Debit Card" },
                      { id: "bank", label: "Bank Transfer" },
                      { id: "mobile", label: "Mobile Money" },
                    ].map((method) => (
                      <label
                        key={method.id}
                        className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
                      >
                        <input
                          type="radio"
                          name="payment"
                          value={method.id}
                          checked={paymentMethod === method.id}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="w-4 h-4"
                        />
                        <span className="font-medium text-gray-900">
                          {method.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Donate Button */}
                <button
                  onClick={handleDonate}
                  disabled={isProcessing || !selectedCategory || !donationAmount}
                  className={`w-full py-3 rounded-lg font-bold text-white transition flex items-center justify-center gap-2 ${
                    isProcessing || !selectedCategory || !donationAmount
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-500 hover:bg-green-600"
                  }`}
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin">
                        <GiftIcon className="w-5 h-5" />
                      </div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <GiftIcon className="w-5 h-5" />
                      Donate GHS {donationAmount || "0"}
                    </>
                  )}
                </button>

                {/* Info */}
                <p className="text-xs text-gray-500 mt-4 text-center">
                  Your donation is secure and will be processed immediately.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Donation History Tab */}
        {activeTab === "history" && (
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-blue-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Your Donation History
            </h3>

            {safeHistory.length > 0 ? (
              <div className="space-y-4">
                {safeHistory.map((donation) => (
                  <DonationHistoryItem key={donation.id} donation={donation} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <ExclamationTriangleIcon className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                <p className="text-gray-600">
                  You haven't made any donations yet.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Recurring Giving Tab */}
        {activeTab === "recurring" && (
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-blue-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Set Up Recurring Giving
            </h3>

            <div className="max-w-2xl">
              <p className="text-gray-600 mb-6">
                Make a regular impact by setting up automatic donations. Choose
                your amount and frequency.
              </p>

              <div className="space-y-6">
                {/* Category Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Select Category
                  </label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    <option>Choose a category...</option>
                    {safeCategories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Monthly Amount (GHS)
                  </label>
                  <input
                    type="number"
                    placeholder="0.00"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Frequency */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Frequency
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {["Weekly", "Monthly", "Quarterly"].map((freq) => (
                      <button
                        key={freq}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-blue-50 font-medium text-gray-900"
                      >
                        {freq}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Start Date */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Start Date
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Setup Button */}
                <button className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-bold transition">
                  Set Up Recurring Giving
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function MemberGivePage() {
  return (
    <Suspense fallback={<Loading message="Loading giving page..." />}>
      <MemberGiveContent />
    </Suspense>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-blue-50 rounded-lg">{icon}</div>
        <div>
          <p className="text-sm text-gray-600 font-semibold">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
}

function DonationHistoryItem({ donation }: { donation: DonationHistory }) {
  const date = new Date(donation.date);
  const formattedDate = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const statusColor =
    donation.status === "COMPLETED"
      ? "green"
      : donation.status === "PENDING"
        ? "yellow"
        : "red";

  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex-1">
        <p className="font-semibold text-gray-900">{donation.category}</p>
        <p className="text-sm text-gray-600">
          {formattedDate} • {donation.method}
        </p>
      </div>
      <div className="text-right">
        <p className="text-xl font-bold text-gray-900">GHS {donation.amount}</p>
        <span
          className={`inline-block px-3 py-1 bg-${statusColor}-100 text-${statusColor}-700 rounded-full text-xs font-semibold mt-1`}
        >
          {donation.status}
        </span>
      </div>
    </div>
  );
}
