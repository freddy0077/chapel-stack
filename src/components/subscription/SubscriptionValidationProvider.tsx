"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContextEnhanced';
import useSubscriptionValidation, { SubscriptionValidationResult } from '@/hooks/subscription/useSubscriptionValidation';
import SubscriptionValidationModal from './SubscriptionValidationModal';

interface SubscriptionValidationContextType {
  validationResult: SubscriptionValidationResult;
  isValidationModalOpen: boolean;
  showValidationModal: () => void;
  hideValidationModal: () => void;
  refetchValidation: () => void;
  loading: boolean;
}

const SubscriptionValidationContext = createContext<SubscriptionValidationContextType | undefined>(undefined);

export const useSubscriptionValidationContext = () => {
  const context = useContext(SubscriptionValidationContext);
  if (!context) {
    throw new Error('useSubscriptionValidationContext must be used within a SubscriptionValidationProvider');
  }
  return context;
};

interface SubscriptionValidationProviderProps {
  children: React.ReactNode;
}

export const SubscriptionValidationProvider: React.FC<SubscriptionValidationProviderProps> = ({
  children,
}) => {
  const { user, isAuthenticated } = useAuth();
  const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);
  const [hasShownModalForSession, setHasShownModalForSession] = useState(false);
  const [isUserFullyLoaded, setIsUserFullyLoaded] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(null);

  // TEMPORARY: Disable subscription validation for debugging login issues
  const DISABLE_SUBSCRIPTION_VALIDATION = false;

  // Skip all processing during SSR/build time
  const isSSR = typeof window === 'undefined';
  
  // Only log and process user data on the client side
  if (!isSSR) {
    console.log("User from SubscriptionValidationProvider", user);
    console.log("🔍 User Loading State:", {
      isAuthenticated,
      hasUser: !!user,
      userId: user?.id,
      organisationId: user?.organisationId,
      primaryRole: user?.primaryRole,
      userBranches: user?.userBranches,
      isUserFullyLoaded,
      authToken: !!authToken
    });
  }

  // Get user's organization and role - fix property access to match useAuth structure
  const organizationId = user?.organisationId || null;
  const userRole = user?.primaryRole || null;
  const organizationName = user?.branch?.name || 'Your Organization'; // Fallback name

  // Poll for auth token availability
  useEffect(() => {
    const checkAuthToken = () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
      setAuthToken(token);
    };

    // Check immediately
    checkAuthToken();

    // Poll every 500ms for auth token
    const tokenPolling = setInterval(checkAuthToken, 500);

    return () => clearInterval(tokenPolling);
  }, []);

  // Wait for user to be fully loaded before running validation
  useEffect(() => {
    if (isAuthenticated && user && user.id && user.organisationId && authToken) {
      // Add a small delay to ensure user data is fully loaded AND auth token is stored
      const timer = setTimeout(() => {
        if (!isSSR) {
          console.log("Setting user as fully loaded", { user, organizationId, userRole, hasAuthToken: !!authToken });
        }
        setIsUserFullyLoaded(true);
      }, 1000); // Increased delay to ensure user data is stable
      return () => clearTimeout(timer);
    } else {
      if (!isSSR) {
        console.log("User not fully loaded yet", { 
          isAuthenticated, 
          user: !!user, 
          userId: user?.id, 
          orgId: user?.organisationId,
          hasAuthToken: !!authToken
        });
      }
      setIsUserFullyLoaded(false);
    }
  }, [isAuthenticated, user?.id, user?.organisationId, authToken]); // Now properly tracking authToken

  // Only run validation if user is authenticated, user data is loaded, and we have organizationId
  const canRunValidation = isUserFullyLoaded && organizationId && !DISABLE_SUBSCRIPTION_VALIDATION;

  const {
    validationResult,
    loading,
    error,
    refetch,
    shouldSkipValidation,
  } = useSubscriptionValidation(
    organizationId, // Always pass the organizationId
    userRole, // Always pass the userRole
    !canRunValidation || DISABLE_SUBSCRIPTION_VALIDATION // Skip validation if disabled or can't run safely
  );

  // Show validation modal on login if subscription is invalid
  useEffect(() => {
    if (!isSSR) {
      console.log('🔍 Subscription Validation Debug:', {
        canRunValidation,
        shouldSkipValidation,
        loading,
        hasShownModalForSession,
        requiresAction: validationResult.requiresAction,
        validationResult,
        organizationId,
        userRole,
        isUserFullyLoaded,
        DISABLE_SUBSCRIPTION_VALIDATION
      });
    }

    if (
      canRunValidation &&
      !shouldSkipValidation &&
      !loading &&
      !hasShownModalForSession &&
      validationResult.requiresAction
    ) {
      if (!isSSR) {
        console.log('✅ Showing subscription validation modal', {
          canRunValidation,
          shouldSkipValidation,
          loading,
          hasShownModalForSession,
          requiresAction: validationResult.requiresAction,
        });
      }
      setIsValidationModalOpen(true);
      setHasShownModalForSession(true);
    }
  }, [
    canRunValidation,
    shouldSkipValidation,
    loading,
    hasShownModalForSession,
    validationResult.requiresAction,
  ]);

  // Reset session flag when user changes or logs out
  useEffect(() => {
    if (!isAuthenticated || !user) {
      setHasShownModalForSession(false);
      setIsUserFullyLoaded(false);
    }
  }, [isAuthenticated, user?.id]);

  const showValidationModal = () => {
    setIsValidationModalOpen(true);
  };

  const hideValidationModal = () => {
    setIsValidationModalOpen(false);
  };

  const handleSubscriptionCreated = () => {
    refetch();
    setHasShownModalForSession(false); // Allow showing modal again if needed
  };

  const contextValue: SubscriptionValidationContextType = {
    validationResult,
    isValidationModalOpen,
    showValidationModal,
    hideValidationModal,
    refetchValidation: refetch,
    loading,
  };

  return (
    <SubscriptionValidationContext.Provider value={contextValue}>
      {children}
      
      {/* Subscription Validation Modal */}
      {organizationId && (
        <SubscriptionValidationModal
          isOpen={isValidationModalOpen}
          onClose={hideValidationModal}
          validationResult={validationResult}
          organizationId={organizationId}
          organizationName={organizationName}
          onSubscriptionCreated={handleSubscriptionCreated}
        />
      )}
    </SubscriptionValidationContext.Provider>
  );
};

export default SubscriptionValidationProvider;
