// Safe JSON parsing utility to prevent deserialization attacks
class SafeJSON {
  // Safe JSON parse with validation
  static parse<T = any>(jsonString: string, validator?: (obj: any) => obj is T): T | null {
    try {
      if (!jsonString || typeof jsonString !== 'string') {
        return null;
      }

      // Basic validation - check for suspicious patterns
      if (this.containsSuspiciousPatterns(jsonString)) {
        return null;
      }

      const parsed = JSON.parse(jsonString);

      // Additional validation if validator provided
      if (validator && !validator(parsed)) {
        return null;
      }

      return parsed;
    } catch (_error) {
      return null;
    }
  }

  // Check for suspicious patterns that might indicate attacks
  private static containsSuspiciousPatterns(jsonString: string): boolean {
    const suspiciousPatterns = [
      /__proto__/,
      /constructor/,
      /prototype/,
      /function\s*\(/,
      /eval\s*\(/,
      /setTimeout\s*\(/,
      /setInterval\s*\(/,
      /document\./,
      /window\./,
      /location\./,
      /alert\s*\(/,
      /confirm\s*\(/,
      /prompt\s*\(/,
    ];

    return suspiciousPatterns.some(pattern => pattern.test(jsonString));
  }

  // Safe stringify with circular reference handling
  static stringify(obj: any, space?: number): string | null {
    try {
      const seen = new WeakSet();

      return JSON.stringify(
        obj,
        (key, value) => {
          // Handle circular references
          if (typeof value === 'object' && value !== null) {
            if (seen.has(value)) {
              return '[Circular Reference]';
            }
            seen.add(value);
          }

          // Filter out functions and undefined values
          if (typeof value === 'function' || value === undefined) {
            return null;
          }

          return value;
        },
        space
      );
    } catch (_error) {
      return null;
    }
  }

  // Validate notification object structure
  static isValidNotification(obj: any): obj is any {
    return (
      obj &&
      typeof obj === 'object' &&
      typeof obj.id === 'string' &&
      typeof obj.type === 'string' &&
      typeof obj.message === 'string' &&
      typeof obj.createdAt === 'string'
    );
  }

  // Validate user object structure
  static isValidUser(obj: any): obj is any {
    return (
      obj &&
      typeof obj === 'object' &&
      (typeof obj._id === 'string' || typeof obj.id === 'string') &&
      typeof obj.username === 'string' &&
      typeof obj.email === 'string'
    );
  }

  // Validate post object structure
  static isValidPost(obj: any): obj is any {
    return (
      obj &&
      typeof obj === 'object' &&
      (typeof obj._id === 'string' || typeof obj.id === 'string') &&
      typeof obj.content === 'string' &&
      obj.author &&
      typeof obj.author === 'object'
    );
  }
}

export default SafeJSON;
