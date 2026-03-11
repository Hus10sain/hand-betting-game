// Tile definitions and game mechanics for Mahjong-style tiles
// Handles deck generation, shuffling, and hand value calculation

export type TileCategory = 'number' | 'wind' | 'dragon';
export type Suit = 'character' | 'bamboo' | 'dot' | 'none';

// MahjongTileDef represents a single tile in the game
// id: unique instance identifier (changes each game)
// baseId: tile type identifier (stays same across instances of same tile)
// isDynamic: true for winds/dragons (values change based on wins/losses), false for number tiles
export interface MahjongTileDef {
  id: string;
  baseId: string;
  category: TileCategory;
  suit: Suit;
  rank: number;
  character: string;
  subCharacter?: string;
  colorClass: string;
  isDynamic: boolean;
}

// Readable labels for number tiles
const NUMBERS = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

// Creates 36 tiles (4 copies each of ranks 1-9) for a single suit
function createSuitTiles(suit: Suit, subChar: string, colorClass: string): MahjongTileDef[] {
  const tiles: MahjongTileDef[] = [];
  for (let i = 0; i < 9; i++) {
    for (let copy = 0; copy < 4; copy++) {
      tiles.push({
        id: `${suit}-${i + 1}-${copy}`,
        baseId: `${suit}-${i + 1}`,
        category: 'number',
        suit,
        rank: i + 1,
        character: NUMBERS[i],
        subCharacter: subChar,
        colorClass,
        isDynamic: false,
      });
    }
  }
  return tiles;
}

// Creates honor tiles: 4 winds and 3 dragons, 4 copies each
// These tiles have dynamic values that increase/decrease based on game outcomes
function createHonorTiles(): MahjongTileDef[] {
  const tiles: MahjongTileDef[] = [];

  const winds = [
    { name: 'east', char: 'E', subChar: 'EAST', color: 'text-slate-800' },
    { name: 'south', char: 'S', subChar: 'SOUTH', color: 'text-slate-800' },
    { name: 'west', char: 'W', subChar: 'WEST', color: 'text-slate-800' },
    { name: 'north', char: 'N', subChar: 'NORTH', color: 'text-slate-800' },
  ];

  const dragons = [
    { name: 'red', char: 'R', subChar: 'RED', color: 'text-red-600' },
    { name: 'green', char: 'G', subChar: 'GREEN', color: 'text-green-600' },
    { name: 'white', char: 'W', subChar: 'WHITE', color: 'text-blue-600' },
  ];

  // Create 4 copies of each wind
  winds.forEach(w => {
    for (let copy = 0; copy < 4; copy++) {
      tiles.push({
        id: `wind-${w.name}-${copy}`,
        baseId: `wind-${w.name}`,
        category: 'wind',
        suit: 'none',
        rank: 0,
        character: w.char,
        subCharacter: w.subChar,
        colorClass: w.color,
        isDynamic: true,
      });
    }
  });

  // Create 4 copies of each dragon
  dragons.forEach(d => {
    for (let copy = 0; copy < 4; copy++) {
      tiles.push({
        id: `dragon-${d.name}-${copy}`,
        baseId: `dragon-${d.name}`,
        category: 'dragon',
        suit: 'none',
        rank: 0,
        character: d.char,
        subCharacter: d.subChar,
        colorClass: d.color,
        isDynamic: true,
      });
    }
  });

  return tiles;
}

// Generates a complete 136-tile deck
export function generateFullDeck(): MahjongTileDef[] {
  return [
    ...createSuitTiles('character', 'CHAR', 'text-red-700'),
    ...createSuitTiles('bamboo', 'BAM', 'text-green-700'),
    ...createSuitTiles('dot', 'DOT', 'text-blue-700'),
    ...createHonorTiles(),
  ];
}

// Fisher-Yates shuffle algorithm
export function shuffleDeck(deck: MahjongTileDef[]): MahjongTileDef[] {
  const newDeck = [...deck];
  for (let i = newDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
  }
  return newDeck;
}

// Initialize dynamic value tracking for honor tiles
// All winds and dragons start with a base value of 5
export function getInitialDynamicValues(): Record<string, number> {
  const values: Record<string, number> = {};
  const deck = generateFullDeck();
  deck.forEach(t => {
    if (t.isDynamic) {
      values[t.baseId] = 5;
    }
  });
  return values;
}

// Calculates the total value of a hand
// Number tiles: contribute their rank (1-9)
// Dynamic tiles (winds/dragons): contribute their current dynamic value
export function calculateHandValue(
  hand: MahjongTileDef[],
  dynamicValues: Record<string, number>
): number {
  return hand.reduce((total, tile) => {
    if (tile.isDynamic) {
      return total + (dynamicValues[tile.baseId] || 0);
    }
    return total + tile.rank;
  }, 0);
}