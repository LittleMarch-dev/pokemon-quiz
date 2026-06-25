'use client';

import { useState } from 'react';
import { DEFENSE_STORY_GUIDE, ATTACK_STORY_GUIDE, COMBINED_MASTER_STORIES, POKEMON_TYPE_THEMES, VGC_META_POPULARITY_ORDER } from './dictionaryData';

interface VgcDictionaryProps {
  onClose: () => void;
}

export default function VgcDictionary({ onClose }: VgcDictionaryProps) {
  const [tab, setTab] = useState<'attack' | 'defense' | 'master'>('master');
  const [searchQuery, setSearchQuery] = useState('');

  const getCurrentGuide = () => {
    if (tab === 'attack') return ATTACK_STORY_GUIDE;
    if (tab === 'defense') return DEFENSE_STORY_GUIDE;
    return COMBINED_MASTER_STORIES;
  };

  const currentGuide = getCurrentGuide();

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

  const filteredTypes = Object.keys(currentGuide)
    .filter(typeKey => 
      typeKey.toLowerCase().includes(searchQuery.toLowerCase()) ||
      currentGuide[typeKey].toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      // Cari posisi indeks di array popularitas (jika tidak ada, taruh di paling belakang)
      const indexA = VGC_META_POPULARITY_ORDER.indexOf(a);
      const indexB = VGC_META_POPULARITY_ORDER.indexOf(b);
      
      const posA = indexA === -1 ? 99 : indexA;
      const posB = indexB === -1 ? 99 : indexB;
      
      return posA - posB; // Mengurutkan dari indeks terkecil (paling populer) ke terbesar
    });
  return (
    <div className="fixed inset-0 bg-zinc-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-2xl flex flex-col h-[85vh] shadow-[0_0_50px_rgba(0,0,0,0.5)] font-mono">
        
        {/* HEADER */}
        <div className="bg-neutral-950 p-4 border-b border-neutral-800 flex flex-col sm:flex-row gap-3 justify-between sm:items-center">
          <div>
            <h2 className="text-sm font-black text-white tracking-widest flex items-center gap-2">
              <span className="animate-pulse text-indigo-400">●</span> 📖 VGC LORE DICTIONARY
            </h2>
            <p className="text-[10px] text-neutral-500 uppercase mt-0.5">Mnemonic chart memory bank database</p>
          </div>
          <div className="flex gap-2 items-center">
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

        {/* 3-TAB PANEL NAVIGATION */}
        <div className="grid grid-cols-3 bg-neutral-950/30 border-b border-neutral-800 text-[10px] sm:text-xs text-center font-bold">
          <button 
            onClick={() => setTab('master')}
            className={`py-3.5 tracking-wider transition-all uppercase ${tab === 'master' ? 'text-indigo-400 border-b-2 border-indigo-500 bg-indigo-500/5' : 'text-neutral-500 hover:text-neutral-300 bg-transparent'}`}
          >
            🧠 Master Combo
          </button>
          <button 
            onClick={() => setTab('attack')}
            className={`py-3.5 tracking-wider transition-all uppercase ${tab === 'attack' ? 'text-red-400 border-b-2 border-red-500 bg-red-500/5' : 'text-neutral-500 hover:text-neutral-300 bg-transparent'}`}
          >
            ⚔️ Attack
          </button>
          <button 
            onClick={() => setTab('defense')}
            className={`py-3.5 tracking-wider transition-all uppercase ${tab === 'defense' ? 'text-amber-400 border-b-2 border-amber-500 bg-amber-500/5' : 'text-neutral-500 hover:text-neutral-300 bg-transparent'}`}
          >
            🛡️ Defense
          </button>
        </div>

        {/* ========================================== */}
        {/* FITUR TAMBAHAN: LEGENDA ARTI IKON TAKTIS   */}
        {/* ========================================== */}
        <div className="bg-neutral-950/90 border-b border-neutral-800 px-4 py-2.5 grid grid-cols-2 gap-y-1 sm:flex sm:flex-wrap sm:gap-x-6 sm:justify-center text-[10px] text-zinc-400 tracking-wide">
          <div className="flex items-center gap-1.5">
            <span>💥</span> <b className="text-emerald-400">Super Effective</b> (2x/4x)
          </div>
          <div className="flex items-center gap-1.5">
            <span>🛡️</span> <b className="text-blue-400">Resist</b> (0.5x/0.25x)
          </div>
          <div className="flex items-center gap-1.5">
            <span>🚫</span> <b className="text-purple-400">Immune</b> (0x/Kebal)
          </div>
          <div className="flex items-center gap-1.5">
            <span>🧪</span> <b className="text-red-400">Weakness</b> (Titik Lemah)
          </div>
          <div className="flex items-center gap-1.5">
            <span>🕳️</span> <b className="text-zinc-500">Miss/Gagal</b> (Tidak Berpengaruh)
          </div>
        </div>

        {/* LIST DISPLAY */}
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
                  <div className={`w-28 shrink-0 font-black text-[11px] py-1 rounded bg-zinc-950/80 border ${theme.border} uppercase tracking-widest text-center ${theme.text}`}>
                    {typeKey}
                  </div>
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

        {/* STATUS BAR FOOTER */}
        <div className="bg-neutral-950 px-4 py-2 border-t border-neutral-800 text-[9px] text-neutral-500 flex justify-between items-center shrink-0">
          <span>INDEXED ENTRIES: {filteredTypes.length} TYPES</span>
          <span>STORY MODE: {tab === 'master' ? 'COMBINED COGNITIVE MNEMONICS' : tab === 'attack' ? 'OFFENSIVE WEAKNESS' : 'DEFENSIVE RESISTANCES'}</span>
        </div>

      </div>
    </div>
  );
}