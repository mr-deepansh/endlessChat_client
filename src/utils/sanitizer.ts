// Input sanitization utility to prevent XSS attacks
class Sanitizer {
  // HTML entities to escape
  private static htmlEntities: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };

  // Escape HTML entities
  static escapeHtml(input: string): string {
    return input.replace(/[&<>"'/]/g, match => this.htmlEntities[match] || match);
  }

  // Sanitize user input for display
  static sanitizeInput(input: string): string {
    if (typeof input !== 'string') {
      return '';
    }

    // Remove script tags and their content
    let sanitized = input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

    // Remove dangerous attributes
    sanitized = sanitized.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');

    // Remove javascript: protocol
    sanitized = sanitized.replace(/javascript:/gi, '');

    // Remove data: protocol (except for images)
    sanitized = sanitized.replace(/data:(?!image\/)/gi, '');

    // Escape remaining HTML
    return this.escapeHtml(sanitized);
  }

  // Sanitize content for safe rendering
  static sanitizeContent(content: string): string {
    if (!content || typeof content !== 'string') {
      return '';
    }

    // Basic sanitization
    let sanitized = this.sanitizeInput(content);

    // Preserve line breaks
    sanitized = sanitized.replace(/\n/g, '<br>');

    return sanitized;
  }

  // Validate and sanitize URL
  static sanitizeUrl(url: string): string {
    if (!url || typeof url !== 'string') {
      return '';
    }

    // Remove dangerous protocols
    const dangerousProtocols = ['javascript:', 'data:', 'vbscript:', 'file:', 'about:'];
    const lowerUrl = url.toLowerCase();

    for (const protocol of dangerousProtocols) {
      if (lowerUrl.startsWith(protocol)) {
        return '';
      }
    }

    // Only allow http, https, and mailto
    if (!/^(https?:\/\/|mailto:)/i.test(url)) {
      return `https://${url}`;
    }

    return url;
  }

  // Sanitize filename
  static sanitizeFilename(filename: string): string {
    if (!filename || typeof filename !== 'string') {
      return 'file';
    }

    // Remove path traversal attempts
    let sanitized = filename.replace(/[\/\\:*?"<>|]/g, '_');

    // Remove leading dots and spaces
    sanitized = sanitized.replace(/^[.\s]+/, '');

    // Limit length
    sanitized = sanitized.substring(0, 255);

    return sanitized || 'file';
  }

  // Validate file type
  static isValidFileType(file: File, allowedTypes: string[]): boolean {
    if (!file || !file.type) {
      return false;
    }

    return allowedTypes.some(type => {
      if (type.endsWith('/*')) {
        return file.type.startsWith(type.slice(0, -1));
      }
      return file.type === type;
    });
  }

  // Validate image file
  static isValidImage(file: File): boolean {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    return this.isValidFileType(file, allowedTypes);
  }

  // Validate video file
  static isValidVideo(file: File): boolean {
    const allowedTypes = ['video/mp4', 'video/webm', 'video/ogg'];
    return this.isValidFileType(file, allowedTypes);
  }
}

export default Sanitizer;
