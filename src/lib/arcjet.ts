import arcjet, { tokenBucket, shield, detectBot } from '@arcjet/react';

// Arcjet configuration for security and performance
export const aj = arcjet({
  key: process.env.ARCJET_KEY || 'test-key', // Replace with your Arcjet key
  characteristics: ['userId', 'ip'],
  rules: [
    // Rate limiting for API requests
    tokenBucket({
      mode: 'LIVE',
      refillRate: 10, // 10 tokens per interval
      interval: 60, // 60 seconds
      capacity: 100, // Maximum 100 tokens
    }),
    
    // Shield protection against common attacks
    shield({
      mode: 'LIVE',
    }),
    
    // Bot detection
    detectBot({
      mode: 'LIVE',
      allow: ['CATEGORY:SEARCH_ENGINE'], // Allow search engines
    }),
  ],
});

// Rate limiting for specific actions
export const createPostLimiter = arcjet({
  key: process.env.ARCJET_KEY || 'test-key',
  characteristics: ['userId'],
  rules: [
    tokenBucket({
      mode: 'LIVE',
      refillRate: 1, // 1 post per interval
      interval: 60, // 60 seconds
      capacity: 5, // Maximum 5 posts in bucket
    }),
  ],
});

// Login rate limiting
export const loginLimiter = arcjet({
  key: process.env.ARCJET_KEY || 'test-key',
  characteristics: ['ip'],
  rules: [
    tokenBucket({
      mode: 'LIVE',
      refillRate: 1, // 1 attempt per interval
      interval: 60, // 60 seconds
      capacity: 5, // Maximum 5 attempts
    }),
  ],
});

// Search rate limiting
export const searchLimiter = arcjet({
  key: process.env.ARCJET_KEY || 'test-key',
  characteristics: ['userId', 'ip'],
  rules: [
    tokenBucket({
      mode: 'LIVE',
      refillRate: 10, // 10 searches per interval
      interval: 60, // 60 seconds
      capacity: 50, // Maximum 50 searches
    }),
  ],
});

// Helper function to handle Arcjet responses
export const handleArcjetResponse = (decision: any) => {
  if (decision.isDenied()) {
    if (decision.reason.isRateLimit()) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }
    if (decision.reason.isBot()) {
      throw new Error('Bot traffic detected.');
    }
    if (decision.reason.isShield()) {
      throw new Error('Request blocked for security reasons.');
    }
    throw new Error('Request denied.');
  }
};

export default aj;