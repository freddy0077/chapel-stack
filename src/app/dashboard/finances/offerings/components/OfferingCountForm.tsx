"use client";

import { useState } from "react";
import { 
  CurrencyDollarIcon,
  BuildingOfficeIcon,
  CalendarIcon
} from "@heroicons/react/24/outline";

// Types
interface OfferingCount {
  id: string;
  branchId: string;
  dateCollected: string;
  serviceType: string;
  cashAmount: number;
  checkAmount: number;
  electronicAmount: number;
  otherAmount: number;
  totalAmount: number;
  countedBy: string[];
  verifiedBy?: string;
  notes?: string;
}

interface Branch {
  id: string;
  name: string;
}

interface OfferingCountFormProps {
  branches: Branch[];
  onSubmit: (data: Omit<OfferingCount, "id" | "totalAmount">) => void;
  isProcessing: boolean;
}

// Component
const OfferingCountForm: React.FC<OfferingCountFormProps> = ({
  branches,
  onSubmit,
  isProcessing
}) => {
  const [formData, setFormData] = useState({
    branchId: "",
    dateCollected: new Date().toISOString().split("T")[0],
    serviceType: "",
    cashAmount: 0,
    checkAmount: 0,
    electronicAmount: 0,
    otherAmount: 0,
    countedBy: [""],
    verifiedBy: "",
    notes: ""
  });
  
  // Calculate total
  const totalAmount = 
    Number(formData.cashAmount || 0) + 
    Number(formData.checkAmount || 0) + 
    Number(formData.electronicAmount || 0) + 
    Number(formData.otherAmount || 0);
  
  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Handle counter name changes
  const handleCounterChange = (index: number, value: string) => {
    const newCounters = [...formData.countedBy];
    newCounters[index] = value;
    setFormData({
      ...formData,
      countedBy: newCounters
    });
  };
  
  // Add another counter
  const addCounter = () => {
    setFormData({
      ...formData,
      countedBy: [...formData.countedBy, ""]
    });
  };
  
  // Remove counter
  const removeCounter = (index: number) => {
    const newCounters = [...formData.countedBy];
    newCounters.splice(index, 1);
    setFormData({
      ...formData,
      countedBy: newCounters
    });
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Remove empty counter names
    const validCounters = formData.countedBy.filter(counter => counter.trim() !== "");
    onSubmit({
      ...formData,
      countedBy: validCounters
    });
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">New Offering Count</h3>
          <p className="mt-1 text-sm text-gray-500">Record offering details including cash, checks, and electronic giving.</p>
          
          <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            {/* Branch Select */}
            <div className="sm:col-span-3">
              <label htmlFor="branchId" className="block text-sm font-medium text-gray-700">
                Branch
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm">
                  <BuildingOfficeIcon className="h-4 w-4" />
                </span>
                <select
                  id="branchId"
                  name="branchId"
                  required
                  value={formData.branchId}
                  onChange={handleChange}
                  className="block w-full rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="">Select Branch</option>
                  {branches.map((branch) => (
                    <option key={branch.id} value={branch.id}>
                      {branch.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Date Collected */}
            <div className="sm:col-span-3">
              <label htmlFor="dateCollected" className="block text-sm font-medium text-gray-700">
                Date Collected
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm">
                  <CalendarIcon className="h-4 w-4" />
                </span>
                <input
                  type="date"
                  name="dateCollected"
                  id="dateCollected"
                  required
                  value={formData.dateCollected}
                  onChange={handleChange}
                  className="block w-full rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>
            
            {/* Service Type */}
            <div className="sm:col-span-3">
              <label htmlFor="serviceType" className="block text-sm font-medium text-gray-700">
                Service/Event Type
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="serviceType"
                  id="serviceType"
                  required
                  placeholder="e.g. Sunday Morning, Youth Event, etc."
                  value={formData.serviceType}
                  onChange={handleChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>
            
            <div className="sm:col-span-6">
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-4">
                {/* Cash Amount */}
                <div>
                  <label htmlFor="cashAmount" className="block text-sm font-medium text-gray-700">
                    Cash
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      name="cashAmount"
                      id="cashAmount"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.cashAmount || ""}
                      onChange={handleChange}
                      className="block w-full rounded-md border-gray-300 pl-7 pr-12 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                      <span className="text-gray-500 sm:text-sm">USD</span>
                    </div>
                  </div>
                </div>
                
                {/* Check Amount */}
                <div>
                  <label htmlFor="checkAmount" className="block text-sm font-medium text-gray-700">
                    Checks
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      name="checkAmount"
                      id="checkAmount"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.checkAmount || ""}
                      onChange={handleChange}
                      className="block w-full rounded-md border-gray-300 pl-7 pr-12 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                      <span className="text-gray-500 sm:text-sm">USD</span>
                    </div>
                  </div>
                </div>
                
                {/* Electronic Amount */}
                <div>
                  <label htmlFor="electronicAmount" className="block text-sm font-medium text-gray-700">
                    Electronic
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      name="electronicAmount"
                      id="electronicAmount"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.electronicAmount || ""}
                      onChange={handleChange}
                      className="block w-full rounded-md border-gray-300 pl-7 pr-12 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                      <span className="text-gray-500 sm:text-sm">USD</span>
                    </div>
                  </div>
                </div>
                
                {/* Other Amount */}
                <div>
                  <label htmlFor="otherAmount" className="block text-sm font-medium text-gray-700">
                    Other
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      name="otherAmount"
                      id="otherAmount"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.otherAmount || ""}
                      onChange={handleChange}
                      className="block w-full rounded-md border-gray-300 pl-7 pr-12 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                      <span className="text-gray-500 sm:text-sm">USD</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Total */}
            <div className="sm:col-span-3">
              <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-500">Total Amount:</span>
                  <span className="text-lg font-semibold text-gray-900">
                    ${totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Counted By */}
            <div className="sm:col-span-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Counted By (at least two people)
              </label>
              
              {formData.countedBy.map((counter, index) => (
                <div key={index} className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    value={counter}
                    onChange={(e) => handleCounterChange(index, e.target.value)}
                    placeholder={`Counter ${index + 1} Name`}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required={index < 2} // At least 2 counters required
                  />
                  
                  {formData.countedBy.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeCounter(index)}
                      className="inline-flex items-center rounded border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              
              <button
                type="button"
                onClick={addCounter}
                className="mt-2 inline-flex items-center rounded border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Add Counter
              </button>
            </div>
            
            {/* Verified By */}
            <div className="sm:col-span-3">
              <label htmlFor="verifiedBy" className="block text-sm font-medium text-gray-700">
                Verified By (optional)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="verifiedBy"
                  id="verifiedBy"
                  placeholder="Name of verifier"
                  value={formData.verifiedBy}
                  onChange={handleChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>
            
            {/* Notes */}
            <div className="sm:col-span-6">
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                Notes (optional)
              </label>
              <div className="mt-1">
                <textarea
                  id="notes"
                  name="notes"
                  rows={3}
                  placeholder="Any additional information about this offering"
                  value={formData.notes}
                  onChange={handleChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
          <button
            type="submit"
            disabled={isProcessing}
            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              <>Submit Offering Count</>
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default OfferingCountForm;
