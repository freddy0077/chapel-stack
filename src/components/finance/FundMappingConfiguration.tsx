import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Plus, Settings, Trash2, Edit, MoreHorizontal, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { useFundMappingManager } from '@/graphql/hooks/useFundMapping';
import { useOrganisationBranch } from '@/hooks/useOrganisationBranch';
import { CreateFundMappingModal } from './CreateFundMappingModal';
import { EditFundMappingModal } from './EditFundMappingModal';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export function FundMappingConfiguration() {
  const { organisationId, branchId } = useOrganisationBranch();
  
  const {
    configuration,
    loading,
    error,
    selectedMapping,
    isCreateModalOpen,
    isEditModalOpen,
    openCreateModal,
    closeCreateModal,
    openEditModal,
    closeEditModal,
    handleCreate,
    handleUpdate,
    handleDelete,
    handleCreateDefaults,
    refetch,
    creating,
    updating,
    deleting,
    creatingDefaults,
  } = useFundMappingManager(branchId, organisationId);

  const handleDeleteMapping = async (id: string, contributionTypeName: string) => {
    try {
      await handleDelete(id);
      toast.success(`Fund mapping for ${contributionTypeName} deleted successfully`);
    } catch (error) {
      toast.error('Failed to delete fund mapping');
      console.error('Delete error:', error);
    }
  };

  const handleCreateDefaultMappings = async () => {
    try {
      await handleCreateDefaults();
      toast.success('Default fund mappings created successfully');
    } catch (error) {
      toast.error('Failed to create default fund mappings');
      console.error('Create defaults error:', error);
    }
  };

  const handleRefresh = async () => {
    try {
      await refetch();
      toast.success('Fund mappings refreshed');
    } catch (error) {
      toast.error('Failed to refresh fund mappings');
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Fund Allocation Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <LoadingSpinner />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Fund Allocation Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-red-600 mb-4">Error loading fund mappings</p>
            <Button onClick={handleRefresh} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const mappings = configuration?.mappings || [];
  const availableContributionTypes = configuration?.availableContributionTypes || [];
  const availableFunds = configuration?.availableFunds || [];

  // Find unmapped contribution types
  const mappedContributionTypeIds = new Set(mappings.map(m => m.contributionTypeId));
  const unmappedContributionTypes = availableContributionTypes.filter(
    ct => ct.isActive && !mappedContributionTypeIds.has(ct.id)
  );

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Fund Allocation Configuration</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Configure which funds each contribution type gets credited to automatically
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={handleRefresh}
                variant="outline"
                size="sm"
                disabled={loading}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              {mappings.length === 0 && availableContributionTypes.length > 0 && (
                <Button
                  onClick={handleCreateDefaultMappings}
                  variant="outline"
                  size="sm"
                  disabled={creatingDefaults}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  {creatingDefaults ? 'Creating...' : 'Create Defaults'}
                </Button>
              )}
              <Button onClick={openCreateModal} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Mapping
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {mappings.length === 0 ? (
            <div className="text-center py-8">
              <div className="mb-4">
                <Settings className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                <h3 className="text-lg font-medium">No Fund Mappings Configured</h3>
                <p className="text-muted-foreground">
                  Configure which funds each contribution type should be credited to
                </p>
              </div>
              {availableContributionTypes.length > 0 ? (
                <div className="space-y-2">
                  <Button onClick={handleCreateDefaultMappings} disabled={creatingDefaults}>
                    <Settings className="w-4 h-4 mr-2" />
                    {creatingDefaults ? 'Creating...' : 'Create Default Mappings'}
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Or create custom mappings manually
                  </p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Please create contribution types and funds first
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Contribution Type</TableHead>
                    <TableHead>Allocated Fund</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mappings.map((mapping) => (
                    <TableRow key={mapping.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {mapping.contributionType?.name || 'Unknown'}
                          </div>
                          {mapping.contributionType?.description && (
                            <div className="text-sm text-muted-foreground">
                              {mapping.contributionType.description}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {mapping.fund?.name || 'Unknown Fund'}
                          </div>
                          {mapping.fund?.description && (
                            <div className="text-sm text-muted-foreground">
                              {mapping.fund.description}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={mapping.isActive ? 'default' : 'secondary'}>
                          {mapping.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {new Date(mapping.updatedAt).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openEditModal(mapping)}>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem
                                  onSelect={(e) => e.preventDefault()}
                                  className="text-red-600"
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Fund Mapping</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete the fund mapping for{' '}
                                    <strong>{mapping.contributionType?.name}</strong>?
                                    This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() =>
                                      handleDeleteMapping(
                                        mapping.id,
                                        mapping.contributionType?.name || 'Unknown'
                                      )
                                    }
                                    disabled={deleting}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    {deleting ? 'Deleting...' : 'Delete'}
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {unmappedContributionTypes.length > 0 && (
                <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <h4 className="font-medium text-yellow-800 mb-2">
                    Unmapped Contribution Types
                  </h4>
                  <p className="text-sm text-yellow-700 mb-3">
                    The following contribution types don't have fund mappings configured:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {unmappedContributionTypes.map((ct) => (
                      <Badge key={ct.id} variant="outline" className="text-yellow-700">
                        {ct.name}
                      </Badge>
                    ))}
                  </div>
                  <Button
                    onClick={openCreateModal}
                    size="sm"
                    className="mt-3"
                    variant="outline"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Configure Mappings
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <CreateFundMappingModal
        isOpen={isCreateModalOpen}
        onClose={closeCreateModal}
        onSubmit={handleCreate}
        availableContributionTypes={availableContributionTypes}
        availableFunds={availableFunds}
        existingMappings={mappings}
        loading={creating}
      />

      <EditFundMappingModal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        onSubmit={handleUpdate}
        mapping={selectedMapping}
        availableFunds={availableFunds}
        loading={updating}
      />
    </>
  );
}
