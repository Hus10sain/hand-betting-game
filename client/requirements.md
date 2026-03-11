## Packages
framer-motion | Essential for smooth tile dealing, layout transitions, and premium game feel
clsx | Utility for constructing className strings conditionally
tailwind-merge | Utility to merge tailwind classes without style conflicts

## Notes
The application relies purely on client-side state for game logic to ensure immediate responsiveness.
Leaderboard fetching and submission relies on standard REST endpoints defined in the schema.
Mahjong tiles are rendered using styled text and CSS rather than raw Unicode blocks to guarantee consistent, beautiful rendering across all operating systems.
