import { useMutation, useQuery } from '@apollo/client';
import {
  CREATE_SUBSCRIPTION,
  GET_SUBSCRIPTION_PLANS,
  GET_MEMBERS_FOR_SUBSCRIPTION,
  GET_SUBSCRIPTIONS,
  type CreateSubscriptionInput,
  type SubscriptionPlan,
  type Member,
  type Subscription,
  type PlanFilterInput,
  type MemberFilterInput,
  type SubscriptionFilterInput,
} from '@/graphql/subscription-management';

export interface UseCreateSubscriptionOptions {
  onSuccess?: (subscription: Subscription) => void;
  onError?: (error: Error) => void;
}

export const useCreateSubscription = (options?: UseCreateSubscriptionOptions) => {
  const [createSubscription, { loading, error, data }] = useMutation(CREATE_SUBSCRIPTION, {
    onCompleted: (data) => {
      options?.onSuccess?.(data.createSubscription);
    },
    onError: (error) => {
      options?.onError?.(error);
    },
    refetchQueries: [
      { query: GET_SUBSCRIPTIONS },
      'GetSubscriptions',
    ],
    awaitRefetchQueries: true,
  });

  const handleCreateSubscription = async (input: CreateSubscriptionInput) => {
    try {
      const result = await createSubscription({
        variables: { input },
      });
      return result.data?.createSubscription;
    } catch (error) {
      throw error;
    }
  };

  return {
    createSubscription: handleCreateSubscription,
    loading,
    error,
    data: data?.createSubscription,
  };
};

export const useSubscriptionPlans = (filter?: PlanFilterInput) => {
  const { data, loading, error, refetch } = useQuery(GET_SUBSCRIPTION_PLANS, {
    variables: { filter },
    errorPolicy: 'all',
  });

  return {
    plans: data?.subscriptionPlans || [],
    loading,
    error,
    refetch,
  };
};

export const useMembersForSubscription = (filter?: MemberFilterInput) => {
  const { data, loading, error, refetch } = useQuery(GET_MEMBERS_FOR_SUBSCRIPTION, {
    variables: { filter },
    errorPolicy: 'all',
  });

  return {
    members: data?.members || [],
    loading,
    error,
    refetch,
  };
};

export const useSubscriptions = (filter?: SubscriptionFilterInput) => {
  const { data, loading, error, refetch } = useQuery(GET_SUBSCRIPTIONS, {
    variables: { filter },
    errorPolicy: 'all',
  });

  return {
    subscriptions: data?.subscriptions || [],
    loading,
    error,
    refetch,
  };
};
