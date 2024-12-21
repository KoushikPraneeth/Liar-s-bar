import React, { useState, useEffect } from 'react';
import { Card as CardComponent } from './Card';
import { GameState, Card, Player } from '../types/game';

const INITIAL_PLAYERS = [
  { id: 1, name: 'Player 1', lives: 6, cards: [], isBot: false },
  { id: 2, name: 'Player 2', lives: 6, cards: [], isBot: false },
  { id: 3, name: 'Player 3', lives: 6, cards: [], isBot: false },
  { id: 4, name: 'Player 4', lives: 6, cards: [], isBot: false }
];

export const GameBoard: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    players: [...INITIAL_PLAYERS],
    currentTable: 'KING',
    currentPlayerIndex: 0,
    previousCards: [],
    deck: [],
    gameOver: false,
    winner: null,
    lastAction: 'Game started'
  });

  const [selectedCardIndices, setSelectedCardIndices] = useState<number[]>([]);
  const [turnTimer, setTurnTimer] = useState<number>(20);

  useEffect(() => {
    initializeGame();
  }, []);

  useEffect(() => {
    let timerId: NodeJS.Timeout;
    if (!gameState.gameOver) {
      timerId = setTimeout(() => {
        if (turnTimer > 0) {
          setTurnTimer(turnTimer - 1);
        } else {
          handleTimeOut();
        }
      }, 1000);
    }

    return () => clearTimeout(timerId);
  }, [gameState, turnTimer]);

  const createDeck = (): Card[] => {
    const deck: Card[] = [];
    const types = ['KING', 'QUEEN', 'ACE'];
    
    types.forEach(type => {
      for (let i = 0; i < 6; i++) {
        deck.push({ type: type as 'KING' | 'QUEEN' | 'ACE', id: `${type}-${i}` });
      }
    });
    
    deck.push({ type: 'JOKER', id: 'JOKER-1' });
    deck.push({ type: 'JOKER', id: 'JOKER-2' });
    
    return shuffleDeck(deck);
  };

  const shuffleDeck = (deck: Card[]): Card[] => {
    const newDeck = [...deck];
    for (let i = newDeck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
    }
    return newDeck;
  };

  const dealCards = (players: Player[]) => {
    const deck = createDeck();
    return players.map(player => ({
      ...player,
      cards: deck.splice(0, 5)
    }));
  };

  const initializeGame = () => {
    const updatedPlayers = dealCards([...INITIAL_PLAYERS]);
    setGameState(prevState => ({
      ...prevState,
      players: updatedPlayers,
      currentPlayerIndex: 0,
      previousCards: [],
      currentTable: ['KING', 'QUEEN', 'ACE'][Math.floor(Math.random() * 3)] as 'KING' | 'QUEEN' | 'ACE',
      gameOver: false,
      winner: null,
      lastAction: 'New game started'
    }));
    setSelectedCardIndices([]);
    setTurnTimer(20);
  };

  const toggleCardSelection = (cardIndex: number) => {
    setSelectedCardIndices(prev => {
      if (prev.includes(cardIndex)) {
        return prev.filter(i => i !== cardIndex);
      } else {
        return [...prev, cardIndex];
      }
    });
  };

  const handlePlayCards = () => {
    if (selectedCardIndices.length === 0) return;

    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    const selectedCards = selectedCardIndices
      .sort((a, b) => b - a) // Sort in descending order to remove from end first
      .map(index => currentPlayer.cards[index]);

    const updatedPlayers = [...gameState.players];
    const updatedCards = [...currentPlayer.cards];
    
    // Remove the played cards
    selectedCardIndices.sort((a, b) => b - a).forEach(index => {
      updatedCards.splice(index, 1);
    });

    updatedPlayers[gameState.currentPlayerIndex] = {
      ...currentPlayer,
      cards: updatedCards
    };

    setGameState(prevState => ({
      ...prevState,
      players: updatedPlayers,
      previousCards: selectedCards,
      currentPlayerIndex: (prevState.currentPlayerIndex + 1) % prevState.players.length,
      lastAction: `${currentPlayer.name} played ${selectedCards.length} card${selectedCards.length > 1 ? 's' : ''}`
    }));
    
    setSelectedCardIndices([]);
    setTurnTimer(20);
  };

  const handleAccusation = () => {
    if (gameState.previousCards.length === 0) return;

    const accuser = gameState.players[gameState.currentPlayerIndex];
    const previousPlayerIndex = (gameState.currentPlayerIndex - 1 + gameState.players.length) % gameState.players.length;
    const accusedPlayer = gameState.players[previousPlayerIndex];

    const updatedPlayers = [...gameState.players];
    let accusationResult = '';

    // Check if ANY of the played cards don't match the current table (excluding Jokers)
    const hasInvalidCard = gameState.previousCards.some(card => 
      card.type !== 'JOKER' && card.type !== gameState.currentTable
    );

    if (hasInvalidCard) {
      // Accusation was correct
      updatedPlayers[previousPlayerIndex] = { ...accusedPlayer, lives: accusedPlayer.lives - 1 };
      accusationResult = `${accuser.name} caught ${accusedPlayer.name} lying!`;
    } else {
      // Accusation was wrong
      updatedPlayers[gameState.currentPlayerIndex] = { ...accuser, lives: accuser.lives - 1 };
      accusationResult = `${accuser.name} accused wrongly and lost a life!`;
    }

    // Filter out eliminated players
    const remainingPlayers = updatedPlayers.filter(player => player.lives > 0);

    if (remainingPlayers.length === 1) {
      setGameState(prevState => ({
        ...prevState,
        players: remainingPlayers,
        gameOver: true,
        winner: remainingPlayers[0],
        lastAction: `${accusationResult} - Game Over!`
      }));
    } else {
      const playersWithNewCards = dealCards(remainingPlayers);
      setGameState(prevState => ({
        ...prevState,
        players: playersWithNewCards,
        previousCards: [],
        currentTable: ['KING', 'QUEEN', 'ACE'][Math.floor(Math.random() * 3)] as 'KING' | 'QUEEN' | 'ACE',
        currentPlayerIndex: 0,
        lastAction: `${accusationResult} - New round started!`
      }));
    }
    setTurnTimer(20);
  };

  const handleTimeOut = () => {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    setGameState(prevState => ({
      ...prevState,
      currentPlayerIndex: (prevState.currentPlayerIndex + 1) % prevState.players.length,
      lastAction: `${currentPlayer.name}'s time ran out!`
    }));
    setTurnTimer(20);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 text-center">
          <h1 className="text-4xl font-bold mb-2">Liar's Bar</h1>
          <p className="text-lg text-gray-600">Current Table: {gameState.currentTable}'s Table</p>
          <p className="text-md text-gray-500 mt-2">{gameState.lastAction}</p>
          <p className="text-lg font-semibold mt-2">Current Turn: {gameState.players[gameState.currentPlayerIndex]?.name}</p>
          <p className="text-lg font-semibold mt-2">Time Remaining: {turnTimer} seconds</p>
        </div>

        {/* Display all players and their cards */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {gameState.players.map((player, index) => (
            <div 
              key={player.id} 
              className={`p-4 rounded-lg ${index === gameState.currentPlayerIndex ? 'bg-blue-50' : 'bg-white'}`}
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold">{player.name}</h3>
                <div className="text-red-500">Lives: {player.lives}</div>
              </div>
              <div className="flex flex-wrap gap-2">
                {player.cards.map((card, cardIndex) => (
                  <div
                    key={card.id}
                    onClick={() => index === gameState.currentPlayerIndex ? toggleCardSelection(cardIndex) : null}
                    className={`cursor-pointer ${
                      index === gameState.currentPlayerIndex ? 'hover:scale-105' : ''
                    } ${
                      selectedCardIndices.includes(cardIndex) ? 'transform scale-110 ring-2 ring-blue-500' : ''
                    }`}
                  >
                    <CardComponent 
                      type={card.type} 
                      currentTable={card.type === 'JOKER' ? gameState.currentTable : undefined}
                    />
                  </div>
                ))}
              </div>
              {index === gameState.currentPlayerIndex && selectedCardIndices.length > 0 && (
                <div className="mt-4 text-center">
                  <button
                    onClick={handlePlayCards}
                    className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                  >
                    Play Selected Cards ({selectedCardIndices.length})
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Previous cards and accusation button */}
        {gameState.previousCards.length > 0 && (
          <div className="text-center mt-8">
            <p className="mb-2">Previous cards played:</p>
            <div className="flex justify-center gap-2 mb-4">
              {gameState.previousCards.map((card, index) => (
                <CardComponent 
                  key={index}
                  type={card.type} 
                  currentTable={card.type === 'JOKER' ? gameState.currentTable : undefined}
                />
              ))}
            </div>
            <button
              onClick={handleAccusation}
              className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Call Liar!
            </button>
          </div>
        )}

        {/* Game over state */}
        {gameState.gameOver && gameState.winner && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg text-center">
              <h2 className="text-3xl font-bold mb-4">Game Over!</h2>
              <p className="text-xl mb-4">Winner: {gameState.winner.name}</p>
              <button
                onClick={initializeGame}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Start New Game
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
