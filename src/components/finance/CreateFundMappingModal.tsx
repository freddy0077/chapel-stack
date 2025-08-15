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
    ct => ct.isActive && !mappedContributionTypeIds.has(ct.id)
  );

  const activeFunds = availableFunds.filter(f => f.isActive);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!contributionTypeId) {
      toast.error('Please select a contribution type');
      return;
    }

    if (!fundId) {
      toast.error('Please select a fund');
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
      
      toast.success('Fund mapping created successfully');
    } catch (error) {
      toast.error('Failed to create fund mapping');
      console.error('Create fund mapping error:', error);
    }
  };

  const handleClose = () => {
    setContributionTypeId('');
    setFundId('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Fund Mapping</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="contributionType">Contribution Type</Label>
              <Select
                value={contributionTypeId}
                onValueChange={setContributionTypeId}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select contribution type" />
                </SelectTrigger>
                <SelectContent>
                  {unmappedContributionTypes.length === 0 ? (
                    <div className="p-2 text-sm text-muted-foreground">
                      All contribution types have been mapped
                    </div>
                  ) : (
                    unmappedContributionTypes.map((ct) => (
                      <SelectItem key={ct.id} value={ct.id}>
                        <div>
                          <div className="font-medium">{ct.name}</div>
                          {ct.description && (
                            <div className="text-sm text-muted-foreground">
                              {ct.description}
                            </div>
                          )}
                        </div>
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fund">Fund</Label>
              <Select
                value={fundId}
                onValueChange={setFundId}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select fund" />
                </SelectTrigger>
                <SelectContent>
                  {activeFunds.length === 0 ? (
                    <div className="p-2 text-sm text-muted-foreground">
                      No active funds available
                    </div>
                  ) : (
                    activeFunds.map((fund) => (
                      <SelectItem key={fund.id} value={fund.id}>
                        <div>
                          <div className="font-medium">{fund.name}</div>
                          {fund.description && (
                            <div className="text-sm text-muted-foreground">
                              {fund.description}
                            </div>
                          )}
                        </div>
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !contributionTypeId || !fundId || unmappedContributionTypes.length === 0}
            >
              {loading ? 'Creating...' : 'Create Mapping'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
