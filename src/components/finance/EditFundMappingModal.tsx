import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
  FundInfo,
  ContributionTypeFundMapping,
  UpdateContributionTypeFundMappingInput,
} from "@/graphql/hooks/useFundMapping";

interface EditFundMappingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (input: UpdateContributionTypeFundMappingInput) => Promise<any>;
  mapping: ContributionTypeFundMapping | null;
  availableFunds: FundInfo[];
  loading: boolean;
}

export function EditFundMappingModal({
  isOpen,
  onClose,
  onSubmit,
  mapping,
  availableFunds,
  loading,
}: EditFundMappingModalProps) {
  const [fundId, setFundId] = useState("");
  const [isActive, setIsActive] = useState(true);

  const activeFunds = availableFunds.filter((f) => f.isActive);

  // Reset form when mapping changes
  useEffect(() => {
    if (mapping) {
      setFundId(mapping.fundId);
      setIsActive(mapping.isActive);
    } else {
      setFundId("");
      setIsActive(true);
    }
  }, [mapping]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!mapping) {
      toast.error("No mapping selected");
      return;
    }

    if (!fundId) {
      toast.error("Please select a fund");
      return;
    }

    try {
      await onSubmit({
        id: mapping.id,
        fundId,
        isActive,
      });

      toast.success("Fund mapping updated successfully");
    } catch (error) {
      toast.error("Failed to update fund mapping");
      console.error("Update fund mapping error:", error);
    }
  };

  const handleClose = () => {
    setFundId("");
    setIsActive(true);
    onClose();
  };

  if (!mapping) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Fund Mapping</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {/* Contribution Type (Read-only) */}
            <div className="space-y-2">
              <Label>Contribution Type</Label>
              <div className="p-3 bg-muted rounded-md">
                <div className="font-medium">
                  {mapping.contributionType?.name || "Unknown"}
                </div>
                {mapping.contributionType?.description && (
                  <div className="text-sm text-muted-foreground">
                    {mapping.contributionType.description}
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Contribution type cannot be changed. Delete and create a new
                mapping if needed.
              </p>
            </div>

            {/* Fund Selection */}
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

            {/* Active Status */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="isActive">Active Status</Label>
                <div className="text-sm text-muted-foreground">
                  Inactive mappings will not be used for automatic fund
                  allocation
                </div>
              </div>
              <Switch
                id="isActive"
                checked={isActive}
                onCheckedChange={setIsActive}
                disabled={loading}
              />
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
            <Button type="submit" disabled={loading || !fundId}>
              {loading ? "Updating..." : "Update Mapping"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
