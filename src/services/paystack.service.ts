// Paystack Payment Service for Ghana
export interface PaystackPaymentData {
  email: string;
  amount: number; // Amount in kobo (smallest currency unit)
  currency: string;
  reference?: string;
  callback_url?: string;
  metadata?: {
    organizationId: string;
    planId: string;
    contactName: string;
    [key: string]: any;
  };
}

export interface PaystackResponse {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

export interface PaystackVerificationResponse {
  status: boolean;
  message: string;
  data: {
    id: number;
    domain: string;
    status: 'success' | 'failed' | 'abandoned';
    reference: string;
    amount: number;
    message: string;
    gateway_response: string;
    paid_at: string;
    created_at: string;
    channel: string;
    currency: string;
    ip_address: string;
    metadata: any;
    log: any;
    fees: number;
    fees_split: any;
    authorization: {
      authorization_code: string;
      bin: string;
      last4: string;
      exp_month: string;
      exp_year: string;
      channel: string;
      card_type: string;
      bank: string;
      country_code: string;
      brand: string;
      reusable: boolean;
      signature: string;
      account_name: string;
    };
    customer: {
      id: number;
      first_name: string;
      last_name: string;
      email: string;
      customer_code: string;
      phone: string;
      metadata: any;
      risk_action: string;
    };
  };
}

class PaystackService {
  private baseUrl = 'https://api.paystack.co';
  private publicKey: string;

  constructor() {
    this.publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '';
    if (!this.publicKey) {
      console.warn('Paystack public key not found in environment variables');
    }
  }

  /**
   * Initialize a payment transaction
   */
  async initializePayment(paymentData: PaystackPaymentData): Promise<PaystackResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/transaction/initialize`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.publicKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...paymentData,
          amount: paymentData.amount * 100, // Convert to kobo
          callback_url: paymentData.callback_url, // Include callback URL if provided
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: PaystackResponse = await response.json();
      return result;
    } catch (error) {
      console.error('Paystack payment initialization failed:', error);
      throw new Error('Failed to initialize payment. Please try again.');
    }
  }

  /**
   * Verify a payment transaction
   */
  async verifyPayment(reference: string): Promise<PaystackVerificationResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/transaction/verify/${reference}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.publicKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: PaystackVerificationResponse = await response.json();
      return result;
    } catch (error) {
      console.error('Paystack payment verification failed:', error);
      throw new Error('Failed to verify payment. Please try again.');
    }
  }

  /**
   * Generate a unique payment reference
   */
  generateReference(organizationId: string): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `renewal_${organizationId}_${timestamp}_${random}`;
  }

  /**
   * Convert amount to kobo (Ghana Pesewas for GHS)
   */
  convertToKobo(amount: number, currency: string): number {
    // For GHS, 1 GHS = 100 pesewas
    // For NGN, 1 NGN = 100 kobo
    return Math.round(amount * 100);
  }

  /**
   * Format currency for display
   */
  formatCurrency(amount: number, currency: string): string {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: currency.toUpperCase(),
      minimumFractionDigits: 2,
    }).format(amount);
  }

  /**
   * Generate callback URL for payment completion
   */
  generateCallbackUrl(organizationId: string, planId: string, contactName?: string, contactEmail?: string): string {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
    const params = new URLSearchParams({
      organizationId,
      planId,
    });
    
    if (contactName) params.append('contactName', contactName);
    if (contactEmail) params.append('contactEmail', contactEmail);
    
    return `${baseUrl}/payment-callback?${params.toString()}`;
  }

  /**
   * Open Paystack popup for payment
   */
  openPaystackPopup(paymentData: PaystackPaymentData, onSuccess: (response: any) => void, onCancel: () => void): void {
    // Check if PaystackPop is available (loaded from CDN)
    if (typeof (window as any).PaystackPop === 'undefined') {
      console.error('Paystack popup script not loaded');
      throw new Error('Payment system not available. Please refresh the page and try again.');
    }

    const handler = (window as any).PaystackPop.setup({
      key: this.publicKey,
      email: paymentData.email,
      amount: this.convertToKobo(paymentData.amount, paymentData.currency),
      currency: paymentData.currency,
      ref: paymentData.reference || this.generateReference(paymentData.metadata?.organizationId || ''),
      metadata: paymentData.metadata,
      callback: function(response: any) {
        onSuccess(response);
      },
      onClose: function() {
        onCancel();
      }
    });

    handler.openIframe();
  }
}

export const paystackService = new PaystackService();
export default PaystackService;
