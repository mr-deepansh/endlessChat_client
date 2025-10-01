// Authentication persistence utility
export class AuthPersistence {
  private static readonly ACCESS_TOKEN_KEY = 'accessToken';
  private static readonly AUTH_TOKEN_KEY = 'auth_token';
  private static readonly REFRESH_TOKEN_KEY = 'refreshToken';
  private static readonly REFRESH_TOKEN_BACKUP_KEY = 'refresh_token';

  static hasValidToken(): boolean {
    const token = this.getAccessToken();
    if (!token) return false;

    try {
      // Basic JWT validation - check if it's not expired
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      
      // If token has expiry and it's expired, return false
      if (payload.exp && payload.exp < currentTime) {
        this.clearTokens();
        return false;
      }
      
      return true;
    } catch {
      // If token is malformed, clear it
      this.clearTokens();
      return false;
    }
  }

  static getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY) || 
           localStorage.getItem(this.AUTH_TOKEN_KEY);
  }

  static getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY) || 
           localStorage.getItem(this.REFRESH_TOKEN_BACKUP_KEY);
  }

  static setTokens(accessToken: string, refreshToken?: string): void {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(this.AUTH_TOKEN_KEY, accessToken);
    
    if (refreshToken) {
      localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
      localStorage.setItem(this.REFRESH_TOKEN_BACKUP_KEY, refreshToken);
    }
  }

  static clearTokens(): void {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.AUTH_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_BACKUP_KEY);
  }

  static isAuthenticated(): boolean {
    return this.hasValidToken();
  }
}