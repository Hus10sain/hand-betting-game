type ScoreInput = {
  playerName: string;
  score: number;
};

type ScoreEntry = {
  id: number;
  playerName: string;
  score: number;
  playedAt: Date;
};

let leaderboard: ScoreEntry[] = [];

export const storage = {
  async getTopScores(limit: number) {
    return [...leaderboard]
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  },

  async createScore(input: ScoreInput) {
    const newScore: ScoreEntry = {
      id: Date.now(),
      playerName: input.playerName,
      score: input.score,
      playedAt: new Date(),
    };

    leaderboard.push(newScore);
    return newScore;
  },
};