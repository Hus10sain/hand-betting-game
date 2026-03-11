# Hand Betting Game

A simple high-low betting game implemented with React and Node.js.  
The game uses Mahjong-style tiles to calculate hand values and challenges the player to predict whether the next hand will be higher or lower.

---

## Features

- High / Low betting gameplay
- Tile-based scoring system
- Dynamic tile values (winds and dragons)
- Leaderboard for top scores
- Responsive UI

---

## Game Rules

1. The player starts a new game and receives a hand of tiles.
2. Each tile contributes to the hand value:
   - Number tiles → value from **1 to 9**
   - Wind and Dragon tiles → start at **5** and change dynamically.
3. The player must predict whether the **next hand value** will be **higher or lower**.
4. If the prediction is correct:
   - The player's **streak increases**.
5. If the prediction is incorrect:
   - The game ends and the final streak becomes the score.

---

## Project Structure


client/ → React frontend
server/ → Express API
shared/ → Shared types and schemas


---

## Installation

Clone the repository:


git clone <repo-url>


Install dependencies:


npm install


---

## Run the Project

Start the development server:


npm run dev


Then open:


http://localhost:3000


---

## Technologies Used

- React
- TypeScript
- Vite
- Node.js
- Express

---

## Notes

The leaderboard is stored in memory for simplicity in this implementation.  
It can easily be replaced with a persistent database if needed.

---

## Author

Husain Naser
