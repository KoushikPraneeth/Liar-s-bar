import React from 'react';
import { Crown, Award, Coffee } from 'lucide-react';
import { CardType } from '../types/game';

interface CardProps {
  type: CardType;
  currentTable?: 'KING' | 'QUEEN' | 'ACE';  // For Joker cards
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ type, currentTable, onClick }) => {
  const getIcon = () => {
    // If it's a Joker and we have a current table, show that table's icon
    if (type === 'JOKER' && currentTable) {
      switch (currentTable) {
        case 'KING':
          return <Crown className="w-6 h-6" />;
        case 'QUEEN':
          return <Crown className="w-6 h-6 text-purple-500" />;
        case 'ACE':
          return <Award className="w-6 h-6" />;
      }
    }

    // Otherwise show the card's normal icon
    switch (type) {
      case 'KING':
        return <Crown className="w-6 h-6" />;
      case 'QUEEN':
        return <Crown className="w-6 h-6 text-purple-500" />;
      case 'ACE':
        return <Award className="w-6 h-6" />;
      case 'JOKER':
        return <Coffee className="w-6 h-6" />;
    }
  };

  return (
    <div
      onClick={onClick}
      className={`
        w-16 h-24 
        bg-white 
        rounded-lg 
        border border-gray-300 
        flex flex-col 
        items-center 
        justify-center 
        ${onClick ? 'cursor-pointer hover:shadow-lg' : ''}
        ${type === 'JOKER' ? 'bg-yellow-50' : ''}
      `}
    >
      {getIcon()}
      <span className="mt-2 text-sm font-semibold">
        {type === 'JOKER' && currentTable ? `${type} (${currentTable})` : type}
      </span>
    </div>
  );
};
