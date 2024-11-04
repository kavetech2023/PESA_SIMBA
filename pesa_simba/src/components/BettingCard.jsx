import React, { useState } from 'react';
import { TrendingUp, DollarSign } from 'lucide-react';
import { LiveVotingData } from './LiveVotingData';

const PRESET_AMOUNTS = [1, 5, 10, 50, 100, 500, 1000];

export function BettingCard({ candidate, votes, userBet, getPercentage, onOpenBetting }) {
  const [stakeAmount, setStakeAmount] = useState(10);
  const [isHovered, setIsHovered] = useState(false); // Added state to track hover state

  const calculatePotentialWin = () => {
    // Assuming a fixed prize for simplicity
    return stakeAmount * 1.5; // Example: Double the stake amount as the potential win
  };

  const handleBetClick = () => {
    onOpenBetting(candidate, stakeAmount, calculatePotentialWin());
  };

  const handleAmountSelect = (amount) => {
    setStakeAmount(amount);
  };

  const handleHover = () => {
    setIsHovered(true);
  };

  const handleLeave = () => {
    setIsHovered(false);
  };

  return (
    <div 
      className={`bg-white rounded-xl shadow-xl p-6 transform hover:scale-[1.02] transition-all ${userBet ? 'bg-white' : 'bg-white'} ${isHovered ? 'shadow-green-glow' : ''}`}
      onMouseEnter={handleHover}
      onMouseLeave={handleLeave}
    >
      <img
        src={candidate.image}
        alt={candidate.name}
        className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-gray-100"
      />
      <h2 className="text-2xl font-bold text-center mb-2 text-gray-800">{candidate.name}</h2>
      <p className="text-center text-lg mb-4 text-gray-600">{candidate.party}</p>
      
      
      
      <div className="relative h-4 bg-gray-100 rounded-full mb-4">
        <div
          className={`absolute left-0 top-0 h-full rounded-full ${
            candidate.party === "Republican" ? "bg-red-500" : "bg-blue-500"
          }`}
          style={{
            width: `${getPercentage(votes[candidate.name] || 0)}%`
          }}
        />
      </div>
      
      

      {!userBet && (
        <div className="space-y-4">
          <div className="grid grid-cols-5 gap-2">
            {PRESET_AMOUNTS.map((amount) => (
              <button
                key={amount}
                onClick={() => handleAmountSelect(amount)}
                className={`p-2 text-sm rounded-lg transition-colors ${
                  stakeAmount === amount
                    ? candidate.party === "Republican"
                      ? 'bg-red-500 text-white'
                      : 'bg-blue-500 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                }`}
              >
                ${amount}
              </button>
            ))}
          </div>

          <button
            onClick={handleBetClick}
            className={`w-full py-4 rounded-lg font-bold text-lg transition-colors text-white ${
              candidate.party === "Republican"
                ? "bg-red-500 hover:bg-red-600"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            Place ${stakeAmount} Bet
          </button>
          <div className="text-center">
            <div className="text-xl font-bold text-green-600">
              Potential Win: ${calculatePotentialWin().toFixed(2)}
            </div>
          </div>
          <LiveVotingData candidate={candidate} />
          
        </div>
      )}

      {userBet === candidate.name && (
        <div className="bg-green-500 text-white rounded-lg p-4 text-center font-bold">
          Current Bet Placed!
        </div>
      )}

<div className="flex justify-between items-center mb-6">
        <span className="flex items-center gap-1 text-gray-600">
          <TrendingUp className="w-4 h-4" />
          {votes[candidate.name] || 10000} votes
        </span>
        <span className="text-lg font-semibold text-gray-800">{getPercentage(50)}%</span>
      </div>
    </div>
  );
}