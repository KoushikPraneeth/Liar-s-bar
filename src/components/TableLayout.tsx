import React from 'react';
import { Player as PlayerComponent } from './Player';
import { Player } from '../types/game';

interface TableLayoutProps {
  players: Player[];
  currentPlayerIndex: number;
  onCardSelect?: (cardIndex: number) => void;
}

export const TableLayout: React.FC<TableLayoutProps> = ({
  players,
  currentPlayerIndex,
  onCardSelect,
}) => {
  console.log('TableLayout players:', players);
  return (
    <div className="relative w-full pb-[50%] max-w-4xl mx-auto">
      {/* Circular table background */}
      <div className="absolute inset-x-0 bottom-0 h-[50%] rounded-t-full bg-green-800 shadow-xl" />

      {/* Render current player's cards at the bottom */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full flex justify-center">
        <PlayerComponent
          player={players[0]}
          isCurrentPlayer={currentPlayerIndex === 0}
          onCardSelect={onCardSelect}
        />
      </div>

      {/* Render other players' cards at the top */}
      <div className="absolute top-0 left-0 w-full flex justify-around">
        {players.slice(1).map((player, index) => {
          const playerIndex = index + 1;
          return (
            <div key={player.id} className="w-1/4">
              <PlayerComponent
                player={player}
                isCurrentPlayer={currentPlayerIndex === playerIndex}
                onCardSelect={onCardSelect}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
