import React from 'react';

export default function Footer() {
  return (
    <footer className="mt-10 border-t border-white/10 bg-slate-950/80">
      <div className="max-w-6xl mx-auto px-4 py-4 text-xs text-slate-400 flex justify-between">
        <span>© {new Date().getFullYear()} PokéData</span>
        <span>Powered by PokéAPI</span>
      </div>
    </footer>
  );
}
