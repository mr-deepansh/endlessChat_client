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
    if (process.env.NODE_ENV !== 'production') {
      console.log(this.formatMessage('info', message, ...args));
    }
  }
  static log(message: string, ...args: any[]): void {
    if (process.env.NODE_ENV !== 'production') {
      console.log(this.formatMessage('info', message, ...args));
    }
  }
  static error(message: string, ...args: any[]): void {
    console.error(this.formatMessage('error', message, ...args));
  }
  static warn(message: string, ...args: any[]): void {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(this.formatMessage('warn', message, ...args));
    }
  }
  static debug(message: string, ...args: any[]): void {
    if (process.env.NODE_ENV === 'development') {
      console.debug(this.formatMessage('debug', message, ...args));
    }
  }
}

export default Logger;
