'use client';

import React, { useState, useCallback } from 'react';
import { BirthRegister } from '@/graphql/queries/birthQueries';
import BirthRegisterList from './components/BirthRegisterList';
import BirthRegisterForm from './components/BirthRegisterForm';
import BirthRegisterDetails from './components/BirthRegisterDetails';
import BirthRegistryFiltersComponent, { BirthRegistryFilters } from './components/BirthRegistryFilters';
import BirthRegistrySearchResults from './components/BirthRegistrySearchResults';
import { useBirthRegisterStats, useBirthCalendar } from '@/graphql/hooks/useBirthRegistry';
import { useOrganisationBranch } from '@/hooks/useOrganisationBranch';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  PlusIcon,
  ChartBarIcon,
  UserGroupIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  DocumentTextIcon,
  HeartIcon,
  FunnelIcon,
  SparklesIcon,
  MapPinIcon,
  CalendarIcon,
  ScaleIcon,
  HashtagIcon,
  LightBulbIcon,
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

const BirthRegistryPage: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('records');
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedBirthRegister, setSelectedBirthRegister] = useState<BirthRegister | null>(null);
  const [editingBirthRegister, setEditingBirthRegister] = useState<BirthRegister | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<BirthRegistryFilters>({
    take: 20,
    skip: 0,
  });
  const { organisationId, branchId } = useOrganisationBranch();
  const { stats, loading: statsLoading } = useBirthRegisterStats(organisationId, branchId);
  const now = new Date();
  const { calendar, loading: calendarLoading } = useBirthCalendar(
    organisationId,
    branchId,
    now.getMonth() + 1,
    now.getFullYear()
  );

  const handleCreateNew = useCallback(() => {
    setEditingBirthRegister(null);
    setShowForm(true);
  }, []);

  const handleEdit = useCallback((birthRegister: BirthRegister) => {
    setEditingBirthRegister(birthRegister);
    setShowForm(true);
  }, []);

  const handleViewDetails = useCallback((birthRegister: BirthRegister) => {
    setSelectedBirthRegister(birthRegister);
    setShowDetails(true);
  }, []);

  const handleFormClose = useCallback(() => {
    setShowForm(false);
    setEditingBirthRegister(null);
  }, []);

  const handleDetailsClose = useCallback(() => {
    setShowDetails(false);
    setSelectedBirthRegister(null);
  }, []);

  const handleFiltersChange = useCallback((newFilters: BirthRegistryFilters) => {
    setFilters(newFilters);
  }, []);

  const handleToggleFilters = useCallback(() => {
    setShowFilters(!showFilters);
  }, [showFilters]);

  const handleClearSearch = useCallback(() => {
    setFilters({});
    setShowFilters(false);
  }, []);

  const handleFormSuccess = useCallback((birthRegister: BirthRegister) => {
    // Show success toast
    toast.success('Birth record saved successfully', {
      icon: '👶',
      style: {
        borderRadius: '10px',
        background: '#10B981',
        color: '#fff',
      },
    });
    // Optionally show details of newly created/updated record
    setSelectedBirthRegister(birthRegister);
    setShowDetails(true);
  }, []);

  const handleEditFromDetails = useCallback((birthRegister: BirthRegister) => {
    setShowDetails(false);
    setEditingBirthRegister(birthRegister);
    setShowForm(true);
  }, []);

  // Define tabs
  const tabs = [
    {
      id: 'records',
      name: 'Birth Records',
      icon: DocumentTextIcon,
      count: stats?.total || 0,
    },
    {
      id: 'calendar',
      name: 'Monthly Calendar',
      icon: CalendarDaysIcon,
      count: calendar?.length || 0,
    },
    {
      id: 'analytics',
      name: 'Analytics',
      icon: ChartBarIcon,
      count: null,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Modern Header with Glassmorphism */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 shadow-2xl"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
          <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/10" />
          <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-white/10" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-white/20 backdrop-blur-sm">
                <SparklesIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  Birth Registry
                </h1>
                <p className="text-white/90 text-lg">
                  Track births, plan baptisms, and celebrate new life
                </p>
                <div className="flex items-center gap-4 mt-3 text-sm text-white/80">
                  <span className="flex items-center gap-1">
                    <DocumentTextIcon className="h-4 w-4" />
                    {stats?.total || 0} Total Records
                  </span>
                  <span className="flex items-center gap-1">
                    <CalendarDaysIcon className="h-4 w-4" />
                    {stats?.thisYear || 0} This Year
                  </span>
                </div>
              </div>
            </div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={handleCreateNew}
                size="lg"
                className="bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30 hover:border-white/50 transition-all duration-300 shadow-lg"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Add Birth Record
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* Modern Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
        >
          {[
            { label: 'Total', value: stats?.total ?? 0, icon: ChartBarIcon, color: 'from-blue-500 to-blue-600' },
            { label: 'This Year', value: stats?.thisYear ?? 0, icon: CalendarDaysIcon, color: 'from-indigo-500 to-indigo-600' },
            { label: 'This Month', value: stats?.thisMonth ?? 0, icon: CalendarDaysIcon, color: 'from-purple-500 to-purple-600' },
            { label: 'Male', value: stats?.maleCount ?? 0, icon: UserGroupIcon, color: 'from-blue-400 to-blue-500' },
            { label: 'Female', value: stats?.femaleCount ?? 0, icon: UserGroupIcon, color: 'from-pink-400 to-pink-500' },
            { label: 'Baptism Planned', value: stats?.baptismPlannedCount ?? 0, icon: CheckCircleIcon, color: 'from-emerald-500 to-emerald-600' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              whileHover={{ scale: 1.05 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl bg-gradient-to-r ${stat.color} text-white shadow-lg`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs font-medium text-gray-600">{stat.label}</div>
                  <div className="text-xl font-bold text-gray-900">
                    {statsLoading ? (
                      <div className="w-8 h-6 bg-gray-200 rounded animate-pulse" />
                    ) : (
                      stat.value
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Tabbed Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex space-x-1 bg-gray-100 rounded-2xl p-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedTab(tab.id)}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                      selectedTab === tab.id
                        ? 'bg-white text-blue-700 shadow-lg transform scale-105'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <tab.icon className="h-4 w-4" />
                    <span>{tab.name}</span>
                    {tab.count !== null && (
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs ${
                          selectedTab === tab.id
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-200 text-gray-600'
                        }`}
                      >
                        {tab.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {selectedTab === 'records' && (
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                      showFilters
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <FunnelIcon className="h-4 w-4" />
                    <span>Filters</span>
                  </button>
                </div>
              )}
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              {selectedTab === 'records' && (
                <motion.div
                  key="records"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {/* Advanced Filters */}
                  <BirthRegistryFiltersComponent
                    filters={filters}
                    onFiltersChange={handleFiltersChange}
                    isOpen={showFilters}
                    onToggle={handleToggleFilters}
                  />

                  {/* Search Results Summary */}
                  <BirthRegistrySearchResults
                    filters={filters}
                    totalResults={stats?.total || 0}
                    loading={statsLoading}
                    onClearSearch={handleClearSearch}
                  />
                  
                  {/* Birth Register List */}
                  <BirthRegisterList
                    onCreateNew={handleCreateNew}
                    onViewDetails={handleViewDetails}
                    onEdit={handleEdit}
                    filters={filters}
                    hideHeader
                    onFiltersChange={handleFiltersChange}
                    totalRecords={stats?.total}
                  />
                </motion.div>
              )}

              {selectedTab === 'calendar' && (
                <motion.div
                  key="calendar"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <CalendarDaysIcon className="h-5 w-5 text-gray-600" />
                    <h3 className="font-semibold text-gray-900">
                      {now.toLocaleString('default', { month: 'long' })} {now.getFullYear()} Births
                    </h3>
                    <span className="ml-2 text-sm text-gray-500">
                      {calendarLoading ? 'Loading...' : `${calendar?.length ?? 0} total`}
                    </span>
                  </div>
                  
                  {calendarLoading ? (
                    <div className="space-y-4">
                      {[...Array(5)].map((_, index) => (
                        <div key={index} className="bg-white rounded-2xl p-4 animate-pulse">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gray-200 rounded-full" />
                            <div className="flex-1">
                              <div className="w-32 h-4 bg-gray-200 rounded mb-2" />
                              <div className="w-24 h-3 bg-gray-200 rounded" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : calendar && calendar.length > 0 ? (
                    <div className="grid gap-4">
                      {calendar.map((item, index) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-white rounded-2xl p-4 border border-gray-100 hover:shadow-lg transition-all duration-300"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-500 flex items-center justify-center text-white text-xl shadow-lg">
                              {item.photoUrl ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={item.photoUrl}
                                  alt={item.childName}
                                  className="w-12 h-12 rounded-full object-cover"
                                />
                              ) : (
                                '👶'
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="font-semibold text-gray-900">{item.childName}</div>
                              <div className="text-sm text-gray-600">
                                {new Date(item.dateOfBirth).toLocaleDateString('en-US', {
                                  month: 'long',
                                  day: 'numeric',
                                  year: 'numeric',
                                })} • {item.daysOld} days old
                              </div>
                            </div>
                            {item.baptismPlanned && (
                              <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 border border-emerald-200">
                                Baptism Planned
                              </span>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <HeartIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">
                        No births found
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        No births recorded for this month.
                      </p>
                    </div>
                  )}
                </motion.div>
              )}

              {selectedTab === 'analytics' && (
                <motion.div
                  key="analytics"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {/* Analytics Header */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg">
                      <ChartBarIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Birth Registry Analytics</h3>
                      <p className="text-sm text-gray-500">Comprehensive insights and trends</p>
                    </div>
                  </div>

                  {statsLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {[...Array(6)].map((_, index) => (
                        <div key={index} className="bg-white rounded-2xl p-6 animate-pulse">
                          <div className="w-full h-32 bg-gray-200 rounded-xl mb-4" />
                          <div className="w-3/4 h-4 bg-gray-200 rounded mb-2" />
                          <div className="w-1/2 h-3 bg-gray-200 rounded" />
                        </div>
                      ))}
                    </div>
                  ) : stats ? (
                    <div className="space-y-6">
                      {/* Demographics Overview */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Gender Distribution */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                          className="bg-white rounded-2xl p-6 border border-gray-100 shadow-lg"
                        >
                          <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-lg bg-blue-100">
                              <UserGroupIcon className="h-5 w-5 text-blue-600" />
                            </div>
                            <h4 className="font-semibold text-gray-900">Gender Distribution</h4>
                          </div>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-blue-500" />
                                <span className="text-sm text-gray-600">Male</span>
                              </div>
                              <div className="text-right">
                                <span className="font-semibold text-gray-900">{stats.maleCount}</span>
                                <span className="text-xs text-gray-500 ml-1">
                                  ({stats.total > 0 ? Math.round((stats.maleCount / stats.total) * 100) : 0}%)
                                </span>
                              </div>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${stats.total > 0 ? (stats.maleCount / stats.total) * 100 : 0}%` }}
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-pink-500" />
                                <span className="text-sm text-gray-600">Female</span>
                              </div>
                              <div className="text-right">
                                <span className="font-semibold text-gray-900">{stats.femaleCount}</span>
                                <span className="text-xs text-gray-500 ml-1">
                                  ({stats.total > 0 ? Math.round((stats.femaleCount / stats.total) * 100) : 0}%)
                                </span>
                              </div>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-pink-500 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${stats.total > 0 ? (stats.femaleCount / stats.total) * 100 : 0}%` }}
                              />
                            </div>
                          </div>
                        </motion.div>

                        {/* Birth Location Analysis */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                          className="bg-white rounded-2xl p-6 border border-gray-100 shadow-lg"
                        >
                          <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-lg bg-green-100">
                              <MapPinIcon className="h-5 w-5 text-green-600" />
                            </div>
                            <h4 className="font-semibold text-gray-900">Birth Locations</h4>
                          </div>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-green-500" />
                                <span className="text-sm text-gray-600">Hospital</span>
                              </div>
                              <div className="text-right">
                                <span className="font-semibold text-gray-900">{stats.hospitalBirthsCount}</span>
                                <span className="text-xs text-gray-500 ml-1">
                                  ({stats.total > 0 ? Math.round((stats.hospitalBirthsCount / stats.total) * 100) : 0}%)
                                </span>
                              </div>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-green-500 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${stats.total > 0 ? (stats.hospitalBirthsCount / stats.total) * 100 : 0}%` }}
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-orange-500" />
                                <span className="text-sm text-gray-600">Home</span>
                              </div>
                              <div className="text-right">
                                <span className="font-semibold text-gray-900">{stats.homeBirthsCount}</span>
                                <span className="text-xs text-gray-500 ml-1">
                                  ({stats.total > 0 ? Math.round((stats.homeBirthsCount / stats.total) * 100) : 0}%)
                                </span>
                              </div>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-orange-500 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${stats.total > 0 ? (stats.homeBirthsCount / stats.total) * 100 : 0}%` }}
                              />
                            </div>
                          </div>
                        </motion.div>
                      </div>

                      {/* Baptism Analytics */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white rounded-2xl p-6 border border-gray-100 shadow-lg"
                      >
                        <div className="flex items-center gap-3 mb-6">
                          <div className="p-2 rounded-lg bg-purple-100">
                            <SparklesIcon className="h-5 w-5 text-purple-600" />
                          </div>
                          <h4 className="font-semibold text-gray-900">Baptism Planning & Completion</h4>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="text-center">
                            <div className="relative w-24 h-24 mx-auto mb-3">
                              <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
                                <path
                                  className="text-gray-200"
                                  stroke="currentColor"
                                  strokeWidth="3"
                                  fill="none"
                                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                />
                                <path
                                  className="text-purple-500"
                                  stroke="currentColor"
                                  strokeWidth="3"
                                  strokeDasharray={`${stats.total > 0 ? (stats.baptismPlannedCount / stats.total) * 100 : 0}, 100`}
                                  strokeLinecap="round"
                                  fill="none"
                                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                />
                              </svg>
                              <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-lg font-bold text-purple-600">
                                  {stats.total > 0 ? Math.round((stats.baptismPlannedCount / stats.total) * 100) : 0}%
                                </span>
                              </div>
                            </div>
                            <div className="text-sm font-medium text-gray-900">Baptism Planned</div>
                            <div className="text-xs text-gray-500">{stats.baptismPlannedCount} of {stats.total}</div>
                          </div>
                          <div className="text-center">
                            <div className="relative w-24 h-24 mx-auto mb-3">
                              <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
                                <path
                                  className="text-gray-200"
                                  stroke="currentColor"
                                  strokeWidth="3"
                                  fill="none"
                                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                />
                                <path
                                  className="text-emerald-500"
                                  stroke="currentColor"
                                  strokeWidth="3"
                                  strokeDasharray={`${stats.total > 0 ? (stats.baptismCompletedCount / stats.total) * 100 : 0}, 100`}
                                  strokeLinecap="round"
                                  fill="none"
                                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                />
                              </svg>
                              <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-lg font-bold text-emerald-600">
                                  {stats.total > 0 ? Math.round((stats.baptismCompletedCount / stats.total) * 100) : 0}%
                                </span>
                              </div>
                            </div>
                            <div className="text-sm font-medium text-gray-900">Baptism Completed</div>
                            <div className="text-xs text-gray-500">{stats.baptismCompletedCount} of {stats.total}</div>
                          </div>
                          <div className="text-center">
                            <div className="relative w-24 h-24 mx-auto mb-3">
                              <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
                                <path
                                  className="text-gray-200"
                                  stroke="currentColor"
                                  strokeWidth="3"
                                  fill="none"
                                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                />
                                <path
                                  className="text-gray-400"
                                  stroke="currentColor"
                                  strokeWidth="3"
                                  strokeDasharray={`${stats.total > 0 ? ((stats.total - stats.baptismPlannedCount) / stats.total) * 100 : 0}, 100`}
                                  strokeLinecap="round"
                                  fill="none"
                                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                />
                              </svg>
                              <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-lg font-bold text-gray-600">
                                  {stats.total > 0 ? Math.round(((stats.total - stats.baptismPlannedCount) / stats.total) * 100) : 0}%
                                </span>
                              </div>
                            </div>
                            <div className="text-sm font-medium text-gray-900">No Baptism Plan</div>
                            <div className="text-xs text-gray-500">{stats.total - stats.baptismPlannedCount} of {stats.total}</div>
                          </div>
                        </div>
                      </motion.div>

                      {/* Key Metrics */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 }}
                          className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-4 border border-blue-200"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-blue-500 text-white">
                              <CalendarIcon className="h-4 w-4" />
                            </div>
                            <div>
                              <div className="text-sm text-blue-600 font-medium">This Year</div>
                              <div className="text-xl font-bold text-blue-900">{stats.thisYear}</div>
                            </div>
                          </div>
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 }}
                          className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-4 border border-green-200"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-green-500 text-white">
                              <CalendarDaysIcon className="h-4 w-4" />
                            </div>
                            <div>
                              <div className="text-sm text-green-600 font-medium">This Month</div>
                              <div className="text-xl font-bold text-green-900">{stats.thisMonth}</div>
                            </div>
                          </div>
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.6 }}
                          className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-4 border border-purple-200"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-purple-500 text-white">
                              <ScaleIcon className="h-4 w-4" />
                            </div>
                            <div>
                              <div className="text-sm text-purple-600 font-medium">Avg. Weight</div>
                              <div className="text-xl font-bold text-purple-900">
                                {stats.averageBirthWeight ? `${(stats.averageBirthWeight / 1000).toFixed(1)}kg` : 'N/A'}
                              </div>
                            </div>
                          </div>
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.7 }}
                          className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-4 border border-orange-200"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-orange-500 text-white">
                              <HashtagIcon className="h-4 w-4" />
                            </div>
                            <div>
                              <div className="text-sm text-orange-600 font-medium">Total Records</div>
                              <div className="text-xl font-bold text-orange-900">{stats.total}</div>
                            </div>
                          </div>
                        </motion.div>
                      </div>

                      {/* Insights & Recommendations */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-200"
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-2 rounded-lg bg-indigo-500 text-white">
                            <LightBulbIcon className="h-5 w-5" />
                          </div>
                          <h4 className="font-semibold text-indigo-900">Insights & Recommendations</h4>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4">
                            <div className="flex items-start gap-3">
                              <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                              <div>
                                <div className="font-medium text-gray-900 mb-1">Birth Trends</div>
                                <div className="text-sm text-gray-600">
                                  {stats.thisMonth > 0 
                                    ? `${stats.thisMonth} births recorded this month. ${stats.thisYear > stats.thisMonth ? 'Consistent' : 'Strong'} growth pattern.`
                                    : 'No births recorded this month. Consider outreach programs.'
                                  }
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4">
                            <div className="flex items-start gap-3">
                              <div className="w-2 h-2 rounded-full bg-purple-500 mt-2 flex-shrink-0" />
                              <div>
                                <div className="font-medium text-gray-900 mb-1">Baptism Planning</div>
                                <div className="text-sm text-gray-600">
                                  {stats.baptismPlannedCount < stats.total / 2
                                    ? 'Consider promoting baptism planning during birth registration.'
                                    : 'Excellent baptism planning engagement from families.'
                                  }
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4">
                            <div className="flex items-start gap-3">
                              <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                              <div>
                                <div className="font-medium text-gray-900 mb-1">Healthcare Access</div>
                                <div className="text-sm text-gray-600">
                                  {stats.hospitalBirthsCount > stats.homeBirthsCount
                                    ? 'Good healthcare access with majority hospital births.'
                                    : 'Consider healthcare education and access programs.'
                                  }
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4">
                            <div className="flex items-start gap-3">
                              <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 flex-shrink-0" />
                              <div>
                                <div className="font-medium text-gray-900 mb-1">Member Integration</div>
                                <div className="text-sm text-gray-600">
                                  Automatic child member creation helps maintain comprehensive family records for future ministry.
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <ChartBarIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">
                        No Analytics Data
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Analytics will appear once birth records are available.
                      </p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Birth Register Form Modal */}
        <BirthRegisterForm
          isOpen={showForm}
          onClose={handleFormClose}
          birthRegister={editingBirthRegister}
          onSuccess={handleFormSuccess}
        />

        {/* Birth Register Details Modal */}
        <BirthRegisterDetails
          isOpen={showDetails}
          onClose={handleDetailsClose}
          birthRegister={selectedBirthRegister}
          onEdit={handleEditFromDetails}
        />
      </div>
    </div>
  );
};

export default BirthRegistryPage;
