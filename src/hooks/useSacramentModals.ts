import { useReducer, useCallback } from 'react';

// Define sacrament types as constants
export const SACRAMENT_TYPES = {
  BAPTISM: 'baptism',
  COMMUNION: 'communion', 
  CONFIRMATION: 'confirmation',
  MARRIAGE: 'marriage',
  RECONCILIATION: 'reconciliation',
  ANOINTING: 'anointing',
  DIACONATE: 'diaconate',
  PRIESTHOOD: 'priesthood',
  RCIA: 'rcia',
} as const;

export type SacramentType = typeof SACRAMENT_TYPES[keyof typeof SACRAMENT_TYPES];

// Define additional modal types
export const MODAL_TYPES = {
  ...SACRAMENT_TYPES,
  DETAIL: 'detail',
  EDIT: 'edit',
  CERTIFICATE: 'certificate',
  MARRIAGE_ANALYTICS: 'marriageAnalytics',
  MEMBER_MARRIAGE_HISTORY: 'memberMarriageHistory',
} as const;

export type ModalType = typeof MODAL_TYPES[keyof typeof MODAL_TYPES];

// State interface
interface ModalState {
  openModals: Set<ModalType>;
  selectedRecord: any | null;
  selectedMemberId: string | null;
}

// Action types
type ModalAction =
  | { type: 'OPEN_MODAL'; modalType: ModalType }
  | { type: 'CLOSE_MODAL'; modalType: ModalType }
  | { type: 'CLOSE_ALL_MODALS' }
  | { type: 'SET_SELECTED_RECORD'; record: any | null }
  | { type: 'SET_SELECTED_MEMBER_ID'; memberId: string | null };

// Initial state
const initialState: ModalState = {
  openModals: new Set(),
  selectedRecord: null,
  selectedMemberId: null,
};

// Reducer function
function modalReducer(state: ModalState, action: ModalAction): ModalState {
  switch (action.type) {
    case 'OPEN_MODAL':
      return {
        ...state,
        openModals: new Set([...state.openModals, action.modalType]),
      };
    
    case 'CLOSE_MODAL':
      const newOpenModals = new Set(state.openModals);
      newOpenModals.delete(action.modalType);
      return {
        ...state,
        openModals: newOpenModals,
        // Clear selected data when closing detail/edit modals
        selectedRecord: action.modalType === MODAL_TYPES.DETAIL || action.modalType === MODAL_TYPES.EDIT 
          ? null 
          : state.selectedRecord,
        selectedMemberId: action.modalType === MODAL_TYPES.MEMBER_MARRIAGE_HISTORY 
          ? null 
          : state.selectedMemberId,
      };
    
    case 'CLOSE_ALL_MODALS':
      return {
        ...state,
        openModals: new Set(),
        selectedRecord: null,
        selectedMemberId: null,
      };
    
    case 'SET_SELECTED_RECORD':
      return {
        ...state,
        selectedRecord: action.record,
      };
    
    case 'SET_SELECTED_MEMBER_ID':
      return {
        ...state,
        selectedMemberId: action.memberId,
      };
    
    default:
      return state;
  }
}

// Custom hook
export function useSacramentModals() {
  const [state, dispatch] = useReducer(modalReducer, initialState);

  // Memoized action creators
  const openModal = useCallback((modalType: ModalType) => {
    dispatch({ type: 'OPEN_MODAL', modalType });
  }, []);

  const closeModal = useCallback((modalType: ModalType) => {
    dispatch({ type: 'CLOSE_MODAL', modalType });
  }, []);

  const closeAllModals = useCallback(() => {
    dispatch({ type: 'CLOSE_ALL_MODALS' });
  }, []);

  const setSelectedRecord = useCallback((record: any | null) => {
    dispatch({ type: 'SET_SELECTED_RECORD', record });
  }, []);

  const setSelectedMemberId = useCallback((memberId: string | null) => {
    dispatch({ type: 'SET_SELECTED_MEMBER_ID', memberId });
  }, []);

  // Helper functions for checking modal states
  const isModalOpen = useCallback((modalType: ModalType) => {
    return state.openModals.has(modalType);
  }, [state.openModals]);

  // Convenience functions for sacrament modals
  const openSacramentModal = useCallback((sacramentType: SacramentType) => {
    openModal(sacramentType);
  }, [openModal]);

  const closeSacramentModal = useCallback((sacramentType: SacramentType) => {
    closeModal(sacramentType);
  }, [closeModal]);

  // Combined actions for common workflows
  const openDetailModal = useCallback((record: any) => {
    setSelectedRecord(record);
    openModal(MODAL_TYPES.DETAIL);
  }, [setSelectedRecord, openModal]);

  const openEditModal = useCallback((record: any) => {
    setSelectedRecord(record);
    openModal(MODAL_TYPES.EDIT);
  }, [setSelectedRecord, openModal]);

  const openCertificateModal = useCallback((record: any) => {
    setSelectedRecord(record);
    openModal(MODAL_TYPES.CERTIFICATE);
  }, [setSelectedRecord, openModal]);

  const openMarriageAnalytics = useCallback(() => {
    openModal(MODAL_TYPES.MARRIAGE_ANALYTICS);
  }, [openModal]);

  const openMemberMarriageHistory = useCallback((memberId: string) => {
    setSelectedMemberId(memberId);
    openModal(MODAL_TYPES.MEMBER_MARRIAGE_HISTORY);
  }, [setSelectedMemberId, openModal]);

  return {
    // State
    openModals: state.openModals,
    selectedRecord: state.selectedRecord,
    selectedMemberId: state.selectedMemberId,
    
    // Basic actions
    openModal,
    closeModal,
    closeAllModals,
    setSelectedRecord,
    setSelectedMemberId,
    
    // Helper functions
    isModalOpen,
    
    // Sacrament-specific actions
    openSacramentModal,
    closeSacramentModal,
    
    // Combined workflow actions
    openDetailModal,
    openEditModal,
    openCertificateModal,
    openMarriageAnalytics,
    openMemberMarriageHistory,
    
    // Individual sacrament modal states (for backward compatibility)
    isBaptismModalOpen: isModalOpen(MODAL_TYPES.BAPTISM),
    isCommunionModalOpen: isModalOpen(MODAL_TYPES.COMMUNION),
    isConfirmationModalOpen: isModalOpen(MODAL_TYPES.CONFIRMATION),
    isMarriageModalOpen: isModalOpen(MODAL_TYPES.MARRIAGE),
    isReconciliationModalOpen: isModalOpen(MODAL_TYPES.RECONCILIATION),
    isAnointingModalOpen: isModalOpen(MODAL_TYPES.ANOINTING),
    isDiaconateModalOpen: isModalOpen(MODAL_TYPES.DIACONATE),
    isPriesthoodModalOpen: isModalOpen(MODAL_TYPES.PRIESTHOOD),
    isRciaModalOpen: isModalOpen(MODAL_TYPES.RCIA),
    
    // Other modal states
    showDetailModal: isModalOpen(MODAL_TYPES.DETAIL),
    showEditModal: isModalOpen(MODAL_TYPES.EDIT),
    showCertificateManager: isModalOpen(MODAL_TYPES.CERTIFICATE),
    isMarriageAnalyticsOpen: isModalOpen(MODAL_TYPES.MARRIAGE_ANALYTICS),
    isMemberMarriageHistoryOpen: isModalOpen(MODAL_TYPES.MEMBER_MARRIAGE_HISTORY),
  };
}
