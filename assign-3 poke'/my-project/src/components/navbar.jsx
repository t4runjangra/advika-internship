import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <header className="border-b border-white/10 bg-slate-900/80 backdrop-blur">
      <nav className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between"> 
        <Link to="/" className="text-xl font-bold text-amber-400">
          PokéData
        </Link>
        <div className="flex gap-14 text-sm">
          <Link to="/" className="hover:text-amber-300 hover:scale-125  hover:rounded-1 py-0.5 px-1.5 transition-all">Home</Link>
          <Link to="/pokemon-list" className="hover:text-amber-300 hover:scale-125  hover:rounded-1 py-0.5 px-1.5 transition-all">Pokémon</Link>
          <Link to="/about" className="hover:text-amber-300 hover:scale-125  hover:rounded-1 py-0.5 px-1.5 transition-all">About</Link>
          
        </div>
      </nav>
    </header>
  );
}
