import { Card, CardType, Player, TableType } from '../types/game';

export function createDeck(): Card[] {
  const deck: Card[] = [];
  const types: CardType[] = ['KING', 'QUEEN', 'ACE'];
  
  // Add 6 of each regular card
  types.forEach(type => {
    for (let i = 0; i < 6; i++) {
      deck.push({ type, id: `${type}-${i}` });
    }
  });
  
  // Add 2 jokers
  deck.push({ type: 'JOKER', id: 'JOKER-1' });
  deck.push({ type: 'JOKER', id: 'JOKER-2' });
  
  return shuffleDeck(deck);
}

export function shuffleDeck(deck: Card[]): Card[] {
  const newDeck = [...deck];
  for (let i = newDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
  }
  return newDeck;
}

export function dealCards(deck: Card[], numCards: number): [Card[], Card[]] {
  const dealtCards = deck.slice(0, numCards);
  const remainingDeck = deck.slice(numCards);
  return [dealtCards, remainingDeck];
}

export function getRandomTable(): TableType {
  const tables: TableType[] = ['KING', 'QUEEN', 'ACE'];
  return tables[Math.floor(Math.random() * tables.length)];
}

export function createPlayers(): Player[] {
  return [
    { id: 1, name: 'Player 1', lives: 6, cards: [], isBot: false },
    { id: 2, name: 'Player 2', lives: 6, cards: [], isBot: false },
    { id: 3, name: 'Player 3', lives: 6, cards: [], isBot: false },
    { id: 4, name: 'Player 4', lives: 6, cards: [], isBot: false },
  ];
}
