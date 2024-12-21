import React from 'react';
import { Card as CardComponent } from './Card';
import { Player as PlayerType } from '../types/game';
import { Heart } from 'lucide-react';

interface PlayerProps {
  player: PlayerType;
  isCurrentPlayer: boolean;
  onCardSelect?: (cardIndex: number) => void;
}

export const Player: React.FC<PlayerProps> = ({ player, isCurrentPlayer, onCardSelect }) => {
  console.log('Player component, player:', player);
  return (
    <div className={`p-4 rounded-lg ${isCurrentPlayer ? 'bg-blue-50' : 'bg-gray-50'}`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold">{player.name}</h3>
        <div className="flex items-center">
          {Array.from({ length: player.lives }).map((_, i) => (
            <Heart key={i} className="w-5 h-5 text-red-500 ml-1" />
          ))}
        </div>
      </div>
      <div className="flex gap-2 flex-wrap">
        {player.cards.map((card, index) => (
          <CardComponent
            key={card.id}
            type={card.type}
            onClick={onCardSelect ? () => onCardSelect(index) : undefined}
            faceDown={false} // Ensure cards are always face up
          />
        ))}
      </div>
    </div>
  );
};
