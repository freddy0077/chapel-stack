import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UsersIcon, HomeIcon, TrendingUpIcon, CalendarIcon } from 'lucide-react';
import { useFamilyStatistics } from '../hooks/useFamilyStatistics';

export const FamilyStatistics: React.FC = () => {
  const { totalFamilies, averageFamilySize, recentFamilies, totalMembers, loading, error } = useFamilyStatistics();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="mb-8">
        <CardContent className="p-6">
          <p className="text-red-600">Error loading family statistics: {error.message}</p>
        </CardContent>
      </Card>
    );
  }

  const stats = [
    {
      title: 'Total Families',
      value: totalFamilies.toLocaleString(),
      icon: HomeIcon,
      description: 'Registered families',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Total Members',
      value: totalMembers.toLocaleString(),
      icon: UsersIcon,
      description: 'Members in families',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Average Family Size',
      value: averageFamilySize.toString(),
      icon: TrendingUpIcon,
      description: 'Members per family',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Recent Families',
      value: recentFamilies.toString(),
      icon: CalendarIcon,
      description: 'Added in last 30 days',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className={`p-2 rounded-lg ${stat.bgColor} mr-4`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
