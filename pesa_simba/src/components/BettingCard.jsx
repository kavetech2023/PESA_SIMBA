import React from 'react';
import { TrendingUp } from 'lucide-react';

export function BettingCard({ candidate, votes, userBet, getPercentage, onOpenBetting }) {
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 hover:transform hover:scale-105 transition-all">
      <img
        src={candidate.image}
        alt={candidate.name}
        className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-white/20"
      />
      <h2 className="text-2xl font-bold text-center mb-2">{candidate.name}</h2>
      <p className="text-center text-lg mb-4">{candidate.party}</p>
      
      <div className="relative h-4 bg-gray-700 rounded-full mb-4">
        <div
          className={`absolute left-0 top-0 h-full rounded-full ${
            candidate.party === "Republican" ? "bg-red-500" : "bg-blue-500"
          }`}
          style={{
            width: `${getPercentage(votes[candidate.name] || 0)}%`
          }}
        />
      </div>
      
      <div className="flex justify-between items-center mb-4">
        <span className="flex items-center gap-1">
          <TrendingUp className="w-4 h-4" />
          {votes[candidate.name] || 0} votes
        </span>
        <span>{getPercentage(votes[candidate.name] || 0)}%</span>
      </div>

      <button
        onClick={() => onOpenBetting(candidate)}
        disabled={userBet === candidate.name}
        className={`w-full py-3 rounded-lg font-bold transition-colors ${
          userBet === candidate.name
            ? "bg-green-600 cursor-not-allowed"
            : candidate.party === "Republican"
            ? "bg-red-600 hover:bg-red-700"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {userBet === candidate.name
          ? "Current Bet Placed!"
          : "Place Bet"}
      </button>
    </div>
  );
}