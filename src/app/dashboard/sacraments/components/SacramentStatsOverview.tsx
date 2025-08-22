"use client";

import {
  SparklesIcon,
  GiftIcon,
  HeartIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { SacramentStatsLoader } from "../SacramentStatsLoader";

interface StatsCardProps {
  title: string;
  value: string | number;
  description: string;
  trend?: "up" | "down" | "neutral";
  percentage?: number;
  icon: React.ForwardRefExoticComponent<React.SVGProps<SVGSVGElement>>;
  iconColor: string;
}

function StatsCard({ 
  title, 
  value, 
  description, 
  trend, 
  percentage, 
  icon: Icon, 
  iconColor 
}: StatsCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 group">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg bg-gradient-to-r ${iconColor.includes('blue') ? 'from-blue-50 to-blue-100' : 
              iconColor.includes('amber') ? 'from-amber-50 to-amber-100' :
              iconColor.includes('purple') ? 'from-purple-50 to-purple-100' :
              'from-rose-50 to-rose-100'}`}>
              <Icon className={`h-6 w-6 ${iconColor}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">{title}</p>
              <p className="text-2xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                {value}
              </p>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <p className="text-xs text-gray-500">{description}</p>
            {trend && percentage && (
              <div className={`flex items-center space-x-1 text-xs font-medium ${
                trend === 'up' ? 'text-green-600' : 
                trend === 'down' ? 'text-red-600' : 
                'text-gray-500'
              }`}>
                <span>{trend === 'up' ? '↗' : trend === 'down' ? '↘' : '→'}</span>
                <span>{percentage}%</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface SacramentStatsOverviewProps {
  period?: string;
}

export default function SacramentStatsOverview({ period = "all" }: SacramentStatsOverviewProps) {
  return (
    <div className="mb-8">
      <SacramentStatsLoader period={period}>
        {(stats: any[], loading: boolean, error: unknown, loaderRefetch: () => void) => {
          if (loading) {
            return (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 animate-pulse">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                        <div className="h-6 bg-gray-200 rounded w-16"></div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="h-3 bg-gray-200 rounded w-32"></div>
                    </div>
                  </div>
                ))}
              </div>
            );
          }

          if (error) {
            return (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600 text-sm">Failed to load sacrament statistics</p>
              </div>
            );
          }

          return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatsCard
                title="Total Baptisms"
                value={stats.find(s => s.sacramentType === 'BAPTISM')?.count || 0}
                description="Sacred initiations"
                icon={SparklesIcon}
                iconColor="text-blue-600"
                trend={stats.find(s => s.sacramentType === 'BAPTISM')?.trend || 'neutral'}
                percentage={stats.find(s => s.sacramentType === 'BAPTISM')?.percentage || 0}
              />
              <StatsCard
                title="First Communions"
                value={stats.find(s => s.sacramentType === 'EUCHARIST_FIRST_COMMUNION')?.count || 0}
                description="First Eucharist receptions"
                icon={GiftIcon}
                iconColor="text-amber-600"
                trend={stats.find(s => s.sacramentType === 'EUCHARIST_FIRST_COMMUNION')?.trend || 'neutral'}
                percentage={stats.find(s => s.sacramentType === 'EUCHARIST_FIRST_COMMUNION')?.percentage || 0}
              />
              <StatsCard
                title="Confirmations"
                value={stats.find(s => s.sacramentType === 'CONFIRMATION')?.count || 0}
                description="Faith strengthened"
                icon={HeartIcon}
                iconColor="text-purple-600"
                trend={stats.find(s => s.sacramentType === 'CONFIRMATION')?.trend || 'neutral'}
                percentage={stats.find(s => s.sacramentType === 'CONFIRMATION')?.percentage || 0}
              />
              <StatsCard
                title="Marriages"
                value={stats.find(s => s.sacramentType === 'MATRIMONY')?.count || 0}
                description="Sacred unions blessed"
                icon={UserGroupIcon}
                iconColor="text-rose-600"
                trend={stats.find(s => s.sacramentType === 'MATRIMONY')?.trend || 'neutral'}
                percentage={stats.find(s => s.sacramentType === 'MATRIMONY')?.percentage || 0}
              />
            </div>
          );
        }}
      </SacramentStatsLoader>
    </div>
  );
}
