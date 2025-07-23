// Shared utility functions for Subscription Manager components
// This prevents duplicate function definitions that cause Fast Refresh loops

export function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency: currency,
  }).format(amount);
}

export function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleString('en-GH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-GH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

// Organization status badge colors
export function getOrganizationStatusBadgeColor(status: string): string {
  switch (status) {
    case 'ACTIVE':
      return 'bg-green-100 text-green-800';
    case 'SUSPENDED':
      return 'bg-red-100 text-red-800';
    case 'TRIAL':
      return 'bg-blue-100 text-blue-800';
    case 'PAST_DUE':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

// Subscription status badge colors
export function getSubscriptionStatusBadgeColor(status: string): string {
  switch (status) {
    case 'ACTIVE':
      return 'bg-green-100 text-green-800';
    case 'TRIAL':
      return 'bg-blue-100 text-blue-800';
    case 'PAST_DUE':
      return 'bg-yellow-100 text-yellow-800';
    case 'CANCELLED':
      return 'bg-red-100 text-red-800';
    case 'SUSPENDED':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

// Payment status badge colors
export function getPaymentStatusBadgeColor(status: string): string {
  switch (status) {
    case 'SUCCESSFUL':
      return 'bg-green-100 text-green-800';
    case 'FAILED':
      return 'bg-red-100 text-red-800';
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800';
    case 'REFUNDED':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

// Common class name utility
export function classNames(...classes: string[]): string {
  return classes.filter(Boolean).join(' ');
}
