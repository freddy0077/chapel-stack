import React, { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  Calendar,
  Heart,
  FileText,
  Eye,
  Pencil,
  Trash2,
  Filter,
  Plus as PlusIcon,
  Heart as HeartIcon,
  Eye as EyeIcon,
  Pencil as PencilIcon,
  Trash2 as TrashIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { motion, AnimatePresence } from 'framer-motion';
import BirthRegistryPagination from './BirthRegistryPagination';
import {
  useBirthRegisters,
  useDeleteBirthRegister,
  getBirthRegisterDisplayName,
  getParentDisplayName,
  calculateAge,
  calculateAgeInDays,
  getGenderIcon,
  getGenderColor,
  getBaptismStatusColor,
  getBaptismStatusText,
} from '@/graphql/hooks/useBirthRegistry';
import { BirthRegister } from '@/graphql/queries/birthQueries';
import { useOrganisationBranch } from '@/hooks/useOrganisationBranch';
import { BirthRegistryFilters } from './BirthRegistryFilters';

interface BirthRegisterListProps {
  onCreateNew: () => void;
  onViewDetails: (birthRegister: BirthRegister) => void;
  onEdit: (birthRegister: BirthRegister) => void;
  filters?: BirthRegistryFilters;
  hideHeader?: boolean;
  onFiltersChange?: (filters: BirthRegistryFilters) => void;
  totalRecords?: number;
}

const BirthRegisterList: React.FC<BirthRegisterListProps> = ({
  onCreateNew,
  onViewDetails,
  onEdit,
  filters = { take: 20, skip: 0 },
  hideHeader = false,
  onFiltersChange,
  totalRecords,
}) => {
  const { organisationId, branchId } = useOrganisationBranch();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const {
    birthRegisters,
    loading,
    error,
    refetch,
    fetchMore,
  } = useBirthRegisters(organisationId, branchId, filters);

  const { deleteRecord, loading: deleteLoading } = useDeleteBirthRegister();

  const handleDelete = async (id: string) => {
    try {
      await deleteRecord(id);
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting birth register:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (timeString?: string) => {
    if (!timeString) return '';
    return ` at ${timeString}`;
  };

  const getParentsDisplayName = (birthRegister: BirthRegister) => {
    const motherName = getParentDisplayName(
      birthRegister.motherFirstName,
      birthRegister.motherLastName
    );
    const fatherName = getParentDisplayName(
      birthRegister.fatherFirstName,
      birthRegister.fatherLastName
    );

    if (motherName === 'Unknown' && fatherName === 'Unknown') {
      return 'Unknown';
    } else if (motherName === 'Unknown') {
      return fatherName;
    } else if (fatherName === 'Unknown') {
      return motherName;
    } else {
      return `${motherName} & ${fatherName}`;
    }
  };

  const handlePageChange = (page: number) => {
    if (onFiltersChange) {
      const newFilters = {
        ...filters,
        skip: (page - 1) * (filters.take || 20),
      };
      onFiltersChange(newFilters);
    }
  };

  const handlePageSizeChange = (pageSize: number) => {
    if (onFiltersChange) {
      const newFilters = {
        ...filters,
        take: pageSize,
        skip: 0,
      };
      onFiltersChange(newFilters);
    }
  };

  if (error) {
    return (
      <Alert className="border-red-200 bg-red-50">
        <AlertDescription className="text-red-800">
          Error loading birth registers: {error.message}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      {!hideHeader && (
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Birth Registry</h1>
            <p className="text-gray-600 mt-1">
              Manage birth records and baptism planning
            </p>
          </div>
          <Button onClick={onCreateNew} className="flex items-center gap-2">
            <PlusIcon className="h-4 w-4" />
            Add Birth Record
          </Button>
        </div>
      )}

      {/* Birth Records List */}
      <div className="space-y-4">
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, index) => (
              <Card key={index} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <div className="w-3/4 h-4 bg-gray-200 rounded" />
                      <div className="w-1/2 h-3 bg-gray-200 rounded" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : birthRegisters.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <HeartIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No birth records found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {Object.keys(filters).some(key => key !== 'skip' && key !== 'take' && filters[key as keyof typeof filters])
                  ? 'Try adjusting your filters or search criteria.'
                  : 'Get started by creating your first birth record.'
                }
              </p>
              {!Object.keys(filters).some(key => key !== 'skip' && key !== 'take' && filters[key as keyof typeof filters]) && (
                <Button onClick={onCreateNew} className="mt-4">
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add Birth Record
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <>
            {birthRegisters.map((birthRegister, index) => (
              <motion.div
                key={birthRegister.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-blue-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-xl shadow-lg ${getGenderColor(birthRegister.childGender)}`}>
                          {getGenderIcon(birthRegister.childGender)}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 text-lg">
                            {getBirthRegisterDisplayName(birthRegister)}
                          </h3>
                          <p className="text-gray-600 text-sm">
                            {formatDate(birthRegister.dateOfBirth)}{formatTime(birthRegister.timeOfBirth)}
                          </p>
                          <p className="text-gray-500 text-xs">
                            {calculateAgeInDays(birthRegister.dateOfBirth)} days old
                          </p>
                        </div>
                        
                        {/* Parent Information */}
                        <div className="mt-2">
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Parents:</span> {getParentsDisplayName(birthRegister)}
                          </p>
                          <p className="text-sm text-gray-500">
                            <span className="font-medium">Location:</span> {birthRegister.placeOfBirth}
                            {birthRegister.hospitalName && ` - ${birthRegister.hospitalName}`}
                          </p>
                        </div>
                      </div>

                      {/* Badges and Status */}
                      <div className="flex flex-col items-end space-y-2">
                        <div className="flex space-x-2">
                          <Badge className={getBaptismStatusColor(birthRegister.baptismPlanned)}>
                            {getBaptismStatusText(birthRegister.baptismPlanned)}
                          </Badge>
                          {birthRegister.childMember && (
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                              Member Created
                            </Badge>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onViewDetails(birthRegister)}
                            className="flex items-center gap-1"
                          >
                            <EyeIcon className="h-3 w-3" />
                            View
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onEdit(birthRegister)}
                            className="flex items-center gap-1"
                          >
                            <PencilIcon className="h-3 w-3" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowDeleteConfirm(birthRegister.id)}
                            className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                            disabled={deleteLoading}
                          >
                            <TrashIcon className="h-3 w-3" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </>
        )}
      </div>

      {/* Pagination Controls */}
      {birthRegisters.length > 0 && onFiltersChange && (
        <BirthRegistryPagination
          currentPage={Math.floor((filters.skip || 0) / (filters.take || 20)) + 1}
          pageSize={filters.take || 20}
          totalRecords={totalRecords || birthRegisters.length}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          loading={loading}
        />
      )}

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowDeleteConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-lg p-6 max-w-md mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-medium text-gray-900 mb-2">Delete Birth Record</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this birth record? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteConfirm(null)}
                  disabled={deleteLoading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => handleDelete(showDeleteConfirm)}
                  disabled={deleteLoading}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {deleteLoading ? 'Deleting...' : 'Delete'}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BirthRegisterList;

