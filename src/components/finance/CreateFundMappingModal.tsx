import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Plus, Target, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';
import {
  ContributionTypeInfo,
  FundInfo,
  ContributionTypeFundMapping,
  CreateContributionTypeFundMappingInput,
} from '@/graphql/hooks/useFundMapping';

interface CreateFundMappingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (input: CreateContributionTypeFundMappingInput) => Promise<any>;
  availableContributionTypes: ContributionTypeInfo[];
  availableFunds: FundInfo[];
  existingMappings: ContributionTypeFundMapping[];
  loading: boolean;
}

export function CreateFundMappingModal({
  isOpen,
  onClose,
  onSubmit,
  availableContributionTypes,
  availableFunds,
  existingMappings,
  loading,
}: CreateFundMappingModalProps) {
  const [contributionTypeId, setContributionTypeId] = useState('');
  const [fundId, setFundId] = useState('');

  // Filter out contribution types that already have mappings
  const mappedContributionTypeIds = new Set(existingMappings.map(m => m.contributionTypeId));
  const unmappedContributionTypes = availableContributionTypes.filter(
    ct => !mappedContributionTypeIds.has(ct.id)
  );

  const selectedContributionType = availableContributionTypes.find(ct => ct.id === contributionTypeId);
  const selectedFund = availableFunds.find(f => f.id === fundId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!contributionTypeId || !fundId) {
      toast.error('Please select both a contribution type and fund');
      return;
    }

    try {
      await onSubmit({
        contributionTypeId,
        fundId,
        isActive: true,
      });
      
      // Reset form
      setContributionTypeId('');
      setFundId('');
      onClose();
      toast.success('Fund mapping created successfully');
    } catch (error) {
      console.error('Error creating fund mapping:', error);
      toast.error('Failed to create fund mapping');
    }
  };

  const handleClose = () => {
    setContributionTypeId('');
    setFundId('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        {/* Modern Gradient Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 -m-6 mb-6 p-6 text-white rounded-t-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-3 text-xl font-bold">
              <div className="p-2 bg-white/20 rounded-lg">
                <Plus className="h-5 w-5" />
              </div>
              <span>Create Fund Mapping</span>
            </DialogTitle>
            <p className="text-indigo-100 mt-2">
              Map a contribution type to automatically allocate funds
            </p>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Contribution Type Selection */}
          <div className="space-y-3">
            <Label htmlFor="contributionType" className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
              <Target className="h-4 w-4 text-indigo-600" />
              <span>Contribution Type</span>
            </Label>
            <Select value={contributionTypeId} onValueChange={setContributionTypeId}>
              <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200">
                <SelectValue placeholder="Select a contribution type..." />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 shadow-lg rounded-lg">
                {unmappedContributionTypes.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    <AlertCircle className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm">All contribution types are already mapped</p>
                  </div>
                ) : (
                  unmappedContributionTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id} className="py-3 hover:bg-gray-50 focus:bg-gray-50">
                      <div>
                        <div className="font-medium">{type.name}</div>
                        {type.description && (
                          <div className="text-sm text-gray-500">{type.description}</div>
                        )}
                      </div>
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            {selectedContributionType && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">
                    {selectedContributionType.name}
                  </span>
                </div>
                {selectedContributionType.description && (
                  <p className="text-sm text-blue-600 mt-1 ml-6">
                    {selectedContributionType.description}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Arrow Indicator */}
          {contributionTypeId && (
            <div className="flex justify-center">
              <div className="flex items-center space-x-2 text-gray-400">
                <div className="h-px bg-gray-300 w-8"></div>
                <ArrowRight className="h-5 w-5" />
                <div className="h-px bg-gray-300 w-8"></div>
              </div>
            </div>
          )}

          {/* Fund Selection */}
          <div className="space-y-3">
            <Label htmlFor="fund" className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
              <Target className="h-4 w-4 text-purple-600" />
              <span>Target Fund</span>
            </Label>
            <Select value={fundId} onValueChange={setFundId}>
              <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200">
                <SelectValue placeholder="Select a fund..." />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 shadow-lg rounded-lg">
                {availableFunds.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    <AlertCircle className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm">No funds available</p>
                  </div>
                ) : (
                  availableFunds.map((fund) => (
                    <SelectItem key={fund.id} value={fund.id} className="py-3 hover:bg-gray-50 focus:bg-gray-50">
                      <div>
                        <div className="font-medium">{fund.name}</div>
                        {fund.description && (
                          <div className="text-sm text-gray-500">{fund.description}</div>
                        )}
                      </div>
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            {selectedFund && (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium text-purple-800">
                    {selectedFund.name}
                  </span>
                </div>
                {selectedFund.description && (
                  <p className="text-sm text-purple-600 mt-1 ml-6">
                    {selectedFund.description}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Preview */}
          {contributionTypeId && fundId && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="font-semibold text-green-800">Mapping Preview</span>
              </div>
              <p className="text-sm text-green-700">
                All <strong>{selectedContributionType?.name}</strong> contributions will be automatically allocated to the <strong>{selectedFund?.name}</strong> fund.
              </p>
            </div>
          )}

          <DialogFooter className="flex space-x-3 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1 h-11"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!contributionTypeId || !fundId || loading}
              className="flex-1 h-11 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>Create Mapping</span>
                </div>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
