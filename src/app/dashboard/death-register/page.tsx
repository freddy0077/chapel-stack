'use client';

import React, { useState, useCallback } from 'react';
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  CalendarDaysIcon,
  UserMinusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  BellIcon,
  DocumentTextIcon,
  HeartIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { useDeathRegisterManagement, useMemorialCalendar } from '../../../hooks/useDeathRegister';
import { DeathRegister, CreateDeathRegisterInput, UpdateDeathRegisterInput } from '../../../types/deathRegister';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContextEnhanced';

// Import modern components
import { ModernDeathRegisterHeader } from '../../../components/death-register/ModernDeathRegisterHeader';
import { ModernDeathRegisterStats } from '../../../components/death-register/ModernDeathRegisterStats';
import { ModernDeathRegisterForm } from '../../../components/death-register/ModernDeathRegisterFormWizard';

export default function DeathRegisterPage() {
  const { state } = useAuth();
  const user = state.user;
  
  const [selectedTab, setSelectedTab] = useState('records');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedRecord, setSelectedRecord] = useState<DeathRegister | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [sortBy, setSortBy] = useState('dateOfDeath');
  const [showFilters, setShowFilters] = useState(false);

  const {
    deathRegisters,
    loading,
    error,
    createDeathRegister,
    updateDeathRegister,
    deleteDeathRegister,
    markFamilyNotified,
    stats,
    statsLoading,
    refetch,
  } = useDeathRegisterManagement({
    organisationId: user?.organisationId || '',
    branchId: user?.branchId || '',
  });

  const { upcomingMemorials, memorialLoading } = useMemorialCalendar({
    organisationId: user?.organisationId || '',
    branchId: user?.branchId || '',
  });

  // Event handlers
  const handleAddRecord = useCallback(() => {
    setModalMode('create');
    setSelectedRecord(null);
    setShowModal(true);
  }, []);

  const handleEditRecord = useCallback((record: DeathRegister) => {
    setModalMode('edit');
    setSelectedRecord(record);
    setShowModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowModal(false);
    setSelectedRecord(null);
  }, []);

  const handleSubmitRecord = useCallback(async (data: CreateDeathRegisterInput | UpdateDeathRegisterInput) => {
    try {
      if (modalMode === 'create') {
        await createDeathRegister(data as CreateDeathRegisterInput);
        toast.success('Death record created successfully', {
          icon: '✅',
          style: {
            borderRadius: '10px',
            background: '#10B981',
            color: '#fff',
          },
        });
      } else if (modalMode === 'edit' && selectedRecord) {
        await updateDeathRegister(selectedRecord.id, data as UpdateDeathRegisterInput);
        toast.success('Death record updated successfully', {
          icon: '✅',
          style: {
            borderRadius: '10px',
            background: '#10B981',
            color: '#fff',
          },
        });
      }
      setShowModal(false);
      setSelectedRecord(null);
      refetch();
    } catch (err) {
      const action = modalMode === 'create' ? 'create' : 'update';
      toast.error(`Failed to ${action} death record`, {
        icon: '❌',
        style: {
          borderRadius: '10px',
          background: '#EF4444',
          color: '#fff',
        },
      });
    }
  }, [modalMode, selectedRecord, createDeathRegister, updateDeathRegister, refetch]);

  const handleDeleteRecord = useCallback(async (id: string) => {
    if (window.confirm('Are you sure you want to delete this death record? This action cannot be undone.')) {
      try {
        await deleteDeathRegister(id);
        toast.success('Death record deleted successfully', {
          icon: '✅',
          style: {
            borderRadius: '10px',
            background: '#10B981',
            color: '#fff',
          },
        });
        refetch();
      } catch (err) {
        toast.error('Failed to delete death record', {
          icon: '❌',
          style: {
            borderRadius: '10px',
            background: '#EF4444',
            color: '#fff',
          },
        });
      }
    }
  }, [deleteDeathRegister, refetch]);

  // Filter and sort records
  const filteredRecords = deathRegisters
    .filter(record => {
      const matchesSearch = !searchTerm || 
        `${record.member?.firstName} ${record.member?.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.placeOfDeath?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.causeOfDeath?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesYear = !filterYear || 
        new Date(record.dateOfDeath).getFullYear().toString() === filterYear;
      
      return matchesSearch && matchesYear;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'dateOfDeath':
          return new Date(b.dateOfDeath).getTime() - new Date(a.dateOfDeath).getTime();
        case 'name':
          const nameA = `${a.member?.firstName} ${a.member?.lastName}`;
          const nameB = `${b.member?.firstName} ${b.member?.lastName}`;
          return nameA.localeCompare(nameB);
        case 'funeralDate':
          if (!a.funeralDate && !b.funeralDate) return 0;
          if (!a.funeralDate) return 1;
          if (!b.funeralDate) return -1;
          return new Date(b.funeralDate).getTime() - new Date(a.funeralDate).getTime();
        default:
          return 0;
      }
    });

  const tabs = [
    { id: 'records', name: 'Death Records', icon: DocumentTextIcon, count: deathRegisters.length },
    { id: 'memorial', name: 'Memorial Calendar', icon: CalendarDaysIcon, count: upcomingMemorials?.length || 0 },
    { id: 'analytics', name: 'Analytics', icon: ChartBarIcon, count: null },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <ModernDeathRegisterHeader 
          onAddRecord={handleAddRecord}
          totalRecords={stats?.totalDeaths || 0}
          thisYearRecords={stats?.thisYear || 0}
        />

        {/* Stats */}
        <div className="mt-8">
          <ModernDeathRegisterStats 
            stats={stats}
            loading={statsLoading}
          />
        </div>

        {/* Navigation Tabs */}
        <div className="mt-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex space-x-1 bg-gray-100 rounded-xl p-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedTab(tab.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      selectedTab === tab.id
                        ? 'bg-white text-purple-700 shadow-md'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <tab.icon className="h-4 w-4" />
                    <span>{tab.name}</span>
                    {tab.count !== null && (
                      <span className={`px-2 py-0.5 rounded-full text-xs ${
                        selectedTab === tab.id
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-gray-200 text-gray-600'
                      }`}>
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
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      showFilters
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <FunnelIcon className="h-4 w-4" />
                    <span>Filters</span>
                  </button>
                </div>
              )}
            </div>

            {/* Filters */}
            {selectedTab === 'records' && showFilters && (
              <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Search
                    </label>
                    <div className="relative">
                      <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by name, place, or cause..."
                        className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Year
                    </label>
                    <select
                      value={filterYear}
                      onChange={(e) => setFilterYear(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="">All Years</option>
                      {Array.from(new Set(deathRegisters.map(r => new Date(r.dateOfDeath).getFullYear())))
                        .sort((a, b) => b - a)
                        .map(year => (
                          <option key={year} value={year.toString()}>{year}</option>
                        ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sort By
                    </label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="dateOfDeath">Date of Death</option>
                      <option value="name">Name</option>
                      <option value="funeralDate">Funeral Date</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Content */}
            {selectedTab === 'records' && (
              <DeathRecordsTable 
                records={filteredRecords}
                loading={loading}
                onEdit={handleEditRecord}
                onDelete={handleDeleteRecord}
                onMarkNotified={markFamilyNotified}
              />
            )}

            {selectedTab === 'memorial' && (
              <MemorialCalendarView 
                upcomingMemorials={upcomingMemorials}
                loading={memorialLoading}
              />
            )}

            {selectedTab === 'analytics' && (
              <AnalyticsView 
                stats={stats}
                records={deathRegisters}
                loading={statsLoading}
              />
            )}
          </div>
        </div>

        {/* Modal */}
        <ModernDeathRegisterForm
          deathRegister={selectedRecord}
          isOpen={showModal}
          onClose={handleCloseModal}
          onSubmit={handleSubmitRecord}
          loading={loading}
          organisationId={user?.organisationId || ''}
          branchId={user?.branchId}
        />
      </div>
    </div>
  );
}

// Table Component
const DeathRecordsTable: React.FC<{
  records: DeathRegister[];
  loading: boolean;
  onEdit: (record: DeathRegister) => void;
  onDelete: (id: string) => void;
  onMarkNotified: (id: string) => Promise<void>;
}> = ({ records, loading, onEdit, onDelete, onMarkNotified }) => {
  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="bg-white rounded-xl p-6 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div>
                  <div className="w-32 h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="w-24 h-3 bg-gray-200 rounded"></div>
                </div>
              </div>
              <div className="flex space-x-2">
                <div className="w-8 h-8 bg-gray-200 rounded"></div>
                <div className="w-8 h-8 bg-gray-200 rounded"></div>
                <div className="w-8 h-8 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (records.length === 0) {
    return (
      <div className="text-center py-12">
        <UserMinusIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No death records found</h3>
        <p className="mt-1 text-sm text-gray-500">
          No records match your current search and filter criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {records.map((record) => (
        <div
          key={record.id}
          className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                <HeartIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {record.member?.firstName} {record.member?.lastName}
                </h3>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span>Passed: {new Date(record.dateOfDeath).toLocaleDateString()}</span>
                  {record.funeralDate && (
                    <span>Funeral: {new Date(record.funeralDate).toLocaleDateString()}</span>
                  )}
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    record.familyNotified 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {record.familyNotified ? 'Family Notified' : 'Pending Notification'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => onEdit(record)}
                className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                title="Edit Record"
              >
                <PencilIcon className="h-4 w-4" />
              </button>
              
              {!record.familyNotified && (
                <button
                  onClick={() => onMarkNotified(record.id)}
                  className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  title="Mark Family Notified"
                >
                  <BellIcon className="h-4 w-4" />
                </button>
              )}
              
              <button
                onClick={() => onDelete(record.id)}
                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete Record"
              >
                <TrashIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Placeholder components for other tabs
const MemorialCalendarView: React.FC<{
  upcomingMemorials: any[];
  loading: boolean;
}> = ({ upcomingMemorials, loading }) => (
  <div className="text-center py-12">
    <CalendarDaysIcon className="mx-auto h-12 w-12 text-gray-400" />
    <h3 className="mt-2 text-sm font-medium text-gray-900">Memorial Calendar</h3>
    <p className="mt-1 text-sm text-gray-500">
      Memorial calendar view will be implemented here.
    </p>
  </div>
);

const AnalyticsView: React.FC<{
  stats: any;
  records: DeathRegister[];
  loading: boolean;
}> = ({ stats, records, loading }) => (
  <div className="text-center py-12">
    <ChartBarIcon className="mx-auto h-12 w-12 text-gray-400" />
    <h3 className="mt-2 text-sm font-medium text-gray-900">Analytics Dashboard</h3>
    <p className="mt-1 text-sm text-gray-500">
      Detailed analytics and reporting will be implemented here.
    </p>
  </div>
);
