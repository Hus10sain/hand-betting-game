import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import type { LeaderboardInput } from "@shared/routes";

// Fetches the top 5 leaderboard entries from the server
// Uses React Query for automatic caching and refetching
// Validates response data against the API schema
export function useLeaderboard() {
  return useQuery({
    queryKey: [api.leaderboard.list.path],
    queryFn: async () => {
      const res = await fetch(api.leaderboard.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch leaderboard");
      const data = await res.json();
      // Validate response matches the API contract
      return api.leaderboard.list.responses[200].parse(data);
    },
  });
}

// Submits a player's score to the leaderboard
// Validates input data before sending to server
// On success, invalidates leaderboard cache to trigger refresh
// Properly handles validation errors from the server
export function useSubmitScore() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: LeaderboardInput) => {
      // Validate client-side input
      const validated = api.leaderboard.create.input.parse(data);
      
      const res = await fetch(api.leaderboard.create.path, {
        method: api.leaderboard.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      
      if (!res.ok) {
        // Handle validation errors from server
        if (res.status === 400) {
          const error = api.leaderboard.create.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Failed to submit score");
      }
      
      // Validate response matches API contract
      return api.leaderboard.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      // Refresh leaderboard to show the newly submitted score
      queryClient.invalidateQueries({ queryKey: [api.leaderboard.list.path] });
    },
  });
}
