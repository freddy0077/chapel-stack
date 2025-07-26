"use client";
import { useFilteredEvents } from "@/graphql/hooks/useFilteredEvents";
import { useOrganizationBranchFilter } from "@/hooks";
import { Event } from "@/graphql/types/event";
import { useAuth } from "@/contexts/AuthContextEnhanced";

interface CalendarLoaderProps {
  children: (
    events: Event[], 
    loading: boolean, 
    error: unknown, 
    refetch: () => void
  ) => React.ReactNode;
  startDate?: Date;
  endDate?: Date;
  category?: string;
}

export function CalendarLoader({ children, startDate, endDate, category }: CalendarLoaderProps) {
  const { user } = useAuth();
  const orgBranchFilter = useOrganizationBranchFilter();
  
  // Prepare filters based on user role and selected organization/branch
  const filters = {
    // Use branchId if available (for regular users or when a SUPER_ADMIN selects a branch)
    ...(orgBranchFilter.branchId ? { branchId: orgBranchFilter.branchId } : {}),
    
    // Use organisationId if available and no branchId (for SUPER_ADMIN users)
    ...(orgBranchFilter.organisationId && !orgBranchFilter.branchId ? 
      { organisationId: orgBranchFilter.organisationId } : {}),
    
    // Add date range filters if provided
    ...(startDate ? { startDate } : {}),
    ...(endDate ? { endDate } : {}),
    
    // Add category filter if provided
    ...(category && category !== 'all' ? { category } : {})
  };
  
  const { 
    events, 
    loading, 
    error, 
    refetch
  } = useFilteredEvents(
    Object.keys(filters).length > 0 ? filters : undefined
  );
  
  return children(events, loading, error, refetch);
}
