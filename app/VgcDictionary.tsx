'use client';

import { useState } from 'react';
import { DEFENSE_STORY_GUIDE, ATTACK_STORY_GUIDE, POKEMON_TYPE_THEMES } from './dictionaryData';

interface VgcDictionaryProps {
  onClose: () => void;
}

export default function VgcDictionary({ onClose }: VgcDictionaryProps) {
  const [tab, setTab] = useState<'attack' | 'defense'>('attack');
  const [searchQuery, setSearchQuery] = useState('');

  const currentGuide = tab === 'attack' ? ATTACK_STORY_GUIDE : DEFENSE_STORY_GUIDE;

  // Fungsi parser pewarnaan kata kunci otomatis
  const renderColoredText = (text: string) => {
    const words = text.split(/(\s+|\/)/);
    return words.map((word, i) => {
      const cleanWord = word.replace(/[^a-zA-Z]/g, '').toUpperCase();
      const theme = POKEMON_TYPE_THEMES[cleanWord];
      if (theme) {
        return <span key={i} className={`${theme.text} font-bold`}>{word}</span>;
      }
      return <span key={i} className="text-zinc-300">{word}</span>;
    });
  };

  // Filter list berdasarkan kolom pencarian
  const filteredTypes = Object.keys(currentGuide).filter(typeKey => 
    typeKey.toLowerCase().includes(searchQuery.toLowerCase()) ||
    currentGuide[typeKey].toLowerCase().includes(searchQuery.toLowerCase())
  ).sort();

  return (
    <div className="fixed inset-0 bg-zinc-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-2xl flex flex-col h-[85vh] shadow-[0_0_50px_rgba(0,0,0,0.5)] font-mono">
        
        {/* HEADER CONTROL BAR */}
        <div className="bg-neutral-950 p-4 border-b border-neutral-800 flex flex-col sm:flex-row gap-3 justify-between sm:items-center">
          <div>
            <h2 className="text-sm font-black text-white tracking-widest flex items-center gap-2">
              <span className="animate-pulse text-amber-400">●</span> 📖 VGC LORE DICTIONARY
            </h2>
            <p className="text-[10px] text-neutral-500 uppercase mt-0.5">Mnemonic chart memory bank database</p>
          </div>
          <div className="flex gap-2 items-center">
            {/* INPUT PENCARIAN INSTAN */}
            <input 
              type="text"
              placeholder="SEARCH TYPE..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1 text-[11px] text-white focus:outline-none focus:border-neutral-600 max-w-[150px] uppercase placeholder-zinc-600"
            />
            <button 
              onClick={onClose}
              className="px-3 py-1 bg-zinc-800 hover:bg-red-950 hover:text-red-400 text-white rounded text-[11px] font-bold transition-all border border-zinc-700/60 hover:border-red-900 cursor-pointer"
            >
              CLOSE TERMINAL
            </button>
          </div>
        </div>

        {/* TAB SWITCH PANEL */}
        <div className="grid grid-cols-2 bg-neutral-950/30 border-b border-neutral-800 text-xs text-center font-bold">
          <button 
            onClick={() => setTab('attack')}
            className={`py-3.5 tracking-wider transition-all uppercase ${tab === 'attack' ? 'text-red-400 border-b-2 border-red-500 bg-red-500/5' : 'text-neutral-500 hover:text-neutral-300 bg-transparent'}`}
          >
            ⚔️ Hit Weakness (Offensive)
          </button>
          <button 
            onClick={() => setTab('defense')}
            className={`py-3.5 tracking-wider transition-all uppercase ${tab === 'defense' ? 'text-amber-400 border-b-2 border-amber-500 bg-amber-500/5' : 'text-neutral-500 hover:text-neutral-300 bg-transparent'}`}
          >
            🛡️ Pivot Absorber (Defensive)
          </button>
        </div>

        {/* SCROLLABLE GRID DISPLAY */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-neutral-950/10">
          {filteredTypes.length > 0 ? (
            filteredTypes.map((typeKey) => {
              const fullTypeName = typeKey.toUpperCase();
              const theme = POKEMON_TYPE_THEMES[fullTypeName] || { bg: 'bg-zinc-900', text: 'text-zinc-400', border: 'border-zinc-800', glow: '' };
              
              return (
                <div 
                  key={typeKey} 
                  className={`p-3.5 ${theme.bg} border ${theme.border} rounded-xl flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4 hover:border-zinc-600 transition-all duration-200 shadow-sm ${theme.glow}`}
                >
                  {/* BADGE ELEMEN */}
                  <div className={`w-28 shrink-0 font-black text-[11px] py-1 rounded bg-zinc-950/80 border ${theme.border} uppercase tracking-widest text-center ${theme.text}`}>
                    {typeKey}
                  </div>
                  {/* ISI ARTIKEL KALIMAT */}
                  <div className="text-[11px] leading-relaxed text-zinc-300 pt-0.5">
                    {renderColoredText(currentGuide[typeKey])}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 text-zinc-600 text-xs border border-dashed border-zinc-800 rounded-xl">
              NO MATCHING TYPE MATRIX FOUND WITHIN THE LOGIC CORE.
            </div>
          )}
        </div>

        {/* DICTIONARY STATUS BAR FOOTER */}
        <div className="bg-neutral-950 px-4 py-2 border-t border-neutral-800 text-[9px] text-neutral-500 flex justify-between items-center shrink-0">
          <span>INDEXED ENTRIES: {filteredTypes.length} TYPES</span>
          <span>STORY MODE: {tab === 'attack' ? 'OFFENSIVE MULTIPLIERS' : 'DEFENSIVE RESISTANCES'}</span>
        </div>

      </div>
    </div>
  );
}