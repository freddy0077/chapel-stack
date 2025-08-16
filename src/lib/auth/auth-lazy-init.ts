/**
 * Lazy Authentication Initialization
 * Reduces blocking operations during app startup for better performance
 */

export class LazyAuthInit {
  private static initialized = false;
  private static initPromise: Promise<void> | null = null;

  /**
   * Initialize authentication in background without blocking UI
   */
  static async initializeInBackground(): Promise<void> {
    if (this.initialized || this.initPromise) {
      return this.initPromise || Promise.resolve();
    }

    this.initPromise = this.performInitialization();
    return this.initPromise;
  }

  private static async performInitialization(): Promise<void> {
    try {
      // Only perform critical checks
      const hasToken = typeof window !== 'undefined' && 
        localStorage.getItem('chapel_access_token');

      if (!hasToken) {
        this.initialized = true;
        return;
      }

      // Defer non-critical operations
      setTimeout(() => {
        this.performDeferredInit();
      }, 100);

      this.initialized = true;
    } catch (error) {
      console.warn('Auth lazy init failed:', error);
      this.initialized = true;
    }
  }

  private static performDeferredInit(): void {
    // Perform non-blocking auth operations here
    // Token validation, user data sync, etc.
  }

  static isInitialized(): boolean {
    return this.initialized;
  }
}
