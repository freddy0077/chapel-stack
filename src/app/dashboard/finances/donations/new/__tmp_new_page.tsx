"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  CurrencyDollarIcon,
  UserIcon,
  TagIcon,
  ArrowLeftIcon,
  CheckCircleIcon
} from "@heroicons/react/24/outline";

const donorTypes = ["Individual", "Organization", "Anonymous"];
const donationCategories = [
  "General Fund",
  "Building Fund",
  "Missions",
  "Youth Ministry",
  "Children's Ministry",
  "Community Outreach",
  "Benevolence",
  "Staff Support",
  "Worship Ministry",
  "Special Events",
  "Media & Technology",
  "Education & Discipleship"
];
const paymentMethods = [
  "Cash",
  "Check",
  "Credit Card",
  "Bank Transfer",
  "Mobile Payment",
  "Online Giving Platform",
  "Text-to-Give"
];

export default function NewDonation() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [donationData, setDonationData] = useState({
    donorName: "",
    donorEmail: "",
    donorPhone: "",
    donorType: "Individual",
    amount: "",
    category: "General Fund",
    paymentMethod: "Online Giving Platform",
    date: new Date().toISOString().split('T')[0],
    recurring: false,
    frequency: "monthly",
    anonymous: false,
    notes: "",
    taxDeductible: true
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setDonationData(prev => ({ ...prev, [name]: checked }));
    } else {
      setDonationData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setShowSuccess(true);
      setTimeout(() => {
        router.push('/dashboard/finances');
      }, 2000);
    } catch (error) {
      console.error('Error submitting donation:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
            <CheckCircleIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
          </div>
          <h2 className="mt-3 text-lg font-medium text-gray-900">Donation Recorded Successfully!</h2>
          <p className="mt-2 text-sm text-gray-500">
            Thank you for recording this donation. It has been added to the system.
          </p>
          <div className="mt-5">
            <button
              type="button"
              onClick={() => router.push('/dashboard/finances')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Return to Finance Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-3xl mx-auto">
      {/* Sticky header with navigation */}
      <div className="mb-8 sticky top-0 z-10 bg-gradient-to-br from-indigo-50 to-white/80 backdrop-blur border-b border-indigo-100 py-4 px-2 flex items-center gap-2 shadow-sm">
        <Link href="/dashboard/finances" className="mr-2 rounded-md bg-white p-1 text-gray-400 hover:text-gray-500">
          <ArrowLeftIcon className="h-5 w-5" aria-hidden="true" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Record New Donation</h1>
      </div>
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <form onSubmit={handleSubmit}>
          {/* Donation Details Card */}
          <div className="px-6 py-8 grid grid-cols-1 gap-y-8 gap-x-8 sm:grid-cols-2">
            <div className="col-span-2 bg-gradient-to-br from-indigo-50 to-white rounded-xl p-6 shadow-sm border border-indigo-100 mb-6">
              <h3 className="text-xl font-semibold text-indigo-900 mb-2 flex items-center gap-2">
                <CurrencyDollarIcon className="w-5 h-5 text-indigo-400" aria-hidden="true" />
                Donation Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div>
                  <label htmlFor="amount" className="block text-sm font-medium text-indigo-800 mb-1">Amount <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    name="amount"
                    id="amount"
                    min="0.01"
                    step="0.01"
                    required
                    value={donationData.amount}
                    onChange={handleInputChange}
                    className="block w-full rounded-lg border border-indigo-200 bg-white px-4 py-3 text-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-indigo-800 mb-1">Date Received <span className="text-red-500">*</span></label>
                  <input
                    type="date"
                    name="date"
                    id="date"
                    required
                    value={donationData.date}
                    onChange={handleInputChange}
                    className="block w-full rounded-lg border border-indigo-200 bg-white px-4 py-3 text-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                  />
                </div>
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-indigo-800 mb-1">Category <span className="text-red-500">*</span></label>
                  <select
                    id="category"
                    name="category"
                    required
                    value={donationData.category}
                    onChange={handleInputChange}
                    className="block w-full rounded-lg border border-indigo-200 bg-white px-4 py-3 text-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                  >
                    {donationCategories.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="paymentMethod" className="block text-sm font-medium text-indigo-800 mb-1">Payment Method <span className="text-red-500">*</span></label>
                  <select
                    id="paymentMethod"
                    name="paymentMethod"
                    required
                    value={donationData.paymentMethod}
                    onChange={handleInputChange}
                    className="block w-full rounded-lg border border-indigo-200 bg-white px-4 py-3 text-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                  >
                    {paymentMethods.map((method) => (
                      <option key={method} value={method}>{method}</option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2 flex items-center mt-2">
                  <input
                    id="recurring"
                    name="recurring"
                    type="checkbox"
                    checked={donationData.recurring}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 mr-2"
                  />
                  <label htmlFor="recurring" className="font-medium text-gray-700">
                    This is a recurring donation
                  </label>
                  <span className="ml-2 text-gray-500 text-sm">Check if the donor has set up a recurring giving plan.</span>
                </div>
                {donationData.recurring && (
                  <div className="md:col-span-2">
                    <label htmlFor="frequency" className="block text-sm font-medium text-indigo-800 mb-1">Frequency</label>
                    <select
                      id="frequency"
                      name="frequency"
                      value={donationData.frequency}
                      onChange={handleInputChange}
                      className="block w-full rounded-lg border border-indigo-200 bg-white px-4 py-3 text-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                    >
                      <option value="weekly">Weekly</option>
                      <option value="biweekly">Bi-weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="quarterly">Quarterly</option>
                      <option value="annually">Annually</option>
                    </select>
                  </div>
                )}
              </div>
            </div>
            {/* Donor Information Card */}
            <div className="col-span-2 bg-gradient-to-br from-indigo-50 to-white rounded-xl p-6 shadow-sm border border-indigo-100 mb-6">
              <h3 className="text-xl font-semibold text-indigo-900 mb-2 flex items-center gap-2">
                <UserIcon className="w-5 h-5 text-indigo-400" aria-hidden="true" />
                Donor Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div className="md:col-span-2 flex items-center mb-2">
                  <input
                    id="anonymous"
                    name="anonymous"
                    type="checkbox"
                    checked={donationData.anonymous}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 mr-2"
                  />
                  <label htmlFor="anonymous" className="font-medium text-gray-700">
                    Anonymous Donation
                  </label>
                  <span className="ml-2 text-gray-500 text-sm">Check if the donor wishes to remain anonymous.</span>
                </div>
                {!donationData.anonymous && (
                  <>
                    <div>
                      <label htmlFor="donorType" className="block text-sm font-medium text-indigo-800 mb-1">Donor Type <span className="text-red-500">*</span></label>
                      <select
                        id="donorType"
                        name="donorType"
                        required
                        value={donationData.donorType}
                        onChange={handleInputChange}
                        className="block w-full rounded-lg border border-indigo-200 bg-white px-4 py-3 text-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                      >
                        {donorTypes.map((type) => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="donorName" className="block text-sm font-medium text-indigo-800 mb-1">{donationData.donorType === "Organization" ? "Organization Name" : "Donor Name"} <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        name="donorName"
                        id="donorName"
                        required
                        value={donationData.donorName}
                        onChange={handleInputChange}
                        className="block w-full rounded-lg border border-indigo-200 bg-white px-4 py-3 text-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                      />
                    </div>
                    <div>
                      <label htmlFor="donorEmail" className="block text-sm font-medium text-indigo-800 mb-1">Email</label>
                      <input
                        type="email"
                        name="donorEmail"
                        id="donorEmail"
                        value={donationData.donorEmail}
                        onChange={handleInputChange}
                        className="block w-full rounded-lg border border-indigo-200 bg-white px-4 py-3 text-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                      />
                    </div>
                    <div>
                      <label htmlFor="donorPhone" className="block text-sm font-medium text-indigo-800 mb-1">Phone</label>
                      <input
                        type="tel"
                        name="donorPhone"
                        id="donorPhone"
                        value={donationData.donorPhone}
                        onChange={handleInputChange}
                        className="block w-full rounded-lg border border-indigo-200 bg-white px-4 py-3 text-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
            {/* Additional Information Card */}
            <div className="col-span-2 bg-gradient-to-br from-indigo-50 to-white rounded-xl p-6 shadow-sm border border-indigo-100">
              <h3 className="text-xl font-semibold text-indigo-900 mb-2 flex items-center gap-2">
                <TagIcon className="w-5 h-5 text-indigo-400" aria-hidden="true" />
                Additional Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div className="md:col-span-2">
                  <label htmlFor="notes" className="block text-sm font-medium text-indigo-800 mb-1">Notes</label>
                  <textarea
                    id="notes"
                    name="notes"
                    rows={3}
                    value={donationData.notes}
                    onChange={handleInputChange}
                    className="block w-full rounded-lg border border-indigo-200 bg-white px-4 py-3 text-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                    placeholder="Any special instructions or notes about this donation"
                  />
                </div>
                <div className="md:col-span-2 flex items-center mt-2">
                  <input
                    id="taxDeductible"
                    name="taxDeductible"
                    type="checkbox"
                    checked={donationData.taxDeductible}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 mr-2"
                  />
                  <label htmlFor="taxDeductible" className="font-medium text-gray-700">
                    Tax Deductible
                  </label>
                  <span className="ml-2 text-gray-500 text-sm">Check if this donation is eligible for a tax deduction receipt.</span>
                </div>
              </div>
            </div>
          </div>
          <div className="px-4 py-3 bg-gray-50 text-right sm:px-6 flex justify-end space-x-3">
            <Link
              href="/dashboard/finances"
              className="inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                "Record Donation"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
