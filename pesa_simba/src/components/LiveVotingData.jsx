import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Globe } from 'lucide-react';

const MOCK_COUNTRIES = [
  'United States', 'Canada', 'United Kingdom', 'Germany', 'France', 
  'Japan', 'Australia', 'Brazil', 'India', 'South Africa','China'
];

export function LiveVotingData({ candidate }) {
  const [votingData, setVotingData] = useState([]);

  useEffect(() => {
    const generateVote = () => ({
      country: MOCK_COUNTRIES[Math.floor(Math.random() * MOCK_COUNTRIES.length)],
      amount: Math.floor(Math.random() * 10000) + 1000,
      timestamp: new Date(),
      trend: Math.random() > 0.5 ? 'up' : 'down'
    });

    setVotingData(Array(5).fill(null).map(generateVote));

    const interval = setInterval(() => {
      setVotingData(prev => [generateVote(), ...prev.slice(0, 4)]);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gray-50 rounded-lg p-4 mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
        <Globe className="w-5 h-5" />
        Live Bets 
      </h3>
      
      <div className="space-y-2">
        {votingData.map((vote, index) => (
          <div 
            key={index}
            className="flex items-center justify-between p-2 bg-white rounded-lg shadow-sm animate-fade-in"
          >
            <div className="flex items-center gap-2">
              <span className={`${
                vote.trend === 'up' ? 'text-green-500' : 'text-red-500'
              }`}>
                {vote.trend === 'up' ? 
                  <TrendingUp className="w-4 h-4" /> : 
                  <TrendingDown className="w-4 h-4" />
                }
              </span>
              <span className="text-gray-700">{vote.country}</span>
            </div>
            <div className="text-right">
              <span className={`font-mono ${
                vote.trend === 'up' ? 'text-green-500' : 'text-red-500'
              }`}>
                {vote.amount.toLocaleString()} votes
              </span>
              <div className="text-xs text-gray-500">
                {new Date(vote.timestamp).toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}