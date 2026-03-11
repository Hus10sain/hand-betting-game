import { z } from 'zod';
import { insertLeaderboardSchema, leaderboard } from './schema';

// Reusable error response schemas used across all API endpoints
// Standardizes error messages for consistent client-side error handling
export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

// API contract definition - single source of truth for endpoint paths and schemas
// Both backend and frontend import from this to ensure consistency
// Includes HTTP method, URL path, input validation schema, and response schemas by status code
export const api = {
  leaderboard: {
    // Retrieve top 5 leaderboard entries
    // GET /api/leaderboard -> returns array of LeaderboardEntry objects
    list: {
      method: 'GET' as const,
      path: '/api/leaderboard' as const,
      responses: {
        200: z.array(z.custom<typeof leaderboard.$inferSelect>()),
      },
    },
    // Submit a new score to the leaderboard
    // POST /api/leaderboard -> accepts playerName and score, returns saved entry
    create: {
      method: 'POST' as const,
      path: '/api/leaderboard' as const,
      input: insertLeaderboardSchema,
      responses: {
        201: z.custom<typeof leaderboard.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  },
};

// Utility function to replace URL parameters with actual values
// Example: buildUrl('/api/leaderboard/:id', { id: 42 }) -> '/api/leaderboard/42'
export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

// Type exports - inferred from API schemas for type-safe frontend usage
export type LeaderboardInput = z.infer<typeof api.leaderboard.create.input>;
export type LeaderboardResponse = z.infer<typeof api.leaderboard.create.responses[201]>;
export type LeaderboardListResponse = z.infer<typeof api.leaderboard.list.responses[200]>;
