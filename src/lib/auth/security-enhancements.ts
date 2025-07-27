/**
 * Security Enhancements for Phase 2 Implementation
 * CSRF protection, secure cookies, session management, and security utilities
 */

import { AuthUser, AuthTokens, COOKIE_NAMES } from '@/types/auth-enhanced.types';
import { AuthUtils } from './auth-reducer';

/**
 * CSRF Protection Manager
 */
export class CSRFProtection {
  private static instance: CSRFProtection;
  private csrfToken: string | null = null;
  private tokenExpiry: number = 0;

  static getInstance(): CSRFProtection {
    if (!CSRFProtection.instance) {
      CSRFProtection.instance = new CSRFProtection();
    }
    return CSRFProtection.instance;
  }

  /**
   * Generate CSRF token
   */
  generateToken(): string {
    const token = this.createSecureToken();
    const expiry = Date.now() + (30 * 60 * 1000); // 30 minutes

    this.csrfToken = token;
    this.tokenExpiry = expiry;

    // Store in sessionStorage for client-side access
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('csrf_token', token);
      sessionStorage.setItem('csrf_expiry', expiry.toString());
    }

    return token;
  }

  /**
   * Get current CSRF token
   */
  getToken(): string | null {
    // Check if current token is still valid
    if (this.csrfToken && Date.now() < this.tokenExpiry) {
      return this.csrfToken;
    }

    // Try to get from sessionStorage
    if (typeof window !== 'undefined') {
      const storedToken = sessionStorage.getItem('csrf_token');
      const storedExpiry = sessionStorage.getItem('csrf_expiry');

      if (storedToken && storedExpiry) {
        const expiry = parseInt(storedExpiry, 10);
        if (Date.now() < expiry) {
          this.csrfToken = storedToken;
          this.tokenExpiry = expiry;
          return storedToken;
        }
      }
    }

    // Generate new token if none exists or expired
    return this.generateToken();
  }

  /**
   * Validate CSRF token
   */
  validateToken(token: string): boolean {
    const currentToken = this.getToken();
    return currentToken === token && Date.now() < this.tokenExpiry;
  }

  /**
   * Clear CSRF token
   */
  clearToken(): void {
    this.csrfToken = null;
    this.tokenExpiry = 0;

    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('csrf_token');
      sessionStorage.removeItem('csrf_expiry');
    }
  }

  /**
   * Create secure random token
   */
  private createSecureToken(): string {
    if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
      const array = new Uint8Array(32);
      window.crypto.getRandomValues(array);
      return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    }

    // Fallback for environments without crypto API
    return Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
  }

  /**
   * Add CSRF token to request headers
   */
  addToHeaders(headers: Record<string, string> = {}): Record<string, string> {
    const token = this.getToken();
    if (token) {
      headers['X-CSRF-Token'] = token;
    }
    return headers;
  }

  /**
   * Add CSRF token to form data
   */
  addToFormData(formData: FormData): FormData {
    const token = this.getToken();
    if (token) {
      formData.append('_csrf', token);
    }
    return formData;
  }
}

/**
 * Secure Cookie Manager
 */
export class SecureCookieManager {
  private static instance: SecureCookieManager;

  static getInstance(): SecureCookieManager {
    if (!SecureCookieManager.instance) {
      SecureCookieManager.instance = new SecureCookieManager();
    }
    return SecureCookieManager.instance;
  }

  /**
   * Set secure authentication cookie
   */
  setAuthCookie(name: string, value: string, options: {
    maxAge?: number;
    expires?: Date;
    httpOnly?: boolean;
    secure?: boolean;
    sameSite?: 'strict' | 'lax' | 'none';
    domain?: string;
    path?: string;
  } = {}): void {
    if (typeof document === 'undefined') return;

    const {
      maxAge,
      expires,
      httpOnly = false, // Can't set HttpOnly from client-side
      secure = process.env.NODE_ENV === 'production',
      sameSite = 'strict',
      domain,
      path = '/',
    } = options;

    let cookieString = `${name}=${encodeURIComponent(value)}`;

    if (maxAge !== undefined) {
      cookieString += `; Max-Age=${maxAge}`;
    }

    if (expires) {
      cookieString += `; Expires=${expires.toUTCString()}`;
    }

    if (secure) {
      cookieString += '; Secure';
    }

    cookieString += `; SameSite=${sameSite}`;

    if (domain) {
      cookieString += `; Domain=${domain}`;
    }

    cookieString += `; Path=${path}`;

    try {
      document.cookie = cookieString;
    } catch (error) {
      console.error('Failed to set secure cookie:', error);
    }
  }

  /**
   * Get cookie value
   */
  getCookie(name: string): string | null {
    if (typeof document === 'undefined') return null;

    const nameEQ = name + '=';
    const cookies = document.cookie.split(';');

    for (let cookie of cookies) {
      let c = cookie.trim();
      if (c.indexOf(nameEQ) === 0) {
        return decodeURIComponent(c.substring(nameEQ.length));
      }
    }

    return null;
  }

  /**
   * Delete cookie
   */
  deleteCookie(name: string, path: string = '/', domain?: string): void {
    if (typeof document === 'undefined') return;

    let cookieString = `${name}=; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=${path}`;

    if (domain) {
      cookieString += `; Domain=${domain}`;
    }

    try {
      document.cookie = cookieString;
    } catch (error) {
      console.error('Failed to delete cookie:', error);
    }
  }

  /**
   * Set authentication tokens as secure cookies
   */
  setAuthTokens(tokens: AuthTokens, rememberMe: boolean = false): void {
    const maxAge = rememberMe ? 30 * 24 * 60 * 60 : undefined; // 30 days or session

    // Set access token (needs to be accessible by JavaScript for GraphQL)
    this.setAuthCookie(COOKIE_NAMES.ACCESS_TOKEN, tokens.accessToken, {
      maxAge,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    // Set refresh token (more secure, but still accessible for refresh logic)
    if (tokens.refreshToken) {
      this.setAuthCookie(COOKIE_NAMES.REFRESH_TOKEN, tokens.refreshToken, {
        maxAge: rememberMe ? 30 * 24 * 60 * 60 : 24 * 60 * 60, // 30 days or 1 day
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });
    }
  }

  /**
   * Clear all authentication cookies
   */
  clearAuthCookies(): void {
    Object.values(COOKIE_NAMES).forEach(cookieName => {
      this.deleteCookie(cookieName);
    });
  }

  /**
   * Check if cookies are enabled
   */
  areCookiesEnabled(): boolean {
    if (typeof document === 'undefined') return false;

    try {
      const testCookie = 'test_cookie_enabled';
      document.cookie = `${testCookie}=test; path=/`;
      const enabled = document.cookie.indexOf(testCookie) !== -1;
      
      // Clean up test cookie
      this.deleteCookie(testCookie);
      
      return enabled;
    } catch {
      return false;
    }
  }
}

/**
 * Session Security Manager
 */
export class SessionSecurityManager {
  private static instance: SessionSecurityManager;
  private sessionFingerprint: string | null = null;
  private securityChecks: Map<string, number> = new Map();

  static getInstance(): SessionSecurityManager {
    if (!SessionSecurityManager.instance) {
      SessionSecurityManager.instance = new SessionSecurityManager();
    }
    return SessionSecurityManager.instance;
  }

  /**
   * Generate browser fingerprint for session validation
   */
  generateFingerprint(): string {
    if (typeof window === 'undefined') return 'server';

    const components = [
      navigator.userAgent,
      navigator.language,
      screen.width + 'x' + screen.height,
      screen.colorDepth,
      new Date().getTimezoneOffset(),
      navigator.platform,
      navigator.cookieEnabled ? '1' : '0',
    ];

    // Create hash of components
    const fingerprint = this.simpleHash(components.join('|'));
    this.sessionFingerprint = fingerprint;

    return fingerprint;
  }

  /**
   * Validate session fingerprint
   */
  validateFingerprint(storedFingerprint: string): boolean {
    const currentFingerprint = this.generateFingerprint();
    return currentFingerprint === storedFingerprint;
  }

  /**
   * Detect potential session hijacking
   */
  detectSuspiciousActivity(user: AuthUser): {
    isSuspicious: boolean;
    reasons: string[];
    riskLevel: 'low' | 'medium' | 'high';
  } {
    const reasons: string[] = [];
    let riskLevel: 'low' | 'medium' | 'high' = 'low';

    // Check fingerprint mismatch
    const storedFingerprint = localStorage.getItem('session_fingerprint');
    if (storedFingerprint && !this.validateFingerprint(storedFingerprint)) {
      reasons.push('Browser fingerprint mismatch');
      riskLevel = 'high';
    }

    // Check for rapid location changes (if geolocation available)
    this.checkLocationChanges(reasons);

    // Check for unusual access patterns
    this.checkAccessPatterns(user, reasons);

    // Check for concurrent sessions
    this.checkConcurrentSessions(reasons);

    // Determine overall risk level
    if (reasons.length >= 3) {
      riskLevel = 'high';
    } else if (reasons.length >= 2) {
      riskLevel = 'medium';
    }

    return {
      isSuspicious: reasons.length > 0,
      reasons,
      riskLevel,
    };
  }

  /**
   * Check for suspicious location changes
   */
  private checkLocationChanges(reasons: string[]): void {
    // This would integrate with geolocation API or IP-based location
    // For now, we'll implement a basic check
    
    if (typeof window !== 'undefined' && navigator.geolocation) {
      const lastLocation = localStorage.getItem('last_location');
      const lastLocationTime = localStorage.getItem('last_location_time');
      
      if (lastLocation && lastLocationTime) {
        const timeDiff = Date.now() - parseInt(lastLocationTime, 10);
        const oneHour = 60 * 60 * 1000;
        
        // If location was recorded less than an hour ago, it might be suspicious
        // to have a completely different location now
        if (timeDiff < oneHour) {
          // This is a simplified check - in reality, you'd compare actual coordinates
          reasons.push('Rapid location change detected');
        }
      }
    }
  }

  /**
   * Check for unusual access patterns
   */
  private checkAccessPatterns(user: AuthUser, reasons: string[]): void {
    const now = Date.now();
    const userId = user.id;
    
    // Check login frequency
    const loginCount = this.securityChecks.get(`login_${userId}`) || 0;
    if (loginCount > 10) { // More than 10 logins in the tracking period
      reasons.push('Unusual login frequency');
    }

    // Check for access outside normal hours (if we have historical data)
    const hour = new Date().getHours();
    if (hour < 6 || hour > 22) { // Outside 6 AM - 10 PM
      const nightAccessCount = this.securityChecks.get(`night_access_${userId}`) || 0;
      if (nightAccessCount > 3) {
        reasons.push('Unusual access hours');
      }
      this.securityChecks.set(`night_access_${userId}`, nightAccessCount + 1);
    }
  }

  /**
   * Check for concurrent sessions
   */
  private checkConcurrentSessions(reasons: string[]): void {
    // This would require server-side session tracking
    // For now, we'll implement a basic client-side check
    
    const sessionId = localStorage.getItem('chapel_session_id');
    const allSessions = JSON.parse(localStorage.getItem('all_sessions') || '[]');
    
    if (allSessions.length > 3) { // More than 3 concurrent sessions
      reasons.push('Multiple concurrent sessions detected');
    }
  }

  /**
   * Simple hash function for fingerprinting
   */
  private simpleHash(str: string): string {
    let hash = 0;
    if (str.length === 0) return hash.toString();
    
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    return Math.abs(hash).toString(16);
  }

  /**
   * Clear security tracking data
   */
  clearSecurityData(): void {
    this.sessionFingerprint = null;
    this.securityChecks.clear();
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem('session_fingerprint');
      localStorage.removeItem('last_location');
      localStorage.removeItem('last_location_time');
      localStorage.removeItem('all_sessions');
    }
  }

  /**
   * Initialize session security
   */
  initializeSession(user: AuthUser): void {
    // Generate and store fingerprint
    const fingerprint = this.generateFingerprint();
    if (typeof window !== 'undefined') {
      localStorage.setItem('session_fingerprint', fingerprint);
    }

    // Record session start
    this.securityChecks.set(`login_${user.id}`, (this.securityChecks.get(`login_${user.id}`) || 0) + 1);

    // Store location if available
    if (typeof window !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = `${position.coords.latitude},${position.coords.longitude}`;
          localStorage.setItem('last_location', location);
          localStorage.setItem('last_location_time', Date.now().toString());
        },
        () => {
          // Geolocation failed, that's okay
        },
        { timeout: 5000, maximumAge: 300000 } // 5 second timeout, 5 minute cache
      );
    }

  }
}

