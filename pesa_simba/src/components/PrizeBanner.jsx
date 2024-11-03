import React from 'react';
import { Car, Trophy } from 'lucide-react';

export function PrizeBanner() {
  return (
    <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-6 rounded-xl shadow-2xl mb-8 animate-fade-in">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-white mb-2">🏆 Grand Prize Pool</h2>
        <p className="text-white/80">Place your bets for a chance to win these amazing prizes!</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 transform hover:scale-105 transition-all">
          <div className="flex items-center justify-center mb-4">
            <Car className="w-12 h-12 text-yellow-300" />
          </div>
          <h3 className="text-xl font-bold text-white text-center">1st Prize</h3>
          <p className="text-lg text-white/90 text-center mt-2">Audi RSQ8 2024</p>
          <p className="text-sm text-yellow-300 text-center mt-2 font-semibold">Value: $150,000</p>
        </div>
        
        {[
          { icon: Trophy, prize: "2nd Prize", amount: "$500,000", color: "text-yellow-300" },
          { icon: Trophy, prize: "3rd Prize", amount: "$100,000", color: "text-gray-300" },
          { icon: Trophy, prize: "4th Prize", amount: "$50,000", color: "text-amber-600" }
        ].map((item, index) => (
          <div key={index} className="bg-white/10 backdrop-blur-lg rounded-lg p-6 transform hover:scale-105 transition-all">
            <div className="flex items-center justify-center mb-4">
              <item.icon className={`w-10 h-10 ${item.color}`} />
            </div>
            <h3 className="text-xl font-bold text-white text-center">{item.prize}</h3>
            <p className="text-lg text-white/90 text-center mt-2">{item.amount}</p>
          </div>
        ))}
      </div>
    </div>
  );
}