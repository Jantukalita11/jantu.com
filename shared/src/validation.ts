import { z } from 'zod';

// Common validation schemas
export const emailSchema = z.string().email('Invalid email address');
export const passwordSchema = z.string().min(8, 'Password must be at least 8 characters');
export const nameSchema = z.string().min(1, 'Name is required').max(100, 'Name too long');

// File validation schemas
export const audioFileSchema = z.object({
  name: z.string(),
  size: z.number().max(100 * 1024 * 1024, 'File size must be less than 100MB'),
  type: z.string().refine(
    (type) => ['audio/mpeg', 'audio/wav', 'audio/mp4', 'audio/m4a', 'audio/flac'].includes(type),
    'Invalid audio file type'
  ),
});

export const videoFileSchema = z.object({
  name: z.string(),
  size: z.number().max(500 * 1024 * 1024, 'File size must be less than 500MB'),
  type: z.string().refine(
    (type) => ['video/mp4', 'video/mov', 'video/avi', 'video/mkv'].includes(type),
    'Invalid video file type'
  ),
});

// Text validation
export const ttsTextSchema = z.string()
  .min(1, 'Text is required')
  .max(10000, 'Text must be less than 10,000 characters')
  .refine(
    (text) => text.trim().length > 0,
    'Text cannot be empty or only whitespace'
  );

// Project validation
export const projectNameSchema = z.string()
  .min(1, 'Project name is required')
  .max(100, 'Project name too long')
  .refine(
    (name) => /^[a-zA-Z0-9\s\-_]+$/.test(name),
    'Project name can only contain letters, numbers, spaces, hyphens, and underscores'
  );

// Voice validation
export const voiceNameSchema = z.string()
  .min(1, 'Voice name is required')
  .max(50, 'Voice name too long')
  .refine(
    (name) => /^[a-zA-Z0-9\s\-_]+$/.test(name),
    'Voice name can only contain letters, numbers, spaces, hyphens, and underscores'
  );

// API key validation
export const apiKeySchema = z.string()
  .min(32, 'Invalid API key format')
  .max(128, 'Invalid API key format')
  .refine(
    (key) => /^[a-zA-Z0-9_-]+$/.test(key),
    'API key contains invalid characters'
  );

// Webhook URL validation
export const webhookUrlSchema = z.string()
  .url('Invalid webhook URL')
  .refine(
    (url) => url.startsWith('https://'),
    'Webhook URL must use HTTPS'
  );

// Team invitation validation
export const teamInviteSchema = z.object({
  email: emailSchema,
  role: z.enum(['admin', 'editor', 'viewer']),
  message: z.string().max(500, 'Message too long').optional(),
});

// Billing validation
export const couponCodeSchema = z.string()
  .min(3, 'Coupon code too short')
  .max(50, 'Coupon code too long')
  .refine(
    (code) => /^[A-Z0-9_-]+$/.test(code),
    'Invalid coupon code format'
  );

// Search and filter validation
export const searchQuerySchema = z.string()
  .max(100, 'Search query too long')
  .optional();

export const sortOrderSchema = z.enum(['asc', 'desc']);

export const dateRangeSchema = z.object({
  start: z.date(),
  end: z.date(),
}).refine(
  (data) => data.start <= data.end,
  'Start date must be before end date'
);

// Pagination validation
export const paginationSchema = z.object({
  page: z.number().min(1, 'Page must be at least 1').default(1),
  limit: z.number().min(1, 'Limit must be at least 1').max(100, 'Limit cannot exceed 100').default(20),
});

// Language validation
export const languageCodeSchema = z.string()
  .length(2, 'Language code must be 2 characters')
  .refine(
    (code) => /^[a-z]{2}$/.test(code),
    'Invalid language code format'
  );

// Custom validation functions
export function validateSSML(text: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Check for unclosed tags
  const openTags = text.match(/<[^/>]+>/g) || [];
  const closeTags = text.match(/<\/[^>]+>/g) || [];
  
  if (openTags.length !== closeTags.length) {
    errors.push('Unclosed SSML tags detected');
  }
  
  // Check for invalid SSML tags
  const validTags = ['speak', 'break', 'emphasis', 'prosody', 'say-as', 'phoneme', 'sub', 'mark'];
  const allTags = text.match(/<\/?([a-zA-Z]+)[^>]*>/g) || [];
  
  for (const tag of allTags) {
    const tagName = tag.match(/<\/?([a-zA-Z]+)/)?.[1];
    if (tagName && !validTags.includes(tagName)) {
      errors.push(`Invalid SSML tag: ${tagName}`);
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

export function validateCreditUsage(
  planTier: string,
  currentCredits: number,
  requestedCredits: number
): { valid: boolean; error?: string } {
  if (planTier === 'enterprise') {
    return { valid: true }; // Unlimited for enterprise
  }
  
  if (currentCredits < requestedCredits) {
    return {
      valid: false,
      error: `Insufficient credits. Required: ${requestedCredits}, Available: ${currentCredits}`,
    };
  }
  
  return { valid: true };
}