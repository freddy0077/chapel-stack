"use client";

import { 
  PlusIcon, 
  BanknotesIcon,
  ClipboardDocumentCheckIcon,
  ChartBarIcon,
  BuildingOfficeIcon,
  ArrowsRightLeftIcon
} from "@heroicons/react/24/outline";
import Link from "next/link";

const QuickActions: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-4">
      {/* New Donation */}
      <Link href="/dashboard/finances/donations/new"
        className="group relative block w-full rounded-lg bg-white border border-gray-100 shadow-sm p-4 hover:bg-indigo-50 hover:border-indigo-100 transition-colors duration-150"
      >
        <div className="flex flex-col h-full items-center text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 group-hover:bg-white">
            <PlusIcon className="h-6 w-6 text-indigo-600" aria-hidden="true" />
          </div>
          <h3 className="mt-3 text-sm font-medium text-gray-900">New Donation</h3>
          <p className="mt-1 text-xs text-gray-500">Record a new donation or offering.</p>
        </div>
      </Link>
      
      {/* New Expense */}
      <Link href="/dashboard/finances/expenses/new"
        className="group relative block w-full rounded-lg bg-white border border-gray-100 shadow-sm p-4 hover:bg-indigo-50 hover:border-indigo-100 transition-colors duration-150"
      >
        <div className="flex flex-col h-full items-center text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 group-hover:bg-white">
            <BanknotesIcon className="h-6 w-6 text-indigo-600" aria-hidden="true" />
          </div>
          <h3 className="mt-3 text-sm font-medium text-gray-900">New Expense</h3>
          <p className="mt-1 text-xs text-gray-500">Record a new expense or payment.</p>
        </div>
      </Link>
      
      {/* Reconciliation */}
      <Link href="/dashboard/finances/reconciliation"
        className="group relative block w-full rounded-lg bg-white border border-gray-100 shadow-sm p-4 hover:bg-indigo-50 hover:border-indigo-100 transition-colors duration-150"
      >
        <div className="flex flex-col h-full items-center text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 group-hover:bg-white">
            <ClipboardDocumentCheckIcon className="h-6 w-6 text-indigo-600" aria-hidden="true" />
          </div>
          <h3 className="mt-3 text-sm font-medium text-gray-900">Reconciliation</h3>
          <p className="mt-1 text-xs text-gray-500">Reconcile bank statements.</p>
        </div>
      </Link>
      
      {/* Generate Reports */}
      <Link href="/dashboard/finances/reports"
        className="group relative block w-full rounded-lg bg-white border border-gray-100 shadow-sm p-4 hover:bg-indigo-50 hover:border-indigo-100 transition-colors duration-150"
      >
        <div className="flex flex-col h-full items-center text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 group-hover:bg-white">
            <ChartBarIcon className="h-6 w-6 text-indigo-600" aria-hidden="true" />
          </div>
          <h3 className="mt-3 text-sm font-medium text-gray-900">Reports</h3>
          <p className="mt-1 text-xs text-gray-500">Generate financial reports.</p>
        </div>
      </Link>
      
      {/* Budget Management */}
      <Link href="/dashboard/finances/budgets"
        className="group relative block w-full rounded-lg bg-white border border-gray-100 shadow-sm p-4 hover:bg-indigo-50 hover:border-indigo-100 transition-colors duration-150"
      >
        <div className="flex flex-col h-full items-center text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 group-hover:bg-white">
            <BuildingOfficeIcon className="h-6 w-6 text-indigo-600" aria-hidden="true" />
          </div>
          <h3 className="mt-3 text-sm font-medium text-gray-900">Budgets</h3>
          <p className="mt-1 text-xs text-gray-500">Manage branch budgets.</p>
        </div>
      </Link>
      
      {/* Resource Allocation */}
      <Link href="/dashboard/finances/allocations"
        className="group relative block w-full rounded-lg bg-white border border-gray-100 shadow-sm p-4 hover:bg-indigo-50 hover:border-indigo-100 transition-colors duration-150"
      >
        <div className="flex flex-col h-full items-center text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 group-hover:bg-white">
            <ArrowsRightLeftIcon className="h-6 w-6 text-indigo-600" aria-hidden="true" />
          </div>
          <h3 className="mt-3 text-sm font-medium text-gray-900">Allocations</h3>
          <p className="mt-1 text-xs text-gray-500">Transfer funds between branches.</p>
        </div>
      </Link>
    </div>
  );
};

export default QuickActions;
