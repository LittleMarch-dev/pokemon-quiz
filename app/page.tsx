'use client';

import { useState, useEffect, useRef } from 'react';
import { REG_M_META_POOL, INDIVIDUAL_TYPES, RESISTANCES } from './data';

export default function VgcReviewTrainer() {
  const [scenarios, setScenarios] = useState<any[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [loading, setLoading] = useState(false);
  
  // Track answer histories mapped to navigate forward/backward
  const [history, setHistory] = useState<Record<number, { selectedIdx: number; isCorrect: boolean }>>({});
  const [totalQuestions, setTotalQuestions] = useState<number | null>(null);

  // Stats / Counters
  const [score, setScore] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [bestTime, setBestTime] = useState(0);
  
  // Hint Logic States
  const [timeForQuestion, setTimeForQuestion] = useState(0);
  const [eliminatedIndices, setEliminatedIndices] = useState<number[]>([]);

  const [gameActive, setGameActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [log, setLog] = useState('Select parameters to initialize match...');

  const stopwatchRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const savedScore = localStorage.getItem('vgc_best_score');
    const savedTime = localStorage.getItem('vgc_best_time');
    if (savedScore) setBestScore(parseInt(savedScore, 10));
    if (savedTime) setBestTime(parseInt(savedTime, 10));
  }, []);

  // Stopwatch global + Pemicu Hint per Soal
  useEffect(() => {
    if (gameActive && !loading && !isFinished) {
      stopwatchRef.current = setInterval(() => {
        setTimeElapsed((prev) => prev + 1);
        
        // Hanya hitung waktu jika pertanyaan aktif belum dijawab
        if (!history[currentIdx]) {
          setTimeForQuestion((prev) => {
            const nextTime = prev + 1;
            if (nextTime === 10) {
              triggerHint();
            }
            return nextTime;
          });
        }
      }, 1000);
    }
    return () => {
      if (stopwatchRef.current) clearInterval(stopwatchRef.current);
    };
  }, [gameActive, loading, isFinished, currentIdx, history]);

  // Fungsi untuk mengeliminasi 2 opsi yang salah sebagai Hint
  const triggerHint = () => {
    const currentQuestion = scenarios[currentIdx];
    if (!currentQuestion) return;

    const wrongIndices: number[] = [];
    currentQuestion.options.forEach((opt: any, idx: number) => {
      if (!opt.isCorrect) wrongIndices.push(idx);
    });

    // Acak dan ambil 2 indeks jawaban yang salah untuk dieliminasi
    const toEliminate = wrongIndices.sort(() => Math.random() - 0.5).slice(0, 2);
    setEliminatedIndices(toEliminate);
    setLog('💡 HINT ACTIVATED: 2 wrong answers eliminated due to time limit!');
  };

  const getEffectiveness = (attackType: string, defenderTypes: string[]) => {
    let finalMult = 1;
    
    defenderTypes.forEach(defType => {
      const formattedDefType = defType.charAt(0).toUpperCase() + defType.slice(1).toLowerCase();
      const interaction = RESISTANCES[attackType];
      
      if (interaction) {
        if (interaction.immune.includes(formattedDefType)) finalMult *= 0;
        else if (interaction.resists.includes(formattedDefType)) finalMult *= 0.5;
        else if (interaction.weak.includes(formattedDefType)) finalMult *= 2;
      }
    });

    return finalMult;
  };

  const startDrillSession = async (questionCount: number) => {
    setLoading(true);
    setTimeElapsed(0);
    setTimeForQuestion(0);
    setEliminatedIndices([]);
    setHistory({});
    setScore(0);
    setCurrentIdx(0);
    try {
      const compiled = [];

      const dualCombosSet = new Set<string>();
      while (dualCombosSet.size < 100) {
        const t1 = INDIVIDUAL_TYPES[Math.floor(Math.random() * INDIVIDUAL_TYPES.length)];
        const t2 = INDIVIDUAL_TYPES[Math.floor(Math.random() * INDIVIDUAL_TYPES.length)];
        if (t1 !== t2) {
          const alphaSortedPair = [t1, t2].sort().join(' / ');
          dualCombosSet.add(alphaSortedPair);
        }
      }
      const dynamicDualCombos = Array.from(dualCombosSet).map(str => str.split(' / '));

      const shuffledPool = [...REG_M_META_POOL].sort(() => Math.random() - 0.5);
      const matchPool = Array.from({ length: questionCount }, (_, i) => shuffledPool[i % shuffledPool.length]);

      for (const meta of matchPool) {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${meta.name}`);
        if (!res.ok) continue;
        const data = await res.json();

        const pokemonFetchedTypes = data.types.map((t: any) => {
          const name = t.type.name;
          return name.charAt(0).toUpperCase() + name.slice(1);
        });

        const randomStabType = pokemonFetchedTypes[Math.floor(Math.random() * pokemonFetchedTypes.length)];
        const interaction = RESISTANCES[randomStabType];
        if (!interaction) continue;

        const chosenMode: 'pivot' | 'weakness' = Math.random() > 0.5 ? 'pivot' : 'weakness';
        const correctChoices: string[] = [];
        const wrongChoices: string[] = [];

        if (chosenMode === 'pivot') {
          dynamicDualCombos.forEach(dualTypes => {
            const [type1, type2] = dualTypes;
            let mult1 = 1;
            if (interaction.immune.includes(type1)) mult1 = 0;
            else if (interaction.resists.includes(type1)) mult1 = 0.5;
            else if (interaction.weak.includes(type1)) mult1 = 2;

            let mult2 = 1;
            if (interaction.immune.includes(type2)) mult2 = 0;
            else if (interaction.resists.includes(type2)) mult2 = 0.5;
            else if (interaction.weak.includes(type2)) mult2 = 2;

            if (mult1 * mult2 < 1) correctChoices.push(dualTypes.join(' / '));
            else wrongChoices.push(dualTypes.join(' / '));
          });
        } else {
          INDIVIDUAL_TYPES.forEach(attackType => {
            const totalDamageMult = getEffectiveness(attackType, pokemonFetchedTypes);
            if (totalDamageMult >= 2) {
              correctChoices.push(`${attackType.toUpperCase()} MOVE`);
            } else {
              wrongChoices.push(`${attackType.toUpperCase()} MOVE`);
            }
          });
        }

        if (correctChoices.length === 0) {
          correctChoices.push(chosenMode === 'pivot' ? 'Steel / Flying' : 'Fairy MOVE');
        }

        const chosenCorrectText = correctChoices[Math.floor(Math.random() * correctChoices.length)];
        const uniqueWrongChoices = Array.from(new Set(wrongChoices)).filter(c => c !== chosenCorrectText);
        const selectedWrongTexts = uniqueWrongChoices.sort(() => Math.random() - 0.5).slice(0, 3);

        const finalFourGrid = [
          { text: chosenCorrectText, isCorrect: true },
          ...selectedWrongTexts.map(text => ({ text, isCorrect: false }))
        ].sort(() => Math.random() - 0.5);

        const cleanName = data.name
          .replace('-paldea-blaze-breed', ' (PALDEA-FIRE)')
          .replace('-paldea-aqua-breed', ' (PALDEA-WATER)')
          .replace('-alola', ' (ALOLA)')
          .replace('-hisui', ' (HISUI)')
          .replace('-wash', '-WASH')
          .replace('-heat', '-HEAT')
          .replace('-zero', '')
          .toUpperCase();

        compiled.push({
          name: cleanName,
          sprite: data.sprites.other['official-artwork'].front_default || data.sprites.front_default,
          types: pokemonFetchedTypes.map((t: string) => t.toUpperCase()),
          archetype: meta.archetype,
          mode: chosenMode,
          moveType: randomStabType,
          options: finalFourGrid
        });
      }

      setScenarios(compiled);
      setTotalQuestions(questionCount);
      setGameActive(true);
      setLog('Drill parameters configured successfully. Go!');
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleTurnCommit = (idx: number, isCorrect: boolean) => {
    if (history[currentIdx] || !gameActive || isFinished || totalQuestions === null) return;

    setHistory(prev => ({ ...prev, [currentIdx]: { selectedIdx: idx, isCorrect } }));

    if (isCorrect) {
      setScore(s => s + 1);
      setLog(q.mode === 'pivot' ? '🎯 SECURE PIVOT! Clean structural switch.' : '💥 SUPER EFFECTIVE! Matchup exploit successful.');
    } else {
      setLog('❌ STRATEGY FAULT! This typing selection takes fatal damage.');
    }
  };

  const navigateNext = () => {
    if (totalQuestions === null) return;
    
    if (currentIdx < totalQuestions - 1) {
      setCurrentIdx(prev => prev + 1);
      // Reset timer pertanyaan dan hint untuk soal berikutnya
      setTimeForQuestion(0);
      setEliminatedIndices([]);
      setLog(history[currentIdx + 1] ? 'Reviewing historic parameters...' : 'Awaiting manual entry inputs...');
    } else {
      setGameActive(false);
      setIsFinished(true);
      if (stopwatchRef.current) clearInterval(stopwatchRef.current);
      
      if (score > bestScore || (score === bestScore && (timeElapsed < bestTime || bestTime === 0))) {
        setBestScore(score);
        setBestTime(timeElapsed);
        localStorage.setItem('vgc_best_score', score.toString());
        localStorage.setItem('vgc_best_time', timeElapsed.toString());
        setLog('🏆 NEW RUN RECORD CONFIGURED!');
      } else {
        setLog('Drill loop sequence complete.');
      }
    }
  };

  const navigateBack = () => {
    if (currentIdx > 0) {
      setCurrentIdx(prev => prev - 1);
      // Bersihkan hint state karena melihat kembali soal lama
      setEliminatedIndices([]);
      setLog('Reviewing historic parameters...');
    }
  };

  const resetGame = () => {
    setCurrentIdx(0);
    setScore(0);
    setTimeElapsed(0);
    setTimeForQuestion(0);
    setEliminatedIndices([]);
    setHistory({});
    setGameActive(false);
    setIsFinished(false);
    setTotalQuestions(null);
    setLog('Select parameters to initialize match...');
  };

  if (totalQuestions === null) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-200 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-2xl text-center">
          <div className="flex justify-between items-center mb-6 border-b border-neutral-800 pb-3 font-mono text-[10px] text-neutral-500">
            <span>TACTICAL CONFIG CONTROL</span>
            <span>BEST RUN: <b className="text-amber-400">{bestScore} WINS ({bestTime}s)</b></span>
          </div>

          <h1 className="text-2xl font-black tracking-wider text-white mb-1">VGC STRATEGY DRILL</h1>
          <p className="text-xs font-mono text-neutral-400 mb-8 leading-relaxed">
            Configure queue constraints. You have a 10s automatic response hint window before 2 wrong answers clear out.
          </p>

          <div className="space-y-3 font-mono">
            {[5, 10, 20].map((count) => (
              <button
                key={count}
                onClick={() => startDrillSession(count)}
                className="w-full py-3.5 bg-zinc-950 hover:bg-neutral-800 border border-neutral-800 rounded-xl text-xs font-black tracking-widest transition-all text-zinc-400 hover:text-white uppercase"
              >
                ⚡ Start {count} Questions Queue
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 text-neutral-400 font-mono text-xs flex flex-col gap-2 items-center justify-center">
        <div className="w-5 h-5 border border-t-transparent border-white rounded-full animate-spin" />
        <span>MUTATING MATRIX PROPERTIES...</span>
      </div>
    );
  }

  const q = scenarios[currentIdx] || { name: '', sprite: '', types: [], archetype: '', mode: 'pivot', moveType: '', options: [] };
  const currentAnswerState = history[currentIdx];
  const hasAnswedThisOne = !!currentAnswerState;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-xl bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl relative">
        
        {/* TIMER BAR */}
        <div className="bg-neutral-950 px-4 py-3 border-b border-neutral-800 flex justify-between items-center font-mono text-[11px] tracking-wide text-neutral-400">
          <div className="flex items-center gap-3">
            <span className="px-2 py-0.5 bg-zinc-800 text-zinc-200 rounded font-bold">⏱️ {timeElapsed}s</span>
            <span>QUEUE: <b className="text-white">{currentIdx + 1}/{totalQuestions}</b></span>
            <span>SCORE: <b className="text-white">{score}</b></span>
            {!hasAnswedThisOne && (
              <span className="text-[10px] text-amber-400 animate-pulse">
                ⏳ Hint in: {Math.max(0, 10 - timeForQuestion)}s
              </span>
            )}
          </div>
          <div>🏆 RECORD: <b className="text-amber-400">{bestScore} PTS ({bestTime}s)</b></div>
        </div>

        {/* COMBAT HEADER */}
        <div className="p-6 bg-gradient-to-b from-neutral-900 to-zinc-950 border-b border-neutral-800 flex flex-col items-center relative">
          <span className="absolute top-4 left-4 text-[9px] font-mono tracking-wider px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700/40 uppercase">
            {q.archetype}
          </span>
          
          <span className={`absolute top-4 right-4 text-[9px] font-black font-mono tracking-widest px-2.5 py-0.5 rounded border uppercase ${
            q.mode === 'pivot' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'
          }`}>
            {q.mode === 'pivot' ? 'PIVOT DEFENSER' : 'HIT WEAKNESS ATTACK'}
          </span>

          {q.sprite && <img src={q.sprite} alt={q.name} className="w-24 h-24 object-contain mb-1.5 drop-shadow-md" />}
          <h2 className="text-xl font-black tracking-wide text-white">{q.name}</h2>
          
          <div className="flex gap-1 mt-1">
            {q.types.map((t: string) => (
              <span key={t} className="text-[9px] px-2 py-0.5 bg-zinc-800 text-zinc-400 uppercase font-mono rounded font-bold">{t}</span>
            ))}
          </div>
        </div>

        {/* CONTEXT REPORT */}
        <div className="p-4 bg-black/40 text-sm border-b border-neutral-800/60 text-amber-200 font-mono leading-relaxed">
          {q.mode === 'pivot' ? (
            <p>&gt; Opponent's <span className="text-white font-bold">{q.name}</span> threatens a STAB <span className="text-white font-black underline decoration-amber-500/50">{q.moveType?.toUpperCase()}</span> hit! Select a dual-type combo that safely **RESISTS/ABSORBS** it:</p>
          ) : (
            <p>&gt; Target threat <span className="text-white font-bold">{q.name}</span> (<span className="text-neutral-400">{q.types.join(' / ')}</span>) is active! Select a **SINGLE TYPE MOVE** that scores super-effective ($2\times$ or $4\times$) damage:</p>
          )}
        </div>

        {/* INPUT GRID BUTTON TERMINAL */}
        <div className="p-4 grid grid-cols-2 gap-3">
          {q.options?.map((opt: any, idx: number) => {
            const hasChosenThisOption = currentAnswerState?.selectedIdx === idx;
            const isEliminated = eliminatedIndices.includes(idx);
            
            let style = "bg-zinc-950 border-neutral-800 text-neutral-300 hover:bg-neutral-800";
            
            if (hasAnswedThisOne || isFinished) {
              if (opt.isCorrect) style = "bg-emerald-950 text-emerald-400 border-emerald-600 font-bold shadow-[0_0_10px_rgba(16,185,129,0.1)]";
              else if (hasChosenThisOption) style = "bg-rose-950 text-rose-400 border-rose-600 font-bold";
              else style = "bg-zinc-950/20 text-zinc-600 border-zinc-900 opacity-20";
            } else if (isEliminated) {
              // Menyembunyikan jawaban yang tereliminasi oleh hint
              style = "bg-zinc-900/30 text-zinc-700/40 border-zinc-950/40 opacity-20 pointer-events-none line-through";
            }

            return (
              <button
                key={idx}
                disabled={hasAnswedThisOne || isFinished || isEliminated}
                onClick={() => handleTurnCommit(idx, opt.isCorrect)}
                className={`w-full py-4 px-2 text-center rounded-xl text-xs border tracking-wider font-mono transition-all font-black uppercase active:scale-98 ${style}`}
              >
                {isEliminated ? "---" : opt.text}
              </button>
            );
          })}
        </div>

        {/* FOOTER MANUEVER CONTROLS */}
        <div className="bg-neutral-950 p-4 border-t border-neutral-800 flex justify-between items-center text-xs font-mono">
          <div className="flex gap-2">
            <button
              disabled={currentIdx === 0}
              onClick={navigateBack}
              className={`px-3 py-1.5 rounded font-bold transition flex items-center gap-1 ${
                currentIdx > 0 ? 'bg-zinc-800 hover:bg-zinc-700 text-white cursor-pointer' : 'bg-zinc-900 text-zinc-600 cursor-not-allowed'
              }`}
            >
              ← Back
            </button>
            
            <button
              disabled={!hasAnswedThisOne || isFinished}
              onClick={navigateNext}
              className={`px-3 py-1.5 rounded font-bold transition ${
                hasAnswedThisOne && !isFinished ? 'bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer' : 'bg-zinc-900 text-zinc-600 cursor-not-allowed'
              }`}
            >
              {currentIdx === totalQuestions - 1 ? 'Finish Drill ✓' : 'Next Turn →'}
            </button>
          </div>

          <div className="text-zinc-400 max-w-[50%] leading-relaxed truncate text-right">
            <span>{log}</span>
          </div>

          {isFinished && (
            <button onClick={resetGame} className="bg-white text-black px-4 py-1.5 rounded-lg font-bold font-sans hover:bg-neutral-200 transition">
              Menu
            </button>
          )}
        </div>

      </div>
    </div>
  );
}