'use client';

import { useState, useEffect, useCallback } from 'react';

// Mock data interfaces - will be replaced with real GraphQL types
interface SubscriptionManagerStats {
  totalOrganizations: number;
  activeSubscriptions: number;
  totalRevenue: number;
  failedPayments: number;
}

interface Organization {
  id: string;
  name: string;
  email: string;
  state: string;
  subscriptionStatus: string;
  planName: string;
  memberCount: number;
  createdAt: string;
}

interface Subscription {
  id: string;
  organizationName: string;
  planName: string;
  status: string;
  amount: number;
  currency: string;
  interval: string;
  nextBillingDate: string;
}

interface Payment {
  id: string;
  organizationName: string;
  amount: number;
  currency: string;
  status: string;
  paymentMethod: string;
  createdAt: string;
}

export function useSubscriptionManagerDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<SubscriptionManagerStats | null>(null);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);

  // Memoize the fetch function to prevent unnecessary re-renders
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Mock data - replace with real API calls
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStats({
        totalOrganizations: 156,
        activeSubscriptions: 134,
        totalRevenue: 45670.99,
        failedPayments: 8
      });

      setOrganizations([
        {
          id: '1',
          name: 'Grace Community Church',
          email: 'admin@gracechurch.org',
          state: 'ACTIVE',
          subscriptionStatus: 'ACTIVE',
          planName: 'Professional',
          memberCount: 245,
          createdAt: '2024-01-15'
        },
        {
          id: '2',
          name: 'Faith Baptist Church',
          email: 'contact@faithbaptist.org',
          state: 'SUSPENDED',
          subscriptionStatus: 'PAST_DUE',
          planName: 'Growth',
          memberCount: 156,
          createdAt: '2023-11-20'
        }
      ]);

      setSubscriptions([
        {
          id: '1',
          organizationName: 'Grace Community Church',
          planName: 'Professional',
          status: 'ACTIVE',
          amount: 299.99,
          currency: 'GHS',
          interval: 'MONTHLY',
          nextBillingDate: '2024-07-15'
        }
      ]);

      setPayments([
        {
          id: '1',
          organizationName: 'Grace Community Church',
          amount: 299.99,
          currency: 'GHS',
          status: 'SUCCESSFUL',
          paymentMethod: 'CARD',
          createdAt: '2024-07-01T10:30:00Z'
        }
      ]);

      setError(null);
    } catch (err) {
      setError('Failed to fetch subscription manager data');
      console.error('Error fetching subscription manager data:', err);
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array since this function doesn't depend on any props or state

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Memoize the refetch function to prevent unnecessary re-renders
  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return {
    loading,
    error,
    stats,
    organizations,
    subscriptions,
    payments,
    refetch
  };
}

export default useSubscriptionManagerDashboard;
