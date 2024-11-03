import React from 'react';

export function CategoryCard({ title, icon: Icon, description, active, onClick }) {
  return (
    <div 
      onClick={onClick}
      className={`bg-white/10 backdrop-blur-lg rounded-xl p-6 cursor-pointer hover:transform hover:scale-105 transition-all ${
        active ? 'ring-2 ring-yellow-400' : ''
      }`}
    >
      <div className="flex items-center gap-4 mb-4">
        <div className="p-3 rounded-full bg-white/20">
          <Icon className="w-6 h-6 text-yellow-400" />
        </div>
        <h2 className="text-xl font-bold">{title}</h2>
      </div>
      <p className="text-white/80">{description}</p>
      <div className="mt-4 flex justify-between items-center">
        <span className="text-sm text-white/60">Active bets: {active ? 'Yes' : 'No'}</span>
        <button className="px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors">
          View Bets
        </button>
      </div>
    </div>
  );
}