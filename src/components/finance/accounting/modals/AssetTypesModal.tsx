'use client';

import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import { GET_ASSET_TYPES, CREATE_ASSET_TYPE, UPDATE_ASSET_TYPE, DELETE_ASSET_TYPE } from '@/graphql/queries/assetQueries';

interface AssetTypesModalProps {
  open: boolean;
  onClose: () => void;
  organisationId: string;
  branchId: string;
}

export default function AssetTypesModal({
  open,
  onClose,
  organisationId,
  branchId,
}: AssetTypesModalProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [editingType, setEditingType] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    defaultDepreciationRate: 10,
  });

  const { data, loading, refetch } = useQuery(GET_ASSET_TYPES, {
    variables: { organisationId },
    skip: !organisationId,
  });

  const [createAssetType] = useMutation(CREATE_ASSET_TYPE, {
    onCompleted: () => {
      toast.success('Asset type created successfully!');
      refetch();
      resetForm();
    },
    onError: (error) => toast.error(error.message),
  });

  const [updateAssetType] = useMutation(UPDATE_ASSET_TYPE, {
    onCompleted: () => {
      toast.success('Asset type updated successfully!');
      refetch();
      resetForm();
    },
    onError: (error) => toast.error(error.message),
  });

  const [deleteAssetType] = useMutation(DELETE_ASSET_TYPE, {
    onCompleted: () => {
      toast.success('Asset type deleted successfully!');
      refetch();
    },
    onError: (error) => toast.error(error.message),
  });

  const assetTypes = data?.assetTypes || [];

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      defaultDepreciationRate: 10,
    });
    setIsCreating(false);
    setEditingType(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const input = {
      ...formData,
      organisationId,
      branchId,
    };

    if (editingType) {
      await updateAssetType({ variables: { input: { id: editingType.id, ...input } } });
    } else {
      await createAssetType({ variables: { input } });
    }
  };

  const handleEdit = (type: any) => {
    setEditingType(type);
    setFormData({
      name: type.name,
      description: type.description || '',
      defaultDepreciationRate: type.defaultDepreciationRate || 10,
    });
    setIsCreating(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this asset type?')) {
      await deleteAssetType({ variables: { id } });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Asset Types</DialogTitle>
          <p className="text-sm text-gray-500">Manage asset categories and their default settings</p>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* Create/Edit Form */}
          {isCreating ? (
            <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-gray-50 rounded-lg border">
              <h3 className="font-semibold text-lg">
                {editingType ? 'Edit Asset Type' : 'Create New Asset Type'}
              </h3>
              
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="depreciationRate">Default Depreciation Rate (% per year)</Label>
                <Input
                  id="depreciationRate"
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={formData.defaultDepreciationRate}
                  onChange={(e) => setFormData({ ...formData, defaultDepreciationRate: parseFloat(e.target.value) })}
                />
                <p className="text-xs text-gray-500 mt-1">Annual depreciation percentage (e.g., 10 for 10%)</p>
              </div>

              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingType ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          ) : (
            <Button onClick={() => setIsCreating(true)} className="w-full">
              <PlusIcon className="h-4 w-4 mr-2" />
              Add New Asset Type
            </Button>
          )}

          {/* Asset Types List */}
          <div className="space-y-3">
            {loading ? (
              <p className="text-center text-gray-500">Loading...</p>
            ) : assetTypes.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No asset types found. Create one to get started.</p>
            ) : (
              assetTypes.map((type: any) => (
                <div
                  key={type.id}
                  className="flex items-center justify-between p-4 bg-white border rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg">{type.name}</h4>
                    {type.description && (
                      <p className="text-sm text-gray-600 mt-1">{type.description}</p>
                    )}
                    {type.defaultDepreciationRate && (
                      <div className="flex gap-4 mt-2 text-sm text-gray-500">
                        <span>Depreciation Rate: {type.defaultDepreciationRate}% per year</span>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(type)}
                    >
                      <PencilIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(type.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
