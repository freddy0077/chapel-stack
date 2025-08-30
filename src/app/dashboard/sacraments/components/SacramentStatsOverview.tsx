"use client";

import {
  SparklesIcon,
  GiftIcon,
  HeartIcon,
  UserGroupIcon,
  HandRaisedIcon,
  PlusCircleIcon,
  AcademicCapIcon,
  BookOpenIcon,
} from "@heroicons/react/24/outline";
import { SACRAMENT_TYPES, SACRAMENT_DISPLAY_NAMES, SACRAMENT_COLORS } from "@/constants/sacramentTypes";
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                {[...Array(9)].map((_, i) => (
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

          // Define sacrament configurations with icons and descriptions
          const sacramentConfigs = [
            {
              type: SACRAMENT_TYPES.BAPTISM,
              title: SACRAMENT_DISPLAY_NAMES[SACRAMENT_TYPES.BAPTISM],
              description: "Sacred initiations",
              icon: SparklesIcon,
              color: "text-blue-600"
            },
            {
              type: SACRAMENT_TYPES.COMMUNION,
              title: SACRAMENT_DISPLAY_NAMES[SACRAMENT_TYPES.COMMUNION],
              description: "First Eucharist receptions",
              icon: GiftIcon,
              color: "text-amber-600"
            },
            {
              type: SACRAMENT_TYPES.CONFIRMATION,
              title: SACRAMENT_DISPLAY_NAMES[SACRAMENT_TYPES.CONFIRMATION],
              description: "Faith strengthened",
              icon: HeartIcon,
              color: "text-purple-600"
            },
            {
              type: SACRAMENT_TYPES.MARRIAGE,
              title: SACRAMENT_DISPLAY_NAMES[SACRAMENT_TYPES.MARRIAGE],
              description: "Sacred unions blessed",
              icon: UserGroupIcon,
              color: "text-rose-600"
            },
            {
              type: SACRAMENT_TYPES.RECONCILIATION,
              title: SACRAMENT_DISPLAY_NAMES[SACRAMENT_TYPES.RECONCILIATION],
              description: "First confessions",
              icon: HandRaisedIcon,
              color: "text-green-600"
            },
            {
              type: SACRAMENT_TYPES.ANOINTING,
              title: SACRAMENT_DISPLAY_NAMES[SACRAMENT_TYPES.ANOINTING],
              description: "Healing sacrament",
              icon: PlusCircleIcon,
              color: "text-indigo-600"
            },
            {
              type: SACRAMENT_TYPES.DIACONATE,
              title: SACRAMENT_DISPLAY_NAMES[SACRAMENT_TYPES.DIACONATE],
              description: "Deacon ordinations",
              icon: AcademicCapIcon,
              color: "text-violet-600"
            },
            {
              type: SACRAMENT_TYPES.PRIESTHOOD,
              title: SACRAMENT_DISPLAY_NAMES[SACRAMENT_TYPES.PRIESTHOOD],
              description: "Priest ordinations",
              icon: AcademicCapIcon,
              color: "text-violet-700"
            },
            {
              type: SACRAMENT_TYPES.RCIA,
              title: SACRAMENT_DISPLAY_NAMES[SACRAMENT_TYPES.RCIA],
              description: "Adult initiations",
              icon: BookOpenIcon,
              color: "text-teal-600"
            }
          ];

          return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
              {sacramentConfigs.map((config) => {
                const sacramentStats = stats.find(s => s.sacramentType === config.type);
                return (
                  <StatsCard
                    key={config.type}
                    title={config.title}
                    value={sacramentStats?.count || 0}
                    description={config.description}
                    icon={config.icon}
                    iconColor={config.color}
                    trend={sacramentStats?.trend || 'neutral'}
                    percentage={sacramentStats?.percentage || 0}
                  />
                );
              })}
            </div>
          );
        }}
      </SacramentStatsLoader>
    </div>
  );
}
