import React from 'react';
import { Facebook, Twitter, Linkedin, Mail } from 'lucide-react';

export function Share() {
  const shareUrl = 'https://codegarden.space';
  const title = 'Presidential Betting live now (Trump & kamala).';
  const description = 'Bet on your favorite candidate and win big!';



  return (
    <div className="bg-white/10 mx-auto mt-10 backdrop-blur-lg rounded-lg p-6 max-w-5xl">
      <div className="flex items-center gap-4">
        <a href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`} target="_blank" rel="noreferrer" className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-full transition-colors text-white font-semibold">
          <Facebook className="w-6 h-6" />
        </a>
        <a href={`https://twitter.com/share?url=${shareUrl}&text=${title}`} target="_blank" rel="noreferrer" className="bg-blue-400 hover:bg-blue-500 px-4 py-2 rounded-full transition-colors text-white font-semibold">
          <Twitter className="w-6 h-6" />
        </a>
        <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}&title=${title}&summary=${description}&source=${shareUrl}`} target="_blank" rel="noreferrer" className="bg-blue-800 hover:bg-blue-900 px-4 py-2 rounded-full transition-colors text-white font-semibold">
          <Linkedin className="w-6 h-6" />
        </a>
        <a href={`mailto:?subject=${title}&body=${description}%0D%0A${shareUrl}`} target="_blank" rel="noreferrer" className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-full transition-colors text-white font-semibold">
          <Mail className="w-6 h-6" />
        </a>
      </div>
    </div>
  );
}
