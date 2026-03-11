import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Database schema definition for the leaderboard table
// Stores player scores and timestamps for high-score tracking
export const leaderboard = pgTable("leaderboard", {
  id: serial("id").primaryKey(),
  playerName: text("player_name").notNull(),
  score: integer("score").notNull(),
  playedAt: timestamp("played_at").defaultNow().notNull(),
});

// Zod schema for validating leaderboard insert requests
// Automatically excludes auto-generated fields (id, playedAt)
export const insertLeaderboardSchema = createInsertSchema(leaderboard).omit({ id: true, playedAt: true });

// TypeScript types inferred from database schema
// Used for type-safe database operations
export type LeaderboardEntry = typeof leaderboard.$inferSelect;
export type InsertLeaderboardEntry = z.infer<typeof insertLeaderboardSchema>;

// API contract types for frontend-backend communication
// CreateLeaderboardRequest: payload sent from client to server
// LeaderboardResponse: response returned from server to client
export type CreateLeaderboardRequest = InsertLeaderboardEntry;
export type LeaderboardResponse = LeaderboardEntry;
