import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

// API route registration function
// Called during server initialization to set up all endpoints
// Uses paths and schemas from shared/routes.ts for consistency
export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // GET /api/leaderboard
  // Retrieves the top 5 highest scores from the leaderboard
  // Returns an array of LeaderboardEntry objects sorted by score descending
  app.get(api.leaderboard.list.path, async (req, res) => {
    try {
      const topScores = await storage.getTopScores(5);
      res.status(200).json(topScores);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch leaderboard" });
    }
  });

  // POST /api/leaderboard
  // Creates a new leaderboard entry with player name and score
  // Validates input using Zod schema, returns 400 if validation fails
  // Returns 201 with the newly created entry on success
  app.post(api.leaderboard.create.path, async (req, res) => {
    try {
      // Validate request body against the API contract schema
      const input = api.leaderboard.create.input.parse(req.body);
      const score = await storage.createScore(input);
      res.status(201).json(score);
    } catch (err) {
      // Handle validation errors from Zod
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      res.status(500).json({ message: "Failed to save score" });
    }
  });

  return httpServer;
}
