import { useState, useCallback, useRef } from "react";
import {
  SACRAMENT_TYPES,
  type SacramentType,
} from "@/constants/sacramentTypes";

interface LoadingState {
  isLoading: boolean;
  operation?: string;
  sacramentType?: SacramentType;
  recordId?: string;
}

interface SacramentLoadingManager {
  // Global loading state
  globalLoading: LoadingState;

  // Individual sacrament type loading states
  sacramentLoading: Record<SacramentType, LoadingState>;

  // Modal operation loading states
  modalLoading: {
    create: LoadingState;
    edit: LoadingState;
    delete: LoadingState;
    certificate: LoadingState;
    export: LoadingState;
  };

  // Actions
  setGlobalLoading: (loading: boolean, operation?: string) => void;
  setSacramentLoading: (
    sacramentType: SacramentType,
    loading: boolean,
    operation?: string,
  ) => void;
  setModalLoading: (
    modalType: keyof SacramentLoadingManager["modalLoading"],
    loading: boolean,
    operation?: string,
    recordId?: string,
  ) => void;

  // Utilities
  isAnyLoading: () => boolean;
  isOperationLoading: (operation: string) => boolean;
  clearAllLoading: () => void;

  // Async operation wrapper
  withLoading: <T>(
    operation: () => Promise<T>,
    loadingType:
      | "global"
      | SacramentType
      | keyof SacramentLoadingManager["modalLoading"],
    operationName?: string,
    recordId?: string,
  ) => Promise<T>;
}

/**
 * Custom hook for managing loading states across the sacraments page
 */
export function useSacramentLoading(): SacramentLoadingManager {
  // Initialize loading states
  const initialSacramentLoading = Object.values(SACRAMENT_TYPES).reduce(
    (acc, type) => ({
      ...acc,
      [type]: { isLoading: false },
    }),
    {} as Record<SacramentType, LoadingState>,
  );

  const [globalLoading, setGlobalLoadingState] = useState<LoadingState>({
    isLoading: false,
  });
  const [sacramentLoading, setSacramentLoadingState] = useState<
    Record<SacramentType, LoadingState>
  >(initialSacramentLoading);
  const [modalLoading, setModalLoadingState] = useState({
    create: { isLoading: false },
    edit: { isLoading: false },
    delete: { isLoading: false },
    certificate: { isLoading: false },
    export: { isLoading: false },
  });

  // Track active operations for cleanup
  const activeOperations = useRef<Set<string>>(new Set());

  const setGlobalLoading = useCallback(
    (loading: boolean, operation?: string) => {
      setGlobalLoadingState({ isLoading: loading, operation });

      if (operation) {
        if (loading) {
          activeOperations.current.add(operation);
        } else {
          activeOperations.current.delete(operation);
        }
      }
    },
    [],
  );

  const setSacramentLoading = useCallback(
    (sacramentType: SacramentType, loading: boolean, operation?: string) => {
      setSacramentLoadingState((prev) => ({
        ...prev,
        [sacramentType]: { isLoading: loading, operation, sacramentType },
      }));

      if (operation) {
        const operationKey = `${sacramentType}-${operation}`;
        if (loading) {
          activeOperations.current.add(operationKey);
        } else {
          activeOperations.current.delete(operationKey);
        }
      }
    },
    [],
  );

  const setModalLoading = useCallback(
    (
      modalType: keyof SacramentLoadingManager["modalLoading"],
      loading: boolean,
      operation?: string,
      recordId?: string,
    ) => {
      setModalLoadingState((prev) => ({
        ...prev,
        [modalType]: { isLoading: loading, operation, recordId },
      }));

      if (operation) {
        const operationKey = `modal-${modalType}-${operation}`;
        if (loading) {
          activeOperations.current.add(operationKey);
        } else {
          activeOperations.current.delete(operationKey);
        }
      }
    },
    [],
  );

  const isAnyLoading = useCallback(() => {
    if (globalLoading.isLoading) return true;

    if (Object.values(sacramentLoading).some((state) => state.isLoading))
      return true;

    if (Object.values(modalLoading).some((state) => state.isLoading))
      return true;

    return false;
  }, [globalLoading, sacramentLoading, modalLoading]);

  const isOperationLoading = useCallback((operation: string) => {
    return (
      activeOperations.current.has(operation) ||
      Array.from(activeOperations.current).some((op) => op.includes(operation))
    );
  }, []);

  const clearAllLoading = useCallback(() => {
    setGlobalLoadingState({ isLoading: false });
    setSacramentLoadingState(initialSacramentLoading);
    setModalLoadingState({
      create: { isLoading: false },
      edit: { isLoading: false },
      delete: { isLoading: false },
      certificate: { isLoading: false },
      export: { isLoading: false },
    });
    activeOperations.current.clear();
  }, [initialSacramentLoading]);

  const withLoading = useCallback(
    async <T>(
      operation: () => Promise<T>,
      loadingType:
        | "global"
        | SacramentType
        | keyof SacramentLoadingManager["modalLoading"],
      operationName?: string,
      recordId?: string,
    ): Promise<T> => {
      try {
        // Set loading state
        if (loadingType === "global") {
          setGlobalLoading(true, operationName);
        } else if (
          Object.values(SACRAMENT_TYPES).includes(loadingType as SacramentType)
        ) {
          setSacramentLoading(
            loadingType as SacramentType,
            true,
            operationName,
          );
        } else {
          setModalLoading(
            loadingType as keyof SacramentLoadingManager["modalLoading"],
            true,
            operationName,
            recordId,
          );
        }

        // Execute operation
        const result = await operation();

        return result;
      } catch (error) {
        // Re-throw error to be handled by caller
        throw error;
      } finally {
        // Clear loading state
        if (loadingType === "global") {
          setGlobalLoading(false);
        } else if (
          Object.values(SACRAMENT_TYPES).includes(loadingType as SacramentType)
        ) {
          setSacramentLoading(loadingType as SacramentType, false);
        } else {
          setModalLoading(
            loadingType as keyof SacramentLoadingManager["modalLoading"],
            false,
          );
        }
      }
    },
    [setGlobalLoading, setSacramentLoading, setModalLoading],
  );

  return {
    globalLoading,
    sacramentLoading,
    modalLoading,
    setGlobalLoading,
    setSacramentLoading,
    setModalLoading,
    isAnyLoading,
    isOperationLoading,
    clearAllLoading,
    withLoading,
  };
}

/**
 * Hook for getting loading state of a specific sacrament type
 */
export function useSacramentTypeLoading(sacramentType: SacramentType) {
  const { sacramentLoading, setSacramentLoading } = useSacramentLoading();

  return {
    loading: sacramentLoading[sacramentType],
    setLoading: (loading: boolean, operation?: string) =>
      setSacramentLoading(sacramentType, loading, operation),
  };
}

/**
 * Hook for getting modal loading states
 */
export function useModalLoading() {
  const { modalLoading, setModalLoading } = useSacramentLoading();

  return {
    loading: modalLoading,
    setLoading: setModalLoading,
    isCreateLoading: modalLoading.create.isLoading,
    isEditLoading: modalLoading.edit.isLoading,
    isDeleteLoading: modalLoading.delete.isLoading,
    isCertificateLoading: modalLoading.certificate.isLoading,
    isExportLoading: modalLoading.export.isLoading,
  };
}

export default useSacramentLoading;
