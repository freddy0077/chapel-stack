import React from "react";
import { CurrencyDollarIcon } from "@heroicons/react/24/outline";

interface Contribution {
  id?: string;
  date?: string;
  amount?: number;
  type?: string;
  fund?: string;
  paymentMethod?: string;
  [key: string]: any;
}

export default function MemberContributionsTab({ member }: { member: any }) {
  const contributions: Contribution[] = Array.isArray(member?.contributions) ? member.contributions : [];

  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <h4 className="text-xl font-bold text-indigo-700 mb-4 flex items-center gap-2">
        <CurrencyDollarIcon className="h-6 w-6 text-indigo-400" /> Contributions
      </h4>
      {contributions.length > 0 ? (
        <table className="min-w-full divide-y divide-gray-100">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left font-semibold text-gray-700 whitespace-nowrap">Date</th>
              <th className="px-4 py-2 text-left font-semibold text-gray-700 whitespace-nowrap">Type</th>
              <th className="px-4 py-2 text-left font-semibold text-gray-700 whitespace-nowrap">Fund</th>
              <th className="px-4 py-2 text-left font-semibold text-gray-700 whitespace-nowrap">Payment</th>
              <th className="px-4 py-2 text-left font-semibold text-gray-700 whitespace-nowrap">Amount</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-50">
            {contributions.map((c, i) => (
              <tr key={c.id || i}>
                <td className="px-4 py-2 whitespace-nowrap">{c.date ? new Date(c.date).toLocaleDateString() : ''}</td>
                <td className="px-4 py-2 whitespace-nowrap">{c.type || <span className='text-gray-400'>—</span>}</td>
                <td className="px-4 py-2 whitespace-nowrap">{c.fund || <span className='text-gray-400'>—</span>}</td>
                <td className="px-4 py-2 whitespace-nowrap">{c.paymentMethod || <span className='text-gray-400'>—</span>}</td>
                <td className="px-4 py-2 whitespace-nowrap font-bold text-indigo-700">{typeof c.amount === 'number' ? `$${c.amount.toLocaleString()}` : <span className='text-gray-400'>—</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="text-gray-400 py-8 text-center">No contributions found.</div>
      )}
    </div>
  );
}
