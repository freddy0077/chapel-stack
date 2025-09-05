import { useRef, useCallback } from "react";
import { SACRAMENT_TYPES, type SacramentType } from "./useSacramentModals";

// Type for refetch function
type RefetchFunction = (() => void) | null;

// Interface for refetch manager
interface SacramentRefetchManager {
  // Register refetch functions
  registerRefetch: (
    sacramentType: SacramentType,
    refetchFn: RefetchFunction,
  ) => void;

  // Trigger refetch for specific sacrament
  refetchSacrament: (sacramentType: SacramentType) => void;

  // Trigger refetch for all sacraments
  refetchAll: () => void;

  // Get individual refs for backward compatibility
  baptismRefetchRef: React.MutableRefObject<RefetchFunction>;
  communionRefetchRef: React.MutableRefObject<RefetchFunction>;
  confirmationRefetchRef: React.MutableRefObject<RefetchFunction>;
  marriageRefetchRef: React.MutableRefObject<RefetchFunction>;
  reconciliationRefetchRef: React.MutableRefObject<RefetchFunction>;
  anointingRefetchRef: React.MutableRefObject<RefetchFunction>;
  diaconateRefetchRef: React.MutableRefObject<RefetchFunction>;
  priesthoodRefetchRef: React.MutableRefObject<RefetchFunction>;
  rciaRefetchRef: React.MutableRefObject<RefetchFunction>;
}

export function useSacramentRefetch(): SacramentRefetchManager {
  // Individual refs for each sacrament type
  const baptismRefetchRef = useRef<RefetchFunction>(null);
  const communionRefetchRef = useRef<RefetchFunction>(null);
  const confirmationRefetchRef = useRef<RefetchFunction>(null);
  const marriageRefetchRef = useRef<RefetchFunction>(null);
  const reconciliationRefetchRef = useRef<RefetchFunction>(null);
  const anointingRefetchRef = useRef<RefetchFunction>(null);
  const diaconateRefetchRef = useRef<RefetchFunction>(null);
  const priesthoodRefetchRef = useRef<RefetchFunction>(null);
  const rciaRefetchRef = useRef<RefetchFunction>(null);

  // Map sacrament types to their corresponding refs
  const refMap = useRef(
    new Map<SacramentType, React.MutableRefObject<RefetchFunction>>([
      [SACRAMENT_TYPES.BAPTISM, baptismRefetchRef],
      [SACRAMENT_TYPES.COMMUNION, communionRefetchRef],
      [SACRAMENT_TYPES.CONFIRMATION, confirmationRefetchRef],
      [SACRAMENT_TYPES.MARRIAGE, marriageRefetchRef],
      [SACRAMENT_TYPES.RECONCILIATION, reconciliationRefetchRef],
      [SACRAMENT_TYPES.ANOINTING, anointingRefetchRef],
      [SACRAMENT_TYPES.DIACONATE, diaconateRefetchRef],
      [SACRAMENT_TYPES.PRIESTHOOD, priesthoodRefetchRef],
      [SACRAMENT_TYPES.RCIA, rciaRefetchRef],
    ]),
  );

  // Register a refetch function for a specific sacrament type
  const registerRefetch = useCallback(
    (sacramentType: SacramentType, refetchFn: RefetchFunction) => {
      const ref = refMap.current.get(sacramentType);
      if (ref) {
        ref.current = refetchFn;
      }
    },
    [],
  );

  // Trigger refetch for a specific sacrament type
  const refetchSacrament = useCallback((sacramentType: SacramentType) => {
    const ref = refMap.current.get(sacramentType);
    if (ref?.current) {
      try {
        ref.current();
      } catch (error) {
        console.error(`Error refetching ${sacramentType} records:`, error);
      }
    }
  }, []);

  // Trigger refetch for all sacrament types
  const refetchAll = useCallback(() => {
    refMap.current.forEach((ref, sacramentType) => {
      if (ref.current) {
        try {
          ref.current();
        } catch (error) {
          console.error(`Error refetching ${sacramentType} records:`, error);
        }
      }
    });
  }, []);

  return {
    // Core functionality
    registerRefetch,
    refetchSacrament,
    refetchAll,

    // Individual refs for backward compatibility
    baptismRefetchRef,
    communionRefetchRef,
    confirmationRefetchRef,
    marriageRefetchRef,
    reconciliationRefetchRef,
    anointingRefetchRef,
    diaconateRefetchRef,
    priesthoodRefetchRef,
    rciaRefetchRef,
  };
}
