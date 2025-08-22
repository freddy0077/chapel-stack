"use client";

import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';

// Import modal components
import UniversalSacramentModal from "./UniversalSacramentModal";
import MarriageAnalyticsDashboard from './MarriageAnalyticsDashboard';
import MemberMarriageHistoryCard from './MemberMarriageHistoryCard';

interface SacramentModalManagerProps {
  // Modal states for all sacrament types
  isBaptismModalOpen: boolean;
  isCommunionModalOpen: boolean;
  isConfirmationModalOpen: boolean;
  isMarriageModalOpen: boolean;
  isReconciliationModalOpen: boolean;
  isAnointingModalOpen: boolean;
  isDiaconateModalOpen: boolean;
  isPriesthoodModalOpen: boolean;
  isRciaModalOpen: boolean;
  isMarriageAnalyticsOpen: boolean;
  isMemberMarriageHistoryOpen: boolean;
  
  // Modal setters for all sacrament types
  setIsBaptismModalOpen: (open: boolean) => void;
  setIsCommunionModalOpen: (open: boolean) => void;
  setIsConfirmationModalOpen: (open: boolean) => void;
  setIsMarriageModalOpen: (open: boolean) => void;
  setIsReconciliationModalOpen: (open: boolean) => void;
  setIsAnointingModalOpen: (open: boolean) => void;
  setIsDiaconateModalOpen: (open: boolean) => void;
  setIsPriesthoodModalOpen: (open: boolean) => void;
  setIsRciaModalOpen: (open: boolean) => void;
  setIsMarriageAnalyticsOpen: (open: boolean) => void;
  setIsMemberMarriageHistoryOpen: (open: boolean) => void;
  
  // Refetch refs for all sacrament types
  baptismRefetchRef: React.MutableRefObject<(() => void) | null>;
  communionRefetchRef: React.MutableRefObject<(() => void) | null>;
  confirmationRefetchRef: React.MutableRefObject<(() => void) | null>;
  marriageRefetchRef: React.MutableRefObject<(() => void) | null>;
  reconciliationRefetchRef: React.MutableRefObject<(() => void) | null>;
  anointingRefetchRef: React.MutableRefObject<(() => void) | null>;
  diaconateRefetchRef: React.MutableRefObject<(() => void) | null>;
  priesthoodRefetchRef: React.MutableRefObject<(() => void) | null>;
  rciaRefetchRef: React.MutableRefObject<(() => void) | null>;
  selectedMemberId: string | null;
}

export default function SacramentModalManager({
  // Modal states
  isBaptismModalOpen,
  isCommunionModalOpen,
  isConfirmationModalOpen,
  isMarriageModalOpen,
  isReconciliationModalOpen,
  isAnointingModalOpen,
  isDiaconateModalOpen,
  isPriesthoodModalOpen,
  isRciaModalOpen,
  isMarriageAnalyticsOpen,
  isMemberMarriageHistoryOpen,
  
  // Modal setters
  setIsBaptismModalOpen,
  setIsCommunionModalOpen,
  setIsConfirmationModalOpen,
  setIsMarriageModalOpen,
  setIsReconciliationModalOpen,
  setIsAnointingModalOpen,
  setIsDiaconateModalOpen,
  setIsPriesthoodModalOpen,
  setIsRciaModalOpen,
  setIsMarriageAnalyticsOpen,
  setIsMemberMarriageHistoryOpen,
  
  // Refetch refs
  baptismRefetchRef,
  communionRefetchRef,
  confirmationRefetchRef,
  marriageRefetchRef,
  reconciliationRefetchRef,
  anointingRefetchRef,
  diaconateRefetchRef,
  priesthoodRefetchRef,
  rciaRefetchRef,
  selectedMemberId,
}: SacramentModalManagerProps) {

  const handleSuccess = (refetchRef: React.MutableRefObject<(() => void) | null>) => {
    refetchRef.current?.();
    toast.success("Record created successfully!");
  };

  return (
    <>
      {/* Universal modals for all sacrament types */}
      <UniversalSacramentModal
        isOpen={isBaptismModalOpen}
        onClose={() => setIsBaptismModalOpen(false)}
        sacramentType="BAPTISM"
        onSuccess={() => handleSuccess(baptismRefetchRef)}
      />

      <UniversalSacramentModal
        isOpen={isCommunionModalOpen}
        onClose={() => setIsCommunionModalOpen(false)}
        sacramentType="EUCHARIST_FIRST_COMMUNION"
        onSuccess={() => handleSuccess(communionRefetchRef)}
      />

      <UniversalSacramentModal
        isOpen={isConfirmationModalOpen}
        onClose={() => setIsConfirmationModalOpen(false)}
        sacramentType="CONFIRMATION"
        onSuccess={() => handleSuccess(confirmationRefetchRef)}
      />

      <UniversalSacramentModal
        isOpen={isMarriageModalOpen}
        onClose={() => setIsMarriageModalOpen(false)}
        sacramentType="MARRIAGE"
        onSuccess={() => handleSuccess(marriageRefetchRef)}
      />

      <UniversalSacramentModal
        isOpen={isReconciliationModalOpen}
        onClose={() => setIsReconciliationModalOpen(false)}
        sacramentType="RECONCILIATION_FIRST"
        onSuccess={() => handleSuccess(reconciliationRefetchRef)}
      />

      <UniversalSacramentModal
        isOpen={isAnointingModalOpen}
        onClose={() => setIsAnointingModalOpen(false)}
        sacramentType="ANOINTING_OF_THE_SICK"
        onSuccess={() => handleSuccess(anointingRefetchRef)}
      />

      <UniversalSacramentModal
        isOpen={isDiaconateModalOpen}
        onClose={() => setIsDiaconateModalOpen(false)}
        sacramentType="HOLY_ORDERS_DIACONATE"
        onSuccess={() => handleSuccess(diaconateRefetchRef)}
      />

      <UniversalSacramentModal
        isOpen={isPriesthoodModalOpen}
        onClose={() => setIsPriesthoodModalOpen(false)}
        sacramentType="HOLY_ORDERS_PRIESTHOOD"
        onSuccess={() => handleSuccess(priesthoodRefetchRef)}
      />

      <UniversalSacramentModal
        isOpen={isRciaModalOpen}
        onClose={() => setIsRciaModalOpen(false)}
        sacramentType="RCIA_INITIATION"
        onSuccess={() => handleSuccess(rciaRefetchRef)}
      />

      {/* Marriage analytics dashboard modal */}
      <Dialog open={isMarriageAnalyticsOpen} onOpenChange={setIsMarriageAnalyticsOpen}>
        <DialogTitle>Marriage Analytics Dashboard</DialogTitle>
        <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
          <MarriageAnalyticsDashboard
            onClose={() => setIsMarriageAnalyticsOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Member marriage history modal */}
      <Dialog open={isMemberMarriageHistoryOpen} onOpenChange={setIsMemberMarriageHistoryOpen}>
        <DialogTitle>Member Marriage History</DialogTitle>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <MemberMarriageHistoryCard
            memberId={selectedMemberId || ''}
            onClose={() => setIsMemberMarriageHistoryOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
