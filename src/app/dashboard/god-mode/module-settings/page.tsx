'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@apollo/client';
import { useModuleContext } from '@/context/ModuleContext';
import { GET_GOD_MODE_MODULES } from '@/graphql/queries/godModeModuleQueries';
import {
  Settings, AlertCircle, CheckCircle, Zap, Users, Calendar, DollarSign, MessageSquare, BarChart3,
  Search, Shield, Sparkles, Download, Upload, RefreshCw, HardDrive, Activity, Lock, TrendingUp, Edit2,
  Heart, MapPin, Loader,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

interface Module {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  icon: React.ReactNode;
  category: string;
  dependencies: string[];
  features: string[];
  settings: Record<string, any>;
  color: string;
  version?: string;
}

interface TabConfig {
  id: string;
  name: string;
  icon: React.ReactNode;
  count?: number;
}

export default function ModuleSettingsPage() {
  const { updateModule } = useModuleContext();
  const [modules, setModules] = useState<Module[]>([]);
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [filter, setFilter] = useState<'all' | 'core' | 'admin' | 'shared'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch modules from GraphQL
  const { data, loading, error, refetch } = useQuery(GET_GOD_MODE_MODULES, {
    variables: { skip: 0, take: 100 },
    onCompleted: (data) => {
      if (data?.godModeAllModules?.modules) {
        // Convert GraphQL response to Module interface
        const convertedModules = data.godModeAllModules.modules.map((m: any) => ({
          id: m.id,
          name: m.name,
          description: m.description,
          enabled: m.enabled,
          icon: getIconForModule(m.icon),
          category: m.category,
          dependencies: m.dependencies || [],
          features: m.features || [],
          settings: m.settings || {},
          color: getColorForModule(m.id),
          version: '1.0.0',
        }));
        setModules(convertedModules);
      }
    },
    onError: (err) => {
      console.error('Error fetching modules:', err);
      toast.error('Failed to load modules');
    },
  });

  const filteredModules = modules.filter((m) => {
    const matchesCategory = filter === 'all' || m.category.toLowerCase() === filter;
    const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleToggleModule = useCallback(async (moduleId: string, enabled: boolean) => {
    const module = modules.find((m) => m.id === moduleId);
    if (!module) return;

    if (!enabled) {
      const dependents = modules.filter((m) =>
        m.dependencies.includes(moduleId) && m.enabled
      );
      if (dependents.length > 0) {
        toast.error(
          `Cannot disable ${module.name}. Required by: ${dependents.map((m) => m.name).join(', ')}`
        );
        return;
      }
    }

    try {
      // Update via ModuleContext (syncs with backend)
      await updateModule(moduleId, enabled);

      // Update local state
      setModules(modules.map((m) =>
        m.id === moduleId ? { ...m, enabled } : m
      ));

      toast.success(
        `${module.name} ${enabled ? 'enabled' : 'disabled'}`,
        {
          icon: enabled ? '✅' : '⏹️',
          style: {
            borderRadius: '10px',
            background: enabled ? '#10B981' : '#EF4444',
            color: '#fff',
          },
        }
      );
    } catch (error) {
      toast.error(`Failed to update ${module.name}`);
    }
  }, [modules, updateModule]);

  const stats = [
    { label: 'Total Modules', value: modules.length, icon: Settings, color: 'from-slate-500 to-slate-600' },
    { label: 'Enabled', value: modules.filter((m) => m.enabled).length, icon: CheckCircle, color: 'from-green-500 to-green-600' },
    { label: 'Core Modules', value: modules.filter((m) => m.category === 'Core').length, icon: Shield, color: 'from-blue-500 to-blue-600' },
    { label: 'Advanced', value: modules.filter((m) => m.category === 'Advanced').length, icon: Sparkles, color: 'from-purple-500 to-purple-600' },
  ];

  const tabs: TabConfig[] = [
    { id: 'overview', name: 'Overview', icon: <BarChart3 className="h-5 w-5" /> },
    { id: 'modules', name: 'Modules', icon: <Settings className="h-5 w-5" />, count: modules.length },
    { id: 'configuration', name: 'Configuration', icon: <Edit2 className="h-5 w-5" /> },
    { id: 'dependencies', name: 'Dependencies', icon: <Activity className="h-5 w-5" /> },
    { id: 'monitoring', name: 'Monitoring', icon: <TrendingUp className="h-5 w-5" /> },
    { id: 'backup', name: 'Backup', icon: <HardDrive className="h-5 w-5" /> },
    { id: 'analytics', name: 'Analytics', icon: <BarChart3 className="h-5 w-5" /> },
    { id: 'audit', name: 'Audit Log', icon: <Lock className="h-5 w-5" /> },
  ];

  const adminModules = filteredModules.filter((m) => m.category === 'Admin');
  const coreModules = filteredModules.filter((m) => m.category === 'Core');
  const sharedModules = filteredModules.filter((m) => m.category === 'Shared');

  // Helper function to get icon for module
  const getIconForModule = (iconName: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      'Shield': <Shield className="h-6 w-6" />,
      'Users': <Users className="h-6 w-6" />,
      'Calendar': <Calendar className="h-6 w-6" />,
      'DollarSign': <DollarSign className="h-6 w-6" />,
      'MessageSquare': <MessageSquare className="h-6 w-6" />,
      'CheckCircle': <CheckCircle className="h-6 w-6" />,
      'Heart': <Heart className="h-6 w-6" />,
      'Settings': <Settings className="h-6 w-6" />,
      'BarChart3': <BarChart3 className="h-6 w-6" />,
      'Edit2': <Edit2 className="h-6 w-6" />,
      'Lock': <Lock className="h-6 w-6" />,
      'HardDrive': <HardDrive className="h-6 w-6" />,
      'MapPin': <MapPin className="h-6 w-6" />,
      'Sparkles': <Sparkles className="h-6 w-6" />,
      'Zap': <Zap className="h-6 w-6" />,
    };
    return iconMap[iconName] || <Settings className="h-6 w-6" />;
  };

  // Helper function to get color for module
  const getColorForModule = (moduleId: string): string => {
    const colorMap: Record<string, string> = {
      'god-mode': 'from-red-500 to-red-600',
      'super-admin': 'from-red-600 to-red-700',
      'members': 'from-blue-500 to-blue-600',
      'member': 'from-blue-400 to-blue-500',
      'families': 'from-blue-300 to-blue-400',
      'groups': 'from-indigo-500 to-indigo-600',
      'volunteers': 'from-indigo-400 to-indigo-500',
      'children': 'from-pink-400 to-pink-500',
      'user-management': 'from-purple-500 to-purple-600',
      'finances': 'from-green-500 to-green-600',
      'branch-finances': 'from-green-400 to-green-500',
      'subscription-manager': 'from-emerald-500 to-emerald-600',
      'events': 'from-purple-500 to-purple-600',
      'calendar': 'from-purple-400 to-purple-500',
      'attendance': 'from-teal-500 to-teal-600',
      'pastoral-care': 'from-rose-500 to-rose-600',
      'prayer-requests': 'from-rose-400 to-rose-500',
      'communication': 'from-pink-500 to-pink-600',
      'broadcasts': 'from-pink-400 to-pink-500',
      'notifications': 'from-pink-300 to-pink-400',
      'sermons': 'from-orange-500 to-orange-600',
      'sacraments': 'from-amber-500 to-amber-600',
      'birth-registry': 'from-cyan-500 to-cyan-600',
      'death-register': 'from-slate-500 to-slate-600',
      'admin': 'from-gray-600 to-gray-700',
      'branches': 'from-slate-600 to-slate-700',
      'branch': 'from-slate-500 to-slate-600',
      'branch-admin': 'from-slate-400 to-slate-500',
      'zones': 'from-lime-500 to-lime-600',
      'ministries': 'from-violet-500 to-violet-600',
      'analytics': 'from-cyan-600 to-cyan-700',
      'reports': 'from-cyan-500 to-cyan-600',
      'report-builder': 'from-cyan-400 to-cyan-500',
      'audits': 'from-orange-600 to-orange-700',
      'cms': 'from-fuchsia-500 to-fuchsia-600',
      'website-integration': 'from-fuchsia-400 to-fuchsia-500',
      'mobile-integration': 'from-fuchsia-300 to-fuchsia-400',
      'workflows': 'from-yellow-500 to-yellow-600',
      'assets': 'from-sky-500 to-sky-600',
      'settings': 'from-gray-500 to-gray-600',
      'profile': 'from-indigo-300 to-indigo-400',
      'components': 'from-lime-400 to-lime-500',
      'worship': 'from-red-500 to-red-600',
    };
    return colorMap[moduleId] || 'from-gray-500 to-gray-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 p-8 shadow-2xl mb-8"
        >
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
          <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/10" />
          <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-white/10" />
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-2xl bg-white/20 backdrop-blur-sm">
                <Settings className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Module Settings</h1>
                <p className="text-white/90 text-lg">Configure and manage system modules</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              whileHover={{ scale: 1.05 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-lg hover:shadow-xl transition-all"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl bg-gradient-to-r ${stat.color} text-white shadow-lg`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs font-medium text-gray-600">{stat.label}</div>
                  <div className="text-lg font-bold text-gray-900">{stat.value}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-2 border border-white/20 shadow-lg mb-8 overflow-x-auto"
        >
          <div className="flex gap-2 min-w-max">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tab.icon}
                {tab.name}
                {tab.count !== undefined && (
                  <span className="ml-1 px-2 py-0.5 bg-white/20 rounded-full text-xs font-semibold">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Activity className="h-5 w-5 text-blue-600" />
                    System Status
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Overall Health</span>
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">Healthy</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Uptime</span>
                      <span className="font-semibold text-gray-900">99.9%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Last Backup</span>
                      <span className="font-semibold text-gray-900">2 hours ago</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-purple-600" />
                    Quick Actions
                  </h3>
                  <div className="space-y-2">
                    <Button className="w-full justify-start bg-blue-50 text-blue-700 hover:bg-blue-100">
                      <Download className="h-4 w-4 mr-2" />
                      Export Configuration
                    </Button>
                    <Button className="w-full justify-start bg-green-50 text-green-700 hover:bg-green-100">
                      <Upload className="h-4 w-4 mr-2" />
                      Import Configuration
                    </Button>
                    <Button className="w-full justify-start bg-orange-50 text-orange-700 hover:bg-orange-100">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      System Health Check
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Modules Tab */}
          {activeTab === 'modules' && (
            <motion.div
              key="modules"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search modules..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      disabled={loading}
                      className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
                    />
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {(['all', 'admin', 'core', 'shared'] as const).map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setFilter(cat)}
                        disabled={loading}
                        className={`px-4 py-2 rounded-xl font-medium transition-all whitespace-nowrap disabled:opacity-50 ${
                          filter === cat
                            ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {cat === 'all' ? 'All' : cat === 'admin' ? 'Admin' : cat === 'core' ? 'Core' : 'Shared'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Loading State */}
              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-12"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  >
                    <Loader className="h-12 w-12 text-purple-600" />
                  </motion.div>
                  <p className="mt-4 text-gray-600 font-medium">Loading modules...</p>
                </motion.div>
              )}

              {/* Error State */}
              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-red-50 border border-red-200 rounded-2xl p-6"
                >
                  <div className="flex items-center gap-3">
                    <AlertCircle className="h-6 w-6 text-red-600" />
                    <div>
                      <h3 className="font-bold text-red-900">Error Loading Modules</h3>
                      <p className="text-red-700 text-sm">{error.message}</p>
                      <button
                        onClick={() => refetch()}
                        className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Retry
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Empty State */}
              {!loading && !error && modules.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-12"
                >
                  <Settings className="h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-600 font-medium">No modules found</p>
                </motion.div>
              )}

              {adminModules.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Shield className="h-6 w-6 text-red-600" />
                    Admin Modules
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                    {adminModules.map((module) => (
                      <motion.div
                        key={module.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ scale: 1.02 }}
                        className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-all cursor-pointer"
                        onClick={() => setSelectedModule(module)}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className={`p-3 rounded-xl bg-gradient-to-r ${module.color} text-white`}>
                            {module.icon}
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleModule(module.id, !module.enabled);
                            }}
                            className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                              module.enabled ? 'bg-green-500' : 'bg-gray-300'
                            }`}
                          >
                            <span
                              className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                                module.enabled ? 'translate-x-7' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">{module.name}</h3>
                        <p className="text-sm text-gray-600 mb-4">{module.description}</p>
                        <div className="space-y-2 mb-4">
                          {module.features.slice(0, 2).map((feature) => (
                            <div key={feature} className="flex items-center gap-2 text-sm text-gray-700">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              {feature}
                            </div>
                          ))}
                        </div>
                        {module.dependencies.length > 0 && (
                          <div className="flex items-center gap-2 text-xs text-gray-500 p-2 bg-gray-50 rounded-lg">
                            <AlertCircle className="h-4 w-4" />
                            Requires: {module.dependencies.join(', ')}
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {coreModules.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Shield className="h-6 w-6 text-blue-600" />
                    Core Modules
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {coreModules.map((module) => (
                      <motion.div
                        key={module.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ scale: 1.02 }}
                        className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-all cursor-pointer"
                        onClick={() => setSelectedModule(module)}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className={`p-3 rounded-xl bg-gradient-to-r ${module.color} text-white`}>
                            {module.icon}
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleModule(module.id, !module.enabled);
                            }}
                            className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                              module.enabled ? 'bg-green-500' : 'bg-gray-300'
                            }`}
                          >
                            <span
                              className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                                module.enabled ? 'translate-x-7' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">{module.name}</h3>
                        <p className="text-sm text-gray-600 mb-4">{module.description}</p>
                        <div className="space-y-2 mb-4">
                          {module.features.slice(0, 2).map((feature) => (
                            <div key={feature} className="flex items-center gap-2 text-sm text-gray-700">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              {feature}
                            </div>
                          ))}
                        </div>
                        {module.dependencies.length > 0 && (
                          <div className="flex items-center gap-2 text-xs text-gray-500 p-2 bg-gray-50 rounded-lg">
                            <AlertCircle className="h-4 w-4" />
                            Requires: {module.dependencies.join(', ')}
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {sharedModules.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Sparkles className="h-6 w-6 text-lime-600" />
                    Shared Components
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {sharedModules.map((module) => (
                      <motion.div
                        key={module.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ scale: 1.02 }}
                        className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-all cursor-pointer"
                        onClick={() => setSelectedModule(module)}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className={`p-3 rounded-xl bg-gradient-to-r ${module.color} text-white`}>
                            {module.icon}
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleModule(module.id, !module.enabled);
                            }}
                            className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                              module.enabled ? 'bg-green-500' : 'bg-gray-300'
                            }`}
                          >
                            <span
                              className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                                module.enabled ? 'translate-x-7' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">{module.name}</h3>
                        <p className="text-sm text-gray-600 mb-4">{module.description}</p>
                        <div className="space-y-2 mb-4">
                          {module.features.slice(0, 2).map((feature) => (
                            <div key={feature} className="flex items-center gap-2 text-sm text-gray-700">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              {feature}
                            </div>
                          ))}
                        </div>
                        {module.dependencies.length > 0 && (
                          <div className="flex items-center gap-2 text-xs text-gray-500 p-2 bg-gray-50 rounded-lg">
                            <AlertCircle className="h-4 w-4" />
                            Requires: {module.dependencies.join(', ')}
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Other Tabs Placeholder */}
          {['configuration', 'dependencies', 'monitoring', 'backup', 'analytics', 'audit'].includes(activeTab) && (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-2xl p-12 border border-gray-200 shadow-lg text-center"
            >
              <p className="text-gray-600 text-lg">
                {activeTab === 'configuration' && 'Module configuration interface - Coming soon'}
                {activeTab === 'dependencies' && 'Dependency graph visualization - Coming soon'}
                {activeTab === 'monitoring' && 'Real-time monitoring dashboard - Coming soon'}
                {activeTab === 'backup' && 'Backup and restore management - Coming soon'}
                {activeTab === 'analytics' && 'Usage analytics and reporting - Coming soon'}
                {activeTab === 'audit' && 'Audit log and compliance tracking - Coming soon'}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Module Details Modal */}
        <AnimatePresence>
          {selectedModule && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => setSelectedModule(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className={`p-4 rounded-2xl bg-gradient-to-r ${selectedModule.color} text-white`}>
                    {selectedModule.icon}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedModule.name}</h2>
                    <p className="text-sm text-gray-600">{selectedModule.category}</p>
                  </div>
                </div>

                <p className="text-gray-700 mb-6">{selectedModule.description}</p>

                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Features</h3>
                  <div className="space-y-2">
                    {selectedModule.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-2 text-gray-700">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>

                {selectedModule.dependencies.length > 0 && (
                  <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-blue-600" />
                      Dependencies
                    </h3>
                    <p className="text-sm text-gray-700">{selectedModule.dependencies.join(', ')}</p>
                  </div>
                )}

                <div className="flex gap-3">
                  <Button
                    onClick={() => setSelectedModule(null)}
                    variant="outline"
                    className="flex-1"
                  >
                    Close
                  </Button>
                  <Button
                    onClick={() => {
                      handleToggleModule(selectedModule.id, !selectedModule.enabled);
                      setSelectedModule(null);
                    }}
                    className={`flex-1 ${
                      selectedModule.enabled
                        ? 'bg-red-600 hover:bg-red-700'
                        : 'bg-green-600 hover:bg-green-700'
                    } text-white`}
                  >
                    {selectedModule.enabled ? 'Disable' : 'Enable'}
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
