export type CardType = 'KING' | 'QUEEN' | 'ACE' | 'JOKER';

export interface Card {
  type: CardType;
  id: string;
}

export interface Player {
  id: number;
  name: string;
  lives: number;
  cards: Card[];
  isBot: boolean;
}

export interface GameState {
  players: Player[];
  currentTable: 'KING' | 'QUEEN' | 'ACE';
  currentPlayerIndex: number;
  previousCards: Card[];
  deck: Card[];
  gameOver: boolean;
  winner: Player | null;
  lastAction: string;
}
