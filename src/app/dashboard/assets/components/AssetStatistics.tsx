'use client';

import { useQuery } from '@apollo/client';
import { 
  CubeIcon, 
  CheckCircleIcon, 
  TrashIcon, 
  WrenchScrewdriverIcon,
  CurrencyDollarIcon,
  ArrowTrendingDownIcon,
} from '@heroicons/react/24/outline';
import { GET_ASSET_STATISTICS } from '@/graphql/queries/assetQueries';
import { AssetStatistics as AssetStatsType } from '@/types/asset';

interface AssetStatisticsProps {
  organisationId: string;
  branchId?: string;
}

export default function AssetStatistics({ organisationId, branchId }: AssetStatisticsProps) {
  const { data, loading } = useQuery(GET_ASSET_STATISTICS, {
    variables: { organisationId, branchId },
    skip: !organisationId,
  });

  const stats: AssetStatsType | undefined = data?.assetStatistics;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
            <div className="h-12 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const statisticsCards = [
    {
      title: 'Total Assets',
      value: stats.totalAssets,
      icon: CubeIcon,
      color: 'blue',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600',
    },
    {
      title: 'Active Assets',
      value: stats.activeAssets,
      icon: CheckCircleIcon,
      color: 'green',
      bgColor: 'bg-green-100',
      textColor: 'text-green-600',
    },
    {
      title: 'In Maintenance',
      value: stats.inMaintenanceAssets,
      icon: WrenchScrewdriverIcon,
      color: 'yellow',
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-600',
    },
    {
      title: 'Disposed',
      value: stats.disposedAssets,
      icon: TrashIcon,
      color: 'red',
      bgColor: 'bg-red-100',
      textColor: 'text-red-600',
    },
    {
      title: 'Current Value',
      value: formatCurrency(stats.totalValue),
      icon: CurrencyDollarIcon,
      color: 'purple',
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-600',
      subtitle: `Purchase: ${formatCurrency(stats.totalPurchaseValue)}`,
    },
    {
      title: 'Total Depreciation',
      value: formatCurrency(stats.totalDepreciation),
      icon: ArrowTrendingDownIcon,
      color: 'orange',
      bgColor: 'bg-orange-100',
      textColor: 'text-orange-600',
      subtitle: stats.totalPurchaseValue > 0 
        ? `${((stats.totalDepreciation / stats.totalPurchaseValue) * 100).toFixed(1)}% of purchase value`
        : undefined,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {statisticsCards.map((stat, index) => (
        <div key={index} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-900 mb-1">
                {stat.value}
              </p>
              {stat.subtitle && (
                <p className="text-xs text-gray-500">{stat.subtitle}</p>
              )}
            </div>
            <div className={`p-3 ${stat.bgColor} rounded-lg`}>
              <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
