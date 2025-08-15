'use client';

import React, { useState } from 'react';
import { 
  BuildingOfficeIcon, 
  CreditCardIcon, 
  BanknotesIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  RectangleStackIcon,
  Squares2X2Icon,
  ArrowTrendingUpIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  ClockIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { RoleRoute } from '@/components/auth/RoleRoute';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Utility function for class names
function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

// Tab components
import OrganizationsManagement from './components/OrganizationsManagement';
import SubscriptionsManagement from './components/SubscriptionsManagement';
import PaymentsManagement from './components/PaymentsManagement';
import ExpiredOrganizationsManagement from './components/ExpiredOrganizationsManagement';
import PlansManagement from './components/PlansManagement';

// Modern Dashboard Stats Component
interface Stat {
  name: string;
  value: string;
  change: string;
  changeType: 'increase' | 'decrease';
  icon: any;
  color: string;
}

function DashboardStats() {
  // Mock stats - replace with real data from hooks
  const stats: Stat[] = [
    {
      name: 'Total Organizations',
      value: '2,847',
      change: '+12%',
      changeType: 'increase',
      icon: BuildingOfficeIcon,
      color: 'blue'
    },
    {
      name: 'Active Subscriptions',
      value: '2,234',
      change: '+8%',
      changeType: 'increase',
      icon: CheckCircleIcon,
      color: 'green'
    },
    {
      name: 'Monthly Revenue',
      value: '$89,420',
      change: '+15%',
      changeType: 'increase',
      icon: CurrencyDollarIcon,
      color: 'emerald'
    },
    {
      name: 'Expiring Soon',
      value: '47',
      change: '-5%',
      changeType: 'decrease',
      icon: ClockIcon,
      color: 'amber'
    }
  ];

  const getStatColor = (color: string) => {
    const colors = {
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      emerald: 'bg-emerald-500',
      amber: 'bg-amber-500'
    };
    return colors[color as keyof typeof colors] || 'bg-gray-500';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat) => (
        <Card key={stat.name} className="relative overflow-hidden">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className={`p-3 rounded-lg ${getStatColor(stat.color)}`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-600 truncate">
                  {stat.name}
                </p>
                <div className="flex items-baseline">
                  <p className="text-2xl font-semibold text-gray-900">
                    {stat.value}
                  </p>
                  <Badge 
                    variant={stat.changeType === 'increase' ? 'default' : 'secondary'}
                    className="ml-2"
                  >
                    {stat.change}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
          <div className={`absolute bottom-0 left-0 right-0 h-1 ${getStatColor(stat.color)}`} />
        </Card>
      ))}
    </div>
  );
}

// Dashboard Component
function DashboardComponent() {
  return (
    <div className="space-y-6">
      <DashboardStats />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <span className="text-sm text-gray-900">New organization registered</span>
              </div>
              <span className="text-xs text-gray-500">2 min ago</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                <span className="text-sm text-gray-900">Subscription renewed</span>
              </div>
              <span className="text-xs text-gray-500">5 min ago</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-amber-500 rounded-full mr-3"></div>
                <span className="text-sm text-gray-900">Payment failed</span>
              </div>
              <span className="text-xs text-gray-500">12 min ago</span>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="h-20 flex-col">
              <BuildingOfficeIcon className="h-6 w-6 mb-2" />
              <span className="text-sm">Add Organization</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <CreditCardIcon className="h-6 w-6 mb-2" />
              <span className="text-sm">Create Subscription</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <RectangleStackIcon className="h-6 w-6 mb-2" />
              <span className="text-sm">Manage Plans</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <ChartBarIcon className="h-6 w-6 mb-2" />
              <span className="text-sm">View Reports</span>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

// Modern Tab Navigation Component
interface TabNavigationProps {
  tabs: any[];
  selectedIndex: number;
  onChange: (index: number) => void;
}

function ModernTabNavigation({ tabs, selectedIndex, onChange }: TabNavigationProps) {
  return (
    <div className="mb-8">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab, index) => (
            <button
              key={tab.name}
              onClick={() => onChange(index)}
              className={classNames(
                selectedIndex === index
                  ? 'border-indigo-500 text-indigo-600 bg-indigo-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                'group inline-flex items-center py-4 px-6 border-b-2 font-medium text-sm rounded-t-lg transition-all duration-200'
              )}
            >
              <tab.icon
                className={classNames(
                  selectedIndex === index ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500',
                  '-ml-0.5 mr-3 h-5 w-5'
                )}
              />
              <span>{tab.name}</span>
              {tab.badge && (
                <Badge variant="secondary" className="ml-2">
                  {tab.badge}
                </Badge>
              )}
            </button>
          ))}
        </nav>
      </div>
      
      {/* Active Tab Description */}
      <div className="mt-6">
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-4 border border-indigo-100">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              {(() => {
                const IconComponent = tabs[selectedIndex].icon;
                return <IconComponent className="h-5 w-5 text-indigo-600" />;
              })()}
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-indigo-900">
                {tabs[selectedIndex].name}
              </h3>
              <p className="text-sm text-indigo-700 mt-1">
                {tabs[selectedIndex].description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Enhanced tabs with badges and modern styling
interface Tab {
  name: string;
  icon: any;
  component: React.ComponentType;
  description: string;
  badge?: string;
}

const TABS: Tab[] = [
  {
    name: 'Dashboard',
    icon: Squares2X2Icon,
    component: DashboardComponent,
    description: 'Overview of subscription management metrics and quick actions'
  },
  {
    name: 'Organizations',
    icon: BuildingOfficeIcon,
    component: OrganizationsManagement,
    description: 'Manage organizations and their subscription status',
    badge: '2,847'
  },
  {
    name: 'Expired Organizations',
    icon: ExclamationTriangleIcon,
    component: ExpiredOrganizationsManagement,
    description: 'Handle expired organization renewals and manual interventions',
    badge: '47'
  },
  {
    name: 'Plans',
    icon: RectangleStackIcon,
    component: PlansManagement,
    description: 'Create and manage subscription plans',
    badge: '12'
  },
  {
    name: 'Subscriptions',
    icon: CreditCardIcon,
    component: SubscriptionsManagement,
    description: 'Create, update, and manage subscriptions',
    badge: '2,234'
  },
  {
    name: 'Payments',
    icon: BanknotesIcon,
    component: PaymentsManagement,
    description: 'Monitor and manage subscription payments and billing',
    badge: '156'
  }
];

function SubscriptionManagerContent(): React.ReactElement {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const CurrentComponent = TABS[selectedIndex].component;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Modern Header with Gradient */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 shadow-xl">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="py-8">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center">
                  <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm mr-4">
                    <CreditCardIcon className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-white">
                      Subscription Manager
                    </h1>
                    <p className="mt-2 text-indigo-100">
                      Comprehensive subscription and organization management platform
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
                >
                  <ChartBarIcon className="h-4 w-4 mr-2" />
                  Analytics
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
                >
                  <ArrowTrendingUpIcon className="h-4 w-4 mr-2" />
                  Export Data
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content with Modern Layout */}
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Modern Tab Navigation */}
          <ModernTabNavigation 
            tabs={TABS}
            selectedIndex={selectedIndex}
            onChange={setSelectedIndex}
          />

          {/* Tab Content with Enhanced Styling */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6">
              <CurrentComponent />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SubscriptionManagerPage(): React.ReactElement {
  return (
    <RoleRoute allowedRoles={['SUBSCRIPTION_MANAGER']}>
      <SubscriptionManagerContent />
    </RoleRoute>
  );
}