/**
 * Security Utilities
 */
export const SecurityUtils = {
  /**
   * Validate password strength
   */
  validatePasswordStrength(password: string): {
    isStrong: boolean;
    score: number;
    feedback: string[];
  } {
    const feedback: string[] = [];
    let score = 0;

    // Length check
    if (password.length >= 8) score += 1;
    else feedback.push('Use at least 8 characters');

    if (password.length >= 12) score += 1;

    // Character variety checks
    if (/[a-z]/.test(password)) score += 1;
    else feedback.push('Include lowercase letters');

    if (/[A-Z]/.test(password)) score += 1;
    else feedback.push('Include uppercase letters');

    if (/\d/.test(password)) score += 1;
    else feedback.push('Include numbers');

    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;
    else feedback.push('Include special characters');

    // Common password checks
    const commonPasswords = ['password', '123456', 'qwerty', 'abc123', 'password123'];
    if (commonPasswords.some(common => password.toLowerCase().includes(common))) {
      score -= 2;
      feedback.push('Avoid common passwords');
    }

    // Sequential characters check
    if (/123|abc|qwe/i.test(password)) {
      score -= 1;
      feedback.push('Avoid sequential characters');
    }

    return {
      isStrong: score >= 5,
      score: Math.max(0, Math.min(6, score)),
      feedback,
    };
  },

  /**
   * Generate secure random password
   */
  generateSecurePassword(length: number = 16): string {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
    let password = '';

    if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
      const array = new Uint8Array(length);
      window.crypto.getRandomValues(array);
      
      for (let i = 0; i < length; i++) {
        password += charset[array[i] % charset.length];
      }
    } else {
      // Fallback for environments without crypto API
      for (let i = 0; i < length; i++) {
        password += charset[Math.floor(Math.random() * charset.length)];
      }
    }

    return password;
  },

  /**
   * Sanitize user input to prevent XSS
   */
  sanitizeInput(input: string): string {
    if (typeof input !== 'string') return '';

    return input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  },

  /**
   * Validate email format with additional security checks
   */
  validateSecureEmail(email: string): {
    isValid: boolean;
    issues: string[];
  } {
    const issues: string[] = [];

    // Basic format check
    if (!AuthUtils.isValidEmail(email)) {
      issues.push('Invalid email format');
      return { isValid: false, issues };
    }

    // Length checks
    if (email.length > 254) {
      issues.push('Email too long');
    }

    const [localPart, domain] = email.split('@');

    if (localPart.length > 64) {
      issues.push('Email local part too long');
    }

    // Check for suspicious patterns
    if (/[<>]/.test(email)) {
      issues.push('Email contains suspicious characters');
    }

    // Check for common disposable email domains
    const disposableDomains = [
      '10minutemail.com', 'tempmail.org', 'guerrillamail.com',
      'mailinator.com', 'throwaway.email'
    ];

    if (disposableDomains.some(disposable => domain.toLowerCase().includes(disposable))) {
      issues.push('Disposable email addresses not allowed');
    }

    return {
      isValid: issues.length === 0,
      issues,
    };
  },

  /**
   * Check if request is from secure context
   */
  isSecureContext(): boolean {
    if (typeof window === 'undefined') return true; // Assume secure on server

    return window.isSecureContext || window.location.protocol === 'https:';
  },

  /**
   * Generate content security policy nonce
   */
  generateCSPNonce(): string {
    if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
      const array = new Uint8Array(16);
      window.crypto.getRandomValues(array);
      return btoa(String.fromCharCode(...array));
    }

    // Fallback
    return btoa(Math.random().toString()).substring(0, 16);
  },
};

// Export singleton instances
export const csrfProtection = CSRFProtection.getInstance();
export const secureCookieManager = SecureCookieManager.getInstance();
export const sessionSecurityManager = SessionSecurityManager.getInstance();
