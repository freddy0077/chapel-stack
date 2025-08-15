'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  UsersIcon, 
  UserPlusIcon, 
  EyeIcon, 
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline';
import { useMemberStatistics } from '@/graphql/hooks/useMemberStatistics';
import type { MemberStatistics } from '@/graphql/queries/memberStatisticsQueries';

interface MemberStatsProps {
  isLoading?: boolean;
}

const MemberStats: React.FC<MemberStatsProps> = ({ 
  isLoading = false, 
}) => {
  const { stats: memberStatistics, loading, error } = useMemberStatistics();

  // Calculate derived stats
  const activeMembers = memberStatistics?.activeMembers || 0;
  const inactiveMembers = memberStatistics?.inactiveMembers || 0;
  const newThisMonth = memberStatistics?.newMembersInPeriod || 0;
  const newThisYear = memberStatistics?.lastMonth?.newMembersInPeriod || 0; // Example, adjust as needed
  
  // Calculate percentage changes
  const activePercentage = (memberStatistics?.totalMembers || 0) > 0 ? Math.round((activeMembers / (memberStatistics?.totalMembers || 1)) * 100) : 0;
  const monthlyGrowth = memberStatistics?.growthRate || 0;

  const stats = [
    {
      title: 'Total Members',
      value: loading ? '...' : (memberStatistics?.totalMembers || 0).toLocaleString(),
      icon: UsersIcon,
      change: `${activePercentage}% active`,
      changeType: 'neutral' as const,
      color: 'bg-blue-500'
    },
    {
      title: 'Active Members',
      value: loading ? '...' : activeMembers.toLocaleString(),
      icon: UserPlusIcon,
      change: `${monthlyGrowth.toFixed(1)}% this month`,
      changeType: 'positive' as const,
      color: 'bg-green-500'
    },
    {
      title: 'New This Month',
      value: loading ? '...' : newThisMonth.toLocaleString(),
      icon: ArrowTrendingUpIcon,
      change: `${newThisYear} last month`,
      changeType: 'positive' as const,
      color: 'bg-purple-500'
    },
    {
      title: 'Inactive Members',
      value: loading ? '...' : inactiveMembers.toLocaleString(),
      icon: ArrowTrendingDownIcon,
      change: `${Math.round((inactiveMembers / (memberStatistics?.totalMembers || 1)) * 100)}% of total`,
      changeType: 'negative' as const,
      color: 'bg-orange-500'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-red-800 text-sm">Failed to load member statistics</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
    >
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          variants={itemVariants}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">
                {stat.title}
              </p>
              <p className="text-2xl font-bold text-gray-900 mb-2">
                {stat.value}
              </p>
              <div className="flex items-center text-sm">
                <span
                  className={`
                    ${stat.changeType === 'positive' ? 'text-green-600' : ''}
                    ${stat.changeType === 'negative' ? 'text-red-600' : ''}
                    ${stat.changeType === 'neutral' ? 'text-gray-600' : ''}
                  `}
                >
                  {stat.change}
                </span>
              </div>
            </div>
            <div className={`p-3 rounded-lg ${stat.color}`}>
              <stat.icon className="h-6 w-6 text-white" />
            </div>
          </div>
        </motion.div>
      ))}
      
      {/* Additional Statistics Panel */}
      {memberStatistics && (
        <motion.div
          variants={itemVariants}
          className="lg:col-span-4 bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-4"
        >
          <div className="flex items-center gap-2 mb-4">
            <ChartBarIcon className="h-5 w-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Detailed Statistics</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Gender Distribution */}
            {memberStatistics?.genderDistribution && (
              <div>
                <h4 className="text-sm font-medium text-gray-600 mb-2">By Gender</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Male:</span>
                    <span className="font-medium">{memberStatistics.genderDistribution.maleCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Female:</span>
                    <span className="font-medium">{memberStatistics.genderDistribution.femaleCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Other:</span>
                    <span className="font-medium">{memberStatistics.genderDistribution.otherCount}</span>
                  </div>
                </div>
              </div>
            )}
            
            {/* Age Distribution */}
            {memberStatistics?.ageGroups && (
              <div>
                <h4 className="text-sm font-medium text-gray-600 mb-2">By Age Group</h4>
                <div className="space-y-1 text-sm">
                  {memberStatistics.ageGroups.map(group => (
                    <div key={group.range} className="flex justify-between">
                      <span>{group.range}:</span>
                      <span className="font-medium">{group.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Status Distribution */}
            {memberStatistics?.membersByStatus && (
              <div>
                <h4 className="text-sm font-medium text-gray-600 mb-2">By Status</h4>
                <div className="space-y-1 text-sm">
                  {memberStatistics.membersByStatus.map(item => (
                    <div key={item.status} className="flex justify-between">
                      <span>{item.status}:</span>
                      <span className="font-medium">{item.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Membership Status Distribution */}
            {memberStatistics?.membersByMembershipStatus && (
              <div>
                <h4 className="text-sm font-medium text-gray-600 mb-2">By Membership</h4>
                <div className="space-y-1 text-sm">
                  {memberStatistics.membersByMembershipStatus.map(item => (
                    <div key={item.status} className="flex justify-between">
                      <span>{item.status}:</span>
                      <span className="font-medium">{item.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default MemberStats;
