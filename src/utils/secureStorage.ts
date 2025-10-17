// Minimal storage utility - HttpOnly cookies handled by backend
class SecureStorage {
  private static readonly TOKEN_KEY = 'auth_token';

  // Legacy token cleanup only
  static clearTokens(): void {
    try {
      // Clear any legacy client-side tokens
      sessionStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('auth_token');
      localStorage.removeItem('token');
    } catch (_error) {
      // Ignore localStorage errors in restricted contexts
      console.warn('Storage access denied:', error);
    }
  }

  // HttpOnly cookies - not accessible from frontend
  static getAccessToken(): string | null {
    return null; // HttpOnly cookies cannot be read by JavaScript
  }

  static getRefreshToken(): string | null {
    return null; // HttpOnly cookies cannot be read by JavaScript
  }

  static setAccessToken(token: string): void {
    // No-op: HttpOnly cookies are set by backend
  }

  static setRefreshToken(token: string): void {
    // No-op: HttpOnly cookies are set by backend
  }

  // Authentication check relies on backend validation
  static isAuthenticated(): boolean {
    // Cannot reliably check with HttpOnly cookies
    // Backend validation is the source of truth
    return false; // Always return false, let backend validate
  }
}

export default SecureStorage;
