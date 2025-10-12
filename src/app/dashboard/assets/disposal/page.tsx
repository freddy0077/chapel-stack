'use client';

import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeftIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  TrashIcon,
  CurrencyDollarIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import { GET_ASSET_DISPOSALS, DISPOSE_ASSET } from '@/graphql/queries/assetQueries';
import { AssetDisposal, DisposalMethod } from '@/types/asset';
import { format } from 'date-fns';
import Link from 'next/link';
import { useOrganisationBranch } from '@/hooks/useOrganisationBranch';

export default function AssetDisposalPage() {
  const [search, setSearch] = useState('');
  const [methodFilter, setMethodFilter] = useState('');
  
  // Get organisation and branch context from authenticated user
  const { organisationId, branchId } = useOrganisationBranch();

  // GraphQL queries
  const { data, loading, refetch } = useQuery(GET_ASSET_DISPOSALS, {
    variables: {
      filters: {
        organisationId,
        branchId: branchId || undefined,
        disposalMethod: methodFilter || undefined,
      },
    },
    skip: !organisationId,
  });

  const disposals: AssetDisposal[] = data?.assetDisposals || [];

  // Filter disposals by search
  const filteredDisposals = disposals.filter((disposal) => {
    if (!search) return true;
    const searchLower = search.toLowerCase();
    return (
      disposal.asset.name.toLowerCase().includes(searchLower) ||
      disposal.asset.assetCode.toLowerCase().includes(searchLower) ||
      disposal.buyerRecipient?.toLowerCase().includes(searchLower)
    );
  });

  const getMethodColor = (method: string) => {
    switch (method) {
      case DisposalMethod.SOLD:
        return 'bg-green-100 text-green-800';
      case DisposalMethod.DONATED:
        return 'bg-blue-100 text-blue-800';
      case DisposalMethod.SCRAPPED:
        return 'bg-gray-100 text-gray-800';
      case DisposalMethod.LOST:
        return 'bg-orange-100 text-orange-800';
      case DisposalMethod.STOLEN:
        return 'bg-red-100 text-red-800';
      case DisposalMethod.DAMAGED:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount?: number) => {
    if (!amount) return 'GH₵0.00';
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  // Calculate statistics
  const stats = {
    total: disposals.length,
    sold: disposals.filter(d => d.disposalMethod === DisposalMethod.SOLD).length,
    donated: disposals.filter(d => d.disposalMethod === DisposalMethod.DONATED).length,
    totalSaleValue: disposals
      .filter(d => d.disposalMethod === DisposalMethod.SOLD)
      .reduce((sum, d) => sum + (d.salePrice || 0), 0),
    totalGainLoss: disposals.reduce((sum, d) => sum + (d.gainLossOnDisposal || 0), 0),
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/assets"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Asset Disposal Records</h1>
            <p className="text-gray-600 mt-1">Track disposed, sold, and donated assets</p>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gray-100 rounded-lg">
              <TrashIcon className="w-6 h-6 text-gray-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Disposals</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <CurrencyDollarIcon className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Assets Sold</p>
              <p className="text-2xl font-bold text-gray-900">{stats.sold}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <CurrencyDollarIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Sale Value</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(stats.totalSaleValue)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-lg ${stats.totalGainLoss >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
              <CurrencyDollarIcon className={`w-6 h-6 ${stats.totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Gain/Loss</p>
              <p className={`text-2xl font-bold ${stats.totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(stats.totalGainLoss)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by asset name, code, or recipient..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Methods</option>
            <option value={DisposalMethod.SOLD}>Sold</option>
            <option value={DisposalMethod.DONATED}>Donated</option>
            <option value={DisposalMethod.SCRAPPED}>Scrapped</option>
            <option value={DisposalMethod.LOST}>Lost</option>
            <option value={DisposalMethod.STOLEN}>Stolen</option>
            <option value={DisposalMethod.DAMAGED}>Damaged</option>
          </select>
        </div>
      </div>

      {/* Disposal List */}
      {filteredDisposals.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <TrashIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Disposal Records</h3>
          <p className="text-gray-600">
            {search || methodFilter
              ? 'No disposals match your search criteria'
              : 'Disposal records will appear here when assets are disposed'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Asset
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Disposal Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Method
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Recipient/Buyer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Book Value
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sale Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Gain/Loss
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDisposals.map((disposal) => (
                  <tr key={disposal.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {disposal.asset.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {disposal.asset.assetCode} • {disposal.asset.assetType.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-sm text-gray-900">
                        <CalendarIcon className="w-4 h-4 text-gray-400" />
                        {format(new Date(disposal.disposalDate), 'MMM dd, yyyy')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getMethodColor(disposal.disposalMethod)}`}>
                        {disposal.disposalMethod}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {disposal.buyerRecipient || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatCurrency(disposal.bookValueAtDisposal)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {disposal.salePrice ? formatCurrency(disposal.salePrice) : '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-medium ${
                        (disposal.gainLossOnDisposal || 0) >= 0 
                          ? 'text-green-600' 
                          : 'text-red-600'
                      }`}>
                        {disposal.gainLossOnDisposal !== null && disposal.gainLossOnDisposal !== undefined
                          ? formatCurrency(disposal.gainLossOnDisposal)
                          : '-'}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
