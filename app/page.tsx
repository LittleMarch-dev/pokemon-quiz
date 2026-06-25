'use client';

import { useState, useEffect, useRef } from 'react';
import { REG_M_META_POOL, INDIVIDUAL_TYPES, RESISTANCES } from './data';
import VgcDictionary from './VgcDictionary';

export default function VgcReviewTrainer() {
  const [scenarios, setScenarios] = useState<any[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isLaunching, setIsLaunching] = useState(false);
  const [showDictionary, setShowDictionary] = useState(false);

  const [history, setHistory] = useState<Record<number, { selectedIdx: number; isCorrect: boolean }>>({});
  const [totalQuestions, setTotalQuestions] = useState<number | null>(null);

  const [score, setScore] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [bestTime, setBestTime] = useState(0);
  
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

 useEffect(() => {
    // Cek apakah soal saat ini sudah dijawab
    const hasAnswered = !!history[currentIdx];

    // Jika game aktif, tidak sedang loading, belum selesai, DAN user BELUM menjawab soal ini, jalankan waktu
    if (gameActive && !loading && !isFinished && !hasAnswered) {
      stopwatchRef.current = setInterval(() => {
        setTimeElapsed((prev) => prev + 1);
        
        setTimeForQuestion((prev) => {
          const nextTime = prev + 1;
          if (nextTime === 10) {
            triggerHint();
          }
          return nextTime;
        });
      }, 1000);
    }

    // Bersihkan interval jika kondisi di atas tidak terpenuhi (termasuk saat hasAnswered berubah menjadi true)
    return () => {
      if (stopwatchRef.current) clearInterval(stopwatchRef.current);
    };
  }, [gameActive, loading, isFinished, currentIdx, history]);

  const triggerHint = () => {
    const currentQuestion = scenarios[currentIdx];
    if (!currentQuestion) return;

    const wrongIndices: number[] = [];
    currentQuestion.options.forEach((opt: any, idx: number) => {
      if (!opt.isCorrect) wrongIndices.push(idx);
    });

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

  // SISTEM ROTASI LINTAS SESI (ANTI-REPEAT GLOBAL VIA LOCALSTORAGE)
  const startDrillSession = async (questionCount: number) => {
    if (isLaunching) return;
    setIsLaunching(true);
    setLoading(true);

    setTimeElapsed(0);
    setTimeForQuestion(0);
    setEliminatedIndices([]);
    setHistory({});
    setScore(0);
    setCurrentIdx(0);

    try {
      const compiled = [];

      // Ambil riwayat Pokémon yang sudah pernah muncul dari localStorage
      const historyRaw = localStorage.getItem('vgc_pokemon_history');
      let playedHistory: string[] = historyRaw ? JSON.parse(historyRaw) : [];

      // Filter pool: Utamakan Pokémon yang belum pernah dimainkan dalam rotasi ini
      let availablePool = REG_M_META_POOL.filter(p => !playedHistory.includes(p.name));

      // Jika pool yang tersisa lebih sedikit dari jumlah pertanyaan, reset riwayatnya (Siklus Baru)
      if (availablePool.length < questionCount) {
        playedHistory = [];
        localStorage.removeItem('vgc_pokemon_history');
        availablePool = [...REG_M_META_POOL];
      }

      // Acak pool yang tersedia menggunakan Fisher-Yates
      let shuffledPool = [...availablePool];
      for (let i = shuffledPool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledPool[i], shuffledPool[j]] = [shuffledPool[j], shuffledPool[i]];
      }

      // Ambil sejumlah questionCount dari pool hasil acakan
      const matchPool = shuffledPool.slice(0, questionCount);

      // Simpan Pokémon yang terpilih saat ini ke dalam riwayat lintas sesi
      const newHistory = [...playedHistory, ...matchPool.map(p => p.name)];
      localStorage.setItem('vgc_pokemon_history', JSON.stringify(newHistory));

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
      setIsLaunching(false); 
    } catch (err) {
      console.error(err);
      setLoading(false);
      setIsLaunching(false);
    }
  };

  const handleTurnCommit = (idx: number, isCorrect: boolean) => {
    if (history[currentIdx] || !gameActive || isFinished || totalQuestions === null) return;

    setHistory(prev => ({ ...prev, [currentIdx]: { selectedIdx: idx, isCorrect } }));

    if (isCorrect) {
      setScore(s => s + 1);
      setLog(q.mode === 'pivot' ? '🎯 SECURE PIVOT! Safe positioning calculated.' : '💥 SUPER EFFECTIVE! Matchup exploit successful.');
    } else {
      const defenseStoryGuide: Record<string, string> = {
        'Fairy': 'Serangan FAIRY (sihir suci) akan melempem dan diredam dengan mudah oleh tameng besi (STEEL), racun (POISON), atau kobaran api (FIRE)!',
        'Electric': 'Aliran ELECTRIC (daya listrik) akan otomatis bocor terserap bumi (GROUND), atau diredam oleh sesama listrik (ELECTRIC), naga (DRAGON), & tumbuhan (GRASS)__',
        'Ground': 'Gempa bumi GROUND tidak akan menyentuh burung di langit (FLYING), serta diredam oleh serangga (BUG) dan lebatnya tumbuhan (GRASS)!',
        'Dark': 'Taktik kotor penjahat DARK akan dipatahkan oleh kehormatan kesatria (FIGHTING), dongeng suci (FAIRY), atau sesama penjahat (DARK)!',
        'Fire': 'Kobaran api FIRE akan langsung padam oleh air (WATER), batuan padat (ROCK), sisik naga (DRAGON), atau sesama elemen api (FIRE)!',
        'Steel': 'Senjata besi STEEL akan tumpul menabrak air (WATER), setrum listrik (ELECTRIC), kobaran api (FIRE), atau tebalnya dinding baja (STEEL)!',
        'Ghost': 'Teror hantu GHOST sama sekali tidak menyentuh dimensi fisik manusia (NORMAL) dan diredam oleh kegelapan (DARK)!',
        'Grass': 'Serapan tumbuhan GRASS akan layu oleh api (FIRE), racun (POISON), senjata besi (STEEL), sayap burung (FLYING), naga (DRAGON), serangga (BUG), atau sesama (GRASS)!',
        'Water': 'Siraman air WATER akan diserap oleh tumbuhan (GRASS), ditahan sisik naga (DRAGON), atau diredam oleh sesama air (WATER)!',
        'Dragon': 'Amukan monster DRAGON hanya bisa ditahan oleh perisai besi (STEEL), dan sihir suci (FAIRY) sepenuhnya kebal dari naga!',
        'Rock': 'Lemparan batu ROCK akan pecah menabrak otot petarung (FIGHTING), atau tameng besi (STEEL) yang tebal!',
        'Psychic': 'Kekuatan pikiran PSYCHIC akan diredam oleh dinding baja (STEEL), atau dibaca oleh sesama kekuatan mental (PSYCHIC)!',
        'Ice': 'Udara beku ICE akan mencair oleh kobaran api (FIRE), dibendung air (WATER), ditahan tameng besi (STEEL), atau sesama es (ICE)!',
        'Fighting': 'Pukulan fisik FIGHTING akan diredam oleh racun (POISON), burung (FLYING), pikiran (PSYCHIC), serangga (BUG), atau sihir (FAIRY)!',
        'Poison': 'Limbah beracun POISON akan diredam oleh tanah (GROUND), batuan (ROCK), hantu (GHOST), sesama racun (POISON), dan dinding besi (STEEL) benar-benar kebal!',
        'Flying': 'Tusukan burung FLYING akan tertahan oleh tebalnya batuan (ROCK), dinding besi (STEEL), atau sengatan listrik (ELECTRIC)!',
        'Bug': 'Gigitan serangga BUG akan diredam oleh otot petarung (FIGHTING), sayap burung (FLYING), racun (POISON), hantu (GHOST), besi (STEEL), api (FIRE), atau sihir (FAIRY)!'
      };

      const attackStoryGuide: Record<string, string> = {
        'Ground': 'GROUND hancurkan baja (STEEL) & tiang listrik (ELECTRIC)!',
        'Dark': 'DARK sukses meneror hantu (GHOST) & merusak mental (PSYCHIC)!',
        'Fire': 'FIRE membakar habis alam (GRASS/BUG/ICE) & melelehkan besi (STEEL)!',
        'Steel': 'STEEL itu senjata tajam pemotong ICE & ROCK, serta menebas peri (FAIRY)!',
        'Ghost': 'GHOST bisa leluasa meneror sesama hantu (GHOST) & merusak mental (PSYCHIC)!',
        'Grass': 'GRASS akarnya menjebol batu/tanah (ROCK/GROUND) & menyerap air (WATER)!',
        'Water': 'WATER memadamkan kobaran FIRE & mengikis tanah/batu (GROUND/ROCK)!',
        'Dragon': 'DRAGON itu monster legendaris yang hanya bisa ditumbangkan sesama DRAGON!',
        'Rock': 'ROCK batunya menjatuhkan burung (FLYING), meremukkan BUG, dan memadamkan FIRE!',
        'Psychic': 'PSYCHIC mengontrol fisik petarung (FIGHTING) & menetralisir racun (POISON)!',
        'Electric': 'ELECTRIC paling cepat menyengat burung di langit (FLYING) & air (WATER)! Setruman super dobel (4x) bagi tipe kombinasi keduanya!',
        'Fairy': 'FAIRY adalah sihir suci penakluk naga (DRAGON), petarung (FIGHTING) & kegelapan (DARK)!',
        'Ice': 'ICE membekukan reptil (DRAGON), sayap burung (FLYING), rumput (GRASS), & tanah (GROUND)!',
        'Fighting': 'FIGHTING bisa menghancurkan benda padat (ICE/ROCK/STEEL) & menghajar kejahatan (DARK)!',
        'Poison': 'POISON merusak kesucian peri (FAIRY) & mematikan tanaman (GRASS)!',
        'Flying': 'FLYING adalah predator bagi serangga (BUG) & tanaman (GRASS)!',
        'Bug': 'BUG merusak tumbuhan (GRASS), menggigit pikiran (PSYCHIC), dan membasmi kejahatan (DARK)!'
      };

      const correctOption = q.options.find((opt: any) => opt.isCorrect);
      const correctAnswer = correctOption ? correctOption.text : '';

      const formatToKey = (str: string) => {
        const raw = str.replace(' MOVE', '').trim().toLowerCase();
        return raw.charAt(0).toUpperCase() + raw.slice(1);
      };

      let storyText = '';

      if (q.mode === 'pivot') {
        const incomingAttackType = formatToKey(q.moveType || 'Normal');
        storyText = defenseStoryGuide[incomingAttackType] 
          ? `Alasan Aman: ${defenseStoryGuide[incomingAttackType]}`
          : `Tipe [ ${correctAnswer} ] mampu meredam damage serangan ${incomingAttackType.toUpperCase()}!`;
          
        setLog(`❌ PIVOT FAULT | ${storyText} | [ ${correctAnswer} ]`);
      } else {
        const attackTypeKey = formatToKey(correctAnswer);
        storyText = attackStoryGuide[attackTypeKey] 
          ? `Alasan K.O: ${attackStoryGuide[attackTypeKey]}`
          : `Serangan ${attackTypeKey.toUpperCase()} mengeksploitasi kelemahan target!`;
          
        setLog(`❌ ATTACK FAULT | ${storyText} | [ ${correctAnswer} ]`);
      }
    }
  };

  const navigateNext = () => {
    if (totalQuestions === null) return;
    if (currentIdx < totalQuestions - 1) {
      setCurrentIdx(prev => prev + 1);
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
    setIsLaunching(false);
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
          Sistem rotasi lintas sesi aktif. Urutan Pokémon dijamin selalu berbeda dan berlanjut secara random di setiap sesi baru!
        </p>

        <div className="space-y-3 font-mono mb-6">
          {[5, 10, 20].map((count) => (
            <button
              key={count}
              disabled={isLaunching} 
              onClick={() => startDrillSession(count)}
              className={`w-full py-3.5 border border-neutral-800 rounded-xl text-xs font-black tracking-widest transition-all uppercase ${
                isLaunching 
                  ? 'bg-zinc-900 text-zinc-600 border-zinc-950 cursor-not-allowed opacity-50' 
                  : 'bg-zinc-950 text-zinc-400 hover:bg-neutral-800 hover:text-white active:scale-98 cursor-pointer'
              }`}
            >
              {isLaunching ? '⚙️ LOADING QUEUE MATRIX...' : `⚡ Start ${count} Questions Queue`}
            </button>
          ))}
        </div>

        {/* TOMBOL MEMBUKA DICTIONARY YANG SUDAH TERPISAH */}
        <button 
          onClick={() => setShowDictionary(true)}
          className="w-full py-3 bg-neutral-800 border border-neutral-700/60 rounded-xl text-xs font-mono font-bold tracking-widest text-zinc-300 hover:bg-neutral-700 hover:text-white transition-all uppercase active:scale-98 cursor-pointer"
        >
          Purchase Access: Read Matchup Story Guide
        </button>

        {/* MODAL WINDOW DICTIONARY JIKA DIKLIK */}
        {showDictionary && (
          <VgcDictionary onClose={() => setShowDictionary(false)} />
        )}
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
            <p>&gt; Target threat <span className="text-white font-bold">{q.name}</span> (<span className="text-neutral-400">{q.types.join(' / ')}</span>) is active! Select a **SINGLE TYPE MOVE** that scores super-effective (2x or 4x) damage:</p>
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

        {/* FOOTER MANUEVER CONTROLS & DYNAMIC STORY HINTS */}
        <div className="bg-neutral-950 p-4 border-t border-neutral-800 flex justify-between items-start text-xs font-mono gap-4">
          <div className="flex gap-2 shrink-0">
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

          {/* DYNAMIC TEXT COLORIZER & WRAP RESPONSIVE HANDLER */}
          <div className="text-right max-w-[85%] leading-relaxed font-mono text-[11px] whitespace-pre-line break-words">
            {(() => {
              if (log.includes('🎯') || log.includes('💥') || log.includes('✅') || log.includes('Select') || log.includes('Drill')) {
                return <span className="text-emerald-400 font-bold">{log}</span>;
              }

              const parts = log.split('|');
              if (parts.length < 3) return <span className="text-zinc-400">{log}</span>;

              const errorHeader = parts[0].trim();
              const storyContent = parts[1].trim();
              const solutionBox = parts[2].trim();

              const pokemonTypeColors: Record<string, string> = {
                GROUND: 'text-yellow-600 font-bold',
                DARK: 'text-neutral-500 font-bold',
                FIRE: 'text-red-500 font-bold',
                STEEL: 'text-slate-400 font-bold',
                GHOST: 'text-purple-500 font-bold',
                GRASS: 'text-emerald-500 font-bold',
                WATER: 'text-blue-500 font-bold',
                DRAGON: 'text-indigo-600 font-bold',
                ROCK: 'text-stone-500 font-bold',
                PSYCHIC: 'text-pink-500 font-bold',
                ELECTRIC: 'text-amber-400 font-bold',
                FAIRY: 'text-rose-400 font-bold',
                ICE: 'text-cyan-400 font-bold',
                FIGHTING: 'text-orange-600 font-bold',
                POISON: 'text-fuchsia-500 font-bold',
                FLYING: 'text-indigo-400 font-bold',
                BUG: 'text-lime-500 font-bold',
                NORMAL: 'text-neutral-400 font-bold'
              };

              const renderColoredStory = (text: string) => {
                const words = text.split(/(\s+|\/)/);
                return words.map((word, i) => {
                  const cleanWord = word.replace(/[^a-zA-Z]/g, '');
                  if (pokemonTypeColors[cleanWord]) {
                    return <span key={i} className={pokemonTypeColors[cleanWord]}>{word}</span>;
                  }
                  return <span key={i} className="text-zinc-300">{word}</span>;
                });
              };

              return (
                <div className="space-y-0.5">
                  <span className="text-red-400 font-bold block">{errorHeader}</span>
                  <span className="text-zinc-300 block">{renderColoredStory(storyContent)}</span>
                  <span className="text-amber-400 font-extrabold block mt-1">💡 Solusi: {solutionBox}</span>
                </div>
              );
            })()}
          </div>

          {isFinished && (
            <button onClick={resetGame} className="bg-white text-black px-4 py-1.5 rounded-lg font-bold font-sans hover:bg-neutral-200 transition shrink-0">
              Menu
            </button>
          )}
        </div>

      </div>
    </div>
  );
}