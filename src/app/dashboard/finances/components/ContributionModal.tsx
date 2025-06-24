"use client";

import { useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useContributionMutations } from "@/graphql/hooks/useContributionMutations";
import { useMember } from "@/graphql/hooks/useMember";
import MemberSearchCombobox from "../../attendance/components/MemberSearchCombobox";
import { useSearchMembers } from "@/graphql/hooks/useSearchMembers";

const categories = ["Tithe", "Offering", "Building Fund"];
const methods = ["Cash", "Momo", "Card"];

export default function ContributionModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [donor, setDonor] = useState("");
  const [donorQuery, setDonorQuery] = useState("");
  const { members: donorOptions, loading: donorLoading } = useSearchMembers(donorQuery);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [method, setMethod] = useState(methods[0]);
  const [notes, setNotes] = useState("");
  const [date, setDate] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  
  const { createContribution, loading, error } = useContributionMutations();

  // Fetch selected donor info if not in search results
  const { member: selectedDonorMember } = useMember(donor);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    try {
      await createContribution({
        variables: {
          input: {
            donor,
            amount: parseFloat(amount),
            category,
            method,
            notes,
            date,
          },
        },
      });
      onClose();
      // Optionally reset form fields here
      setDonor(""); setAmount(""); setCategory(categories[0]); setMethod(methods[0]); setNotes(""); setDate("");
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to add contribution");
    }
  };

  if (!open) return null;

  // Merge selected member into options if missing
  const donorOptionsWithSelected = donor
    ? donorOptions.some(m => m.id === donor)
      ? donorOptions
      : selectedDonorMember
        ? [selectedDonorMember, ...donorOptions]
        : donorOptions
    : donorOptions;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 relative">
        <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-700" onClick={onClose}>
          <XMarkIcon className="h-6 w-6" />
        </button>
        <h2 className="text-xl font-bold text-indigo-900 mb-6">Add/Edit Contribution</h2>
        <form id="contribution-form" className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-semibold text-indigo-500 mb-1">Donor</label>
            <MemberSearchCombobox
              members={donorOptionsWithSelected}
              value={donor}
              onChange={setDonor}
              disabled={donorLoading}
              query={donorQuery}
              onQueryChange={setDonorQuery}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-indigo-500 mb-1">Amount</label>
            <input type="number" className="rounded-xl border border-indigo-100 px-3 py-2 w-full bg-white/90 shadow focus:ring-2 focus:ring-indigo-300" placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-indigo-500 mb-1">Category</label>
            <select className="rounded-xl border border-indigo-100 px-3 py-2 w-full bg-white/90 shadow focus:ring-2 focus:ring-indigo-300" value={category} onChange={e => setCategory(e.target.value)}>
              {categories.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-indigo-500 mb-1">Payment Method</label>
            <select className="rounded-xl border border-indigo-100 px-3 py-2 w-full bg-white/90 shadow focus:ring-2 focus:ring-indigo-300" value={method} onChange={e => setMethod(e.target.value)}>
              {methods.map(m => <option key={m}>{m}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-indigo-500 mb-1">Notes</label>
            <textarea className="rounded-xl border border-indigo-100 px-3 py-2 w-full bg-white/90 shadow focus:ring-2 focus:ring-indigo-300" placeholder="Notes" value={notes} onChange={e => setNotes(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-indigo-500 mb-1">Date</label>
            <input type="date" className="rounded-xl border border-indigo-100 px-3 py-2 w-full bg-white/90 shadow focus:ring-2 focus:ring-indigo-300" value={date} onChange={e => setDate(e.target.value)} />
          </div>
        </form>
        {errorMsg && <div className="mt-2 text-sm text-red-500">{errorMsg}</div>}
        {error && <div className="mt-2 text-sm text-red-500">{error.message}</div>}
        <div className="flex gap-3 mt-8">
          <button type="submit" form="contribution-form" disabled={loading} className="flex-1 rounded-xl bg-gradient-to-br from-emerald-500 to-green-400 py-2 text-white font-semibold shadow-lg hover:from-emerald-600 hover:to-green-500 transition disabled:opacity-50">
            {loading ? "Saving..." : "Save & Continue"}
          </button>
          <button type="button" disabled={loading} onClick={onClose} className="flex-1 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 py-2 text-white font-semibold shadow-lg hover:from-indigo-600 hover:to-purple-600 transition disabled:opacity-50">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
