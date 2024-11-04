import React from 'react';
import { Heart } from 'lucide-react';

export function CharityBanner() {
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4 mb-6 text-center animate-fade-in">
      <div className="flex items-center justify-center gap-2 text-white">
        <Heart className="w-5 h-5 text-white" />
        <p className="text-sm font-medium">
          100% of lost bets will be donated to charity.
        </p>
       
        <Heart className="w-5 h-5" />
      </div>
    </div>
  );
}