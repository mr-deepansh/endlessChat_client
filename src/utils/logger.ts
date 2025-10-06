// Secure logging utility to prevent log injection
class Logger {
  private static sanitizeInput(input: any): string {
    if (typeof input === 'string') {
      // Remove or escape newlines, carriage returns, and other control characters
      return input
        .replace(/[\r\n\t]/g, ' ')
        .replace(/[\x00-\x1F\x7F]/g, '')
        .substring(0, 1000); // Limit length
    }

    if (typeof input === 'object') {
      try {
        const sanitized = JSON.stringify(input, null, 0);
        return this.sanitizeInput(sanitized);
      } catch {
        return '[Object]';
      }
    }
    return String(input).substring(0, 1000);
  }
  private static formatMessage(level: string, message: string, ...args: any[]): string {
    const timestamp = new Date().toISOString();
    const sanitizedMessage = this.sanitizeInput(message);
    const sanitizedArgs = args.map(arg => this.sanitizeInput(arg)).join(' ');

    return `[${timestamp}] ${level.toUpperCase()}: ${sanitizedMessage} ${sanitizedArgs}`.trim();
  }

  static info(message: string, ...args: any[]): void {
    // Logging disabled
  }
  static log(message: string, ...args: any[]): void {
    // Logging disabled
  }
  static error(message: string, ...args: any[]): void {
    // Logging disabled
  }
  static warn(message: string, ...args: any[]): void {
    // Logging disabled
  }
  static debug(message: string, ...args: any[]): void {
    // Logging disabled
  }
}

export default Logger;
