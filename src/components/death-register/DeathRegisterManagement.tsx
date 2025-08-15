import React, { useState, useCallback } from 'react';
import { Card, Title, Text, Button, Badge, Grid, Flex, Dialog, DialogPanel } from '@tremor/react';
import { 
  PlusIcon, 
  MagnifyingGlassIcon, 
  FunnelIcon,
  DocumentTextIcon,
  CalendarDaysIcon,
  UserIcon,
  PhoneIcon,
  MapPinIcon,
  HeartIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XMarkIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';
import { useDeathRegisterManagement } from '../../hooks/useDeathRegister';
import { DeathRegister, BurialType, DeathRegisterFilterInput } from '../../types/deathRegister';
import { formatDate, formatDateTime } from '../../utils/dateUtils';
import { toast } from 'react-hot-toast';

interface DeathRegisterManagementProps {
  organisationId: string;
  branchId?: string;
}

export const DeathRegisterManagement: React.FC<DeathRegisterManagementProps> = ({
  organisationId,
  branchId,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<DeathRegister | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<string | null>(null);

  const [filters, setFilters] = useState<DeathRegisterFilterInput>({
    organisationId,
    branchId,
    searchTerm: '',
    take: 20,
    skip: 0,
    sortBy: 'dateOfDeath',
    sortOrder: 'desc',
  });

  const {
    deathRegisters,
    loading,
    error,
    refetch,
    createDeathRegister,
    updateDeathRegister,
    deleteDeathRegister,
    markFamilyNotified,
    stats,
    statsLoading,
  } = useDeathRegisterManagement(filters);

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
    setFilters(prev => ({
      ...prev,
      searchTerm: term,
      skip: 0,
    }));
  }, []);

  const handleFilterChange = useCallback((newFilters: Partial<DeathRegisterFilterInput>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      skip: 0,
    }));
  }, []);

  const handleView = useCallback((record: DeathRegister) => {
    setSelectedRecord(record);
    setShowViewModal(true);
  }, []);

  const handleEdit = useCallback((record: DeathRegister) => {
    setSelectedRecord(record);
    setShowEditModal(true);
  }, []);

  const handleDelete = useCallback((id: string) => {
    setRecordToDelete(id);
    setShowDeleteConfirm(true);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!recordToDelete) return;
    
    try {
      await deleteDeathRegister(recordToDelete);
      toast.success('Death register deleted successfully');
      setShowDeleteConfirm(false);
      setRecordToDelete(null);
    } catch (error) {
      toast.error('Failed to delete death register');
      console.error('Delete error:', error);
    }
  }, [recordToDelete, deleteDeathRegister]);

  const handleMarkFamilyNotified = useCallback(async (id: string) => {
    try {
      await markFamilyNotified(id);
      toast.success('Family marked as notified');
    } catch (error) {
      toast.error('Failed to mark family as notified');
      console.error('Mark notified error:', error);
    }
  }, [markFamilyNotified]);

  const getAgeAtDeath = (dateOfBirth?: Date, dateOfDeath?: Date) => {
    if (!dateOfBirth || !dateOfDeath) return 'Unknown';
    const birth = new Date(dateOfBirth);
    const death = new Date(dateOfDeath);
    const age = death.getFullYear() - birth.getFullYear();
    return `${age} years`;
  };

  const getBurialTypeIcon = (type: BurialType) => {
    return type === BurialType.BURIAL ? '⚰️' : '🔥';
  };

  const getBurialTypeColor = (type: BurialType) => {
    return type === BurialType.BURIAL ? 'blue' : 'orange';
  };

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <Title className="text-red-600 mb-2">Error Loading Death Registers</Title>
          <Text className="text-gray-600 mb-4">{error.message}</Text>
          <Button onClick={() => refetch()} variant="primary">
            Try Again
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <Title className="text-2xl font-bold text-gray-900">Death Register</Title>
          <Text className="text-gray-600">Manage deceased member records and memorial information</Text>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          variant="primary"
          icon={PlusIcon}
        >
          Add Death Record
        </Button>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <Grid numItems={1} numItemsSm={2} numItemsLg={4} className="gap-4">
          <Card className="p-4">
            <Flex alignItems="center" className="space-x-2">
              <UserIcon className="h-8 w-8 text-gray-500" />
              <div>
                <Text className="text-sm text-gray-600">Total Records</Text>
                <Title className="text-2xl font-bold">{stats.total}</Title>
              </div>
            </Flex>
          </Card>
          
          <Card className="p-4">
            <Flex alignItems="center" className="space-x-2">
              <CalendarDaysIcon className="h-8 w-8 text-blue-500" />
              <div>
                <Text className="text-sm text-gray-600">This Year</Text>
                <Title className="text-2xl font-bold text-blue-600">{stats.thisYear}</Title>
              </div>
            </Flex>
          </Card>
          
          <Card className="p-4">
            <Flex alignItems="center" className="space-x-2">
              <HeartIcon className="h-8 w-8 text-red-500" />
              <div>
                <Text className="text-sm text-gray-600">Average Age</Text>
                <Title className="text-2xl font-bold text-red-600">{stats.averageAge}</Title>
              </div>
            </Flex>
          </Card>
          
          <Card className="p-4">
            <Flex alignItems="center" className="space-x-2">
              <CheckCircleIcon className="h-8 w-8 text-green-500" />
              <div>
                <Text className="text-sm text-gray-600">Family Notified</Text>
                <Title className="text-2xl font-bold text-green-600">{stats.familyNotifiedCount}</Title>
              </div>
            </Flex>
          </Card>
        </Grid>
      )}

      {/* Search and Filters */}
      <Card className="p-4">
        <Flex className="space-x-4">
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by member name, place of death, or next of kin..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
          </div>
          <Button
            variant="secondary"
            icon={FunnelIcon}
            onClick={() => setShowFilters(!showFilters)}
          >
            Filters
          </Button>
        </Flex>

        {/* Filter Panel */}
        {showFilters && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <Grid numItems={1} numItemsSm={2} numItemsLg={4} className="gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date From
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  onChange={(e) => handleFilterChange({ 
                    dateFrom: e.target.value ? new Date(e.target.value) : undefined 
                  })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date To
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  onChange={(e) => handleFilterChange({ 
                    dateTo: e.target.value ? new Date(e.target.value) : undefined 
                  })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Burial Type
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  onChange={(e) => handleFilterChange({ 
                    burialType: e.target.value as BurialType || undefined 
                  })}
                >
                  <option value="">All Types</option>
                  <option value={BurialType.BURIAL}>Burial</option>
                  <option value={BurialType.CREMATION}>Cremation</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Family Notified
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  onChange={(e) => handleFilterChange({ 
                    familyNotified: e.target.value === 'true' ? true : e.target.value === 'false' ? false : undefined 
                  })}
                >
                  <option value="">All</option>
                  <option value="true">Notified</option>
                  <option value="false">Not Notified</option>
                </select>
              </div>
            </Grid>
          </div>
        )}
      </Card>

      {/* Death Register List */}
      <Card>
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <Text className="mt-4 text-gray-600">Loading death registers...</Text>
          </div>
        ) : deathRegisters.length === 0 ? (
          <div className="p-8 text-center">
            <UserIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <Title className="text-gray-600 mb-2">No Death Records Found</Title>
            <Text className="text-gray-500 mb-4">
              {searchTerm ? 'No records match your search criteria.' : 'Start by adding a death record.'}
            </Text>
            <Button onClick={() => setShowCreateModal(true)} variant="primary">
              Add First Record
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {deathRegisters.map((record) => (
              <div key={record.id} className="p-6 hover:bg-gray-50 transition-colors">
                <Flex justifyContent="between" alignItems="start">
                  <div className="flex-1">
                    <Flex alignItems="center" className="space-x-3 mb-2">
                      <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                        {record.member.profileImageUrl ? (
                          <img
                            src={record.member.profileImageUrl}
                            alt={`${record.member.firstName} ${record.member.lastName}`}
                            className="h-12 w-12 rounded-full object-cover"
                          />
                        ) : (
                          <UserIcon className="h-6 w-6 text-gray-500" />
                        )}
                      </div>
                      <div>
                        <Title className="text-lg font-semibold">
                          {record.member.firstName} {record.member.middleName} {record.member.lastName}
                        </Title>
                        <Text className="text-gray-600">
                          {getAgeAtDeath(record.member.dateOfBirth, record.dateOfDeath)} • 
                          Died {formatDate(record.dateOfDeath)}
                        </Text>
                      </div>
                    </Flex>

                    <Grid numItems={1} numItemsSm={2} numItemsLg={3} className="gap-4 mt-4">
                      <div className="flex items-center space-x-2">
                        <MapPinIcon className="h-4 w-4 text-gray-500" />
                        <Text className="text-sm">{record.placeOfDeath}</Text>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <PhoneIcon className="h-4 w-4 text-gray-500" />
                        <Text className="text-sm">{record.nextOfKin}</Text>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{getBurialTypeIcon(record.burialCremation)}</span>
                        <Badge color={getBurialTypeColor(record.burialCremation)}>
                          {record.burialCremation}
                        </Badge>
                      </div>
                    </Grid>

                    <Flex className="mt-4 space-x-2">
                      <Badge color={record.familyNotified ? 'green' : 'red'}>
                        {record.familyNotified ? 'Family Notified' : 'Family Not Notified'}
                      </Badge>
                      
                      {record.funeralEvent && (
                        <Badge color="blue">
                          Funeral Service Scheduled
                        </Badge>
                      )}
                      
                      {record.deathCertificateUrl && (
                        <Badge color="gray">
                          Certificate Available
                        </Badge>
                      )}
                    </Flex>
                  </div>

                  <div className="flex space-x-2 ml-4">
                    <Button
                      size="xs"
                      variant="secondary"
                      icon={EyeIcon}
                      onClick={() => handleView(record)}
                    >
                      View
                    </Button>
                    
                    <Button
                      size="xs"
                      variant="secondary"
                      icon={PencilIcon}
                      onClick={() => handleEdit(record)}
                    >
                      Edit
                    </Button>
                    
                    {!record.familyNotified && (
                      <Button
                        size="xs"
                        variant="primary"
                        icon={CheckCircleIcon}
                        onClick={() => handleMarkFamilyNotified(record.id)}
                      >
                        Mark Notified
                      </Button>
                    )}
                    
                    <Button
                      size="xs"
                      variant="secondary"
                      color="red"
                      icon={TrashIcon}
                      onClick={() => handleDelete(record.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </Flex>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)}>
        <DialogPanel className="max-w-md">
          <div className="flex items-center space-x-3 mb-4">
            <ExclamationTriangleIcon className="h-8 w-8 text-red-500" />
            <Title className="text-lg font-semibold">Confirm Deletion</Title>
          </div>
          
          <Text className="text-gray-600 mb-6">
            Are you sure you want to delete this death register? This action cannot be undone.
          </Text>
          
          <Flex justifyContent="end" className="space-x-3">
            <Button
              variant="secondary"
              onClick={() => setShowDeleteConfirm(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              color="red"
              onClick={confirmDelete}
            >
              Delete
            </Button>
          </Flex>
        </DialogPanel>
      </Dialog>

      {/* TODO: Add modals for Create, Edit, and View */}
      {/* These will be implemented in separate components */}
    </div>
  );
};
