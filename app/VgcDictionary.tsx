'use client';

import { useState } from 'react';
import { DEFENSE_STORY_GUIDE, ATTACK_STORY_GUIDE, COMBINED_MASTER_STORIES, POKEMON_TYPE_THEMES, VGC_META_POPULARITY_ORDER } from './dictionaryData';

interface VgcDictionaryProps {
  onClose: () => void;
}

export default function VgcDictionary({ onClose }: VgcDictionaryProps) {
  const [tab, setTab] = useState<'attack' | 'defense' | 'master'>('master');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Menggunakan string huruf kecil untuk pelacakan flash yang aman
  const [activeFlashId, setActiveFlashId] = useState<string | null>(null);

  const getCurrentGuide = () => {
    if (tab === 'attack') return ATTACK_STORY_GUIDE;
    if (tab === 'defense') return DEFENSE_STORY_GUIDE;
    return COMBINED_MASTER_STORIES;
  };

  const currentGuide = getCurrentGuide();

  // PERBAIKAN SINKRONISASI: Format ID diubah ke lowercase murni agar kebal bug huruf besar/kecil
  // PERBAIKAN: Fungsi parser dengan deteksi Enter (Newline) Mutlak
  const renderColoredText = (text: string) => {
    // 1. Pecah teks berdasarkan simbol enter (\n) terlebih dahulu
    return text.split('\n').map((line, lineIndex) => {
      
      // 2. Pecah masing-masing kata di dalam baris tersebut
      const words = line.split(/(\s+|\/)/);
      const renderedWords = words.map((word, wordIndex) => {
        const cleanWord = word.replace(/[^a-zA-Z]/g, '').toUpperCase();
        const theme = POKEMON_TYPE_THEMES[cleanWord];
        
        if (theme) {
          const typeLower = cleanWord.toLowerCase();
          const targetId = `dict-card-${typeLower}`;
          
          return (
            <button
              key={wordIndex}
              onClick={() => {
                const element = document.getElementById(targetId);
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  setActiveFlashId(typeLower);
                  setTimeout(() => setActiveFlashId(null), 1500);
                }
              }}
              className={`${theme.text} font-black hover:underline cursor-pointer transition-all uppercase tracking-wide bg-zinc-950/40 px-1 rounded mx-0.5 border border-transparent hover:border-zinc-700`}
              title={`Jump to ${cleanWord} section`}
            >
              {word}
            </button>
          );
        }
        return <span key={wordIndex} className="text-zinc-300">{word}</span>;
      });

      // 3. Bungkus setiap baris dengan <div> agar otomatis turun ke bawah secara fisik
      return (
        <div key={lineIndex} className="mb-1.5 last:mb-0">
          {renderedWords}
        </div>
      );
    });
  };

  const filteredTypes = Object.keys(currentGuide)
    .filter(typeKey => 
      typeKey.toLowerCase().includes(searchQuery.toLowerCase()) ||
      currentGuide[typeKey].toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      // 1. Paksa array master meta menjadi huruf kecil semua
      const cleanMetaOrder = VGC_META_POPULARITY_ORDER.map(item => item.trim().toLowerCase());
      
      // 2. Paksa nama tipe dari key objek menjadi huruf kecil semua
      const cleanA = a.trim().toLowerCase();
      const cleanB = b.trim().toLowerCase();
      
      // 3. Ambil posisi index kecocokannya
      const indexA = cleanMetaOrder.indexOf(cleanA);
      const indexB = cleanMetaOrder.indexOf(cleanB);
      
      // 4. Jika tidak ketemu, lempar ke paling belakang (index 99)
      const posA = indexA === -1 ? 99 : indexA;
      const posB = indexB === -1 ? 99 : indexB;
      
      return posA - posB;
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
          <button onClick={() => setTab('master')} className={`py-3.5 tracking-wider transition-all uppercase ${tab === 'master' ? 'text-indigo-400 border-b-2 border-indigo-500 bg-indigo-500/5' : 'text-neutral-500 hover:text-neutral-300 bg-transparent'}`}>🧠 Master Combo</button>
          <button onClick={() => setTab('attack')} className={`py-3.5 tracking-wider transition-all uppercase ${tab === 'attack' ? 'text-red-400 border-b-2 border-red-500 bg-red-500/5' : 'text-neutral-500 hover:text-neutral-300 bg-transparent'}`}>⚔️ Attack</button>
          <button onClick={() => setTab('defense')} className={`py-3.5 tracking-wider transition-all uppercase ${tab === 'defense' ? 'text-amber-400 border-b-2 border-amber-500 bg-amber-500/5' : 'text-neutral-500 hover:text-neutral-300 bg-transparent'}`}>🛡️ Defense</button>
        </div>

        {/* LEGENDA */}
        <div className="bg-neutral-950/90 border-b border-neutral-800 px-4 py-2.5 grid grid-cols-2 gap-y-1.5 sm:flex sm:flex-wrap sm:gap-x-6 sm:justify-center text-[10px] text-zinc-400 tracking-wide">
          <div className="flex items-center gap-1.5">
            <span>💥</span> <b className="text-emerald-400">Super Effective (x2 / x4)</b>
          </div>
          <div className="flex items-center gap-1.5">
            <span>🛡️</span> <b className="text-blue-400">Resist / Menahan (x0.5 / x0.25)</b>
          </div>
          <div className="flex items-center gap-1.5">
            <span>🚫</span> <b className="text-purple-400">Immune / Kebal (x0)</b>
          </div>
          <div className="flex items-center gap-1.5">
            <span>🧪</span> <b className="text-red-400">Weakness / Titik Lemah (x2)</b>
          </div>
          <div className="flex items-center gap-1.5">
            <span>🕳️</span> <b className="text-zinc-500">Miss / Gagal Serang (x0)</b>
          </div>
        </div>

        {/* LIST DISPLAY */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-neutral-950/10 scroll-smooth">
          {filteredTypes.length > 0 ? (
            filteredTypes.map((typeKey) => {
              const fullTypeName = typeKey.toUpperCase();
              const theme = POKEMON_TYPE_THEMES[fullTypeName] || { bg: 'bg-zinc-900', text: 'text-zinc-400', border: 'border-zinc-800', glow: '' };
              
              // PERBAIKAN SINKRONISASI: Bandingkan kecocokan flash menggunakan lowercase murni
              const isFlashing = activeFlashId === typeKey.toLowerCase();
              
              return (
                <div 
                  key={typeKey}
                  // PERBAIKAN SINKRONISASI: Gunakan lowercase murni pada properti ID kartu HTML
                  id={`dict-card-${typeKey.toLowerCase()}`}
                  className={`p-3.5 border rounded-xl flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4 transition-all duration-300 shadow-sm ${theme.bg} ${theme.glow} ${
                    isFlashing 
                      ? 'animate-pulse border-white scale-[1.01] ring-2 ring-white/20 bg-zinc-900/90 shadow-[0_0_15px_rgba(255,255,255,0.15)]' 
                      : `${theme.border} hover:border-zinc-500`
                  }`}
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