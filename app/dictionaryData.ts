// ==========================================
// 1. KAMUS GABUNGAN MASTER COMBO (ALL-IN-ONE)
// ==========================================
export const COMBINED_MASTER_STORIES: Record<string, string> = {
  'Steel': 'STEEL 💥menebas ROCK, ICE, FAIRY 🚫kebal POISON 🛡️menahan 10 tipe lain, tapi 🧪lemah dihantam FIRE, FIGHTING, dan gempa GROUND!',
  'Ground': 'GROUND 💥mengubur ELECTRIC, FIRE, ROCK, POISON, STEEL 🚫kebal ELECTRIC, tapi 🧪lemah disiram WATER, dibekukan ICE, ditahan GRASS, dan 🕳️gagal menyentuh FLYING!',
  'Flying': 'FLYING 💥memangsa BUG, FIGHTING, GRASS 🚫kebal GROUND 🛡️menahan BUG, FIGHTING, GRASS, tapi 🧪lemah dipanah ROCK, disengat ELECTRIC, atau dibekukan ICE!',
  'Ghost': 'GHOST 💥menghantui sesama GHOST, PSYCHIC 🚫kebal NORMAL, FIGHTING 🛡️menahan POISON, BUG, tapi 🧪lemah diteror kegelapan DARK!',
  'Dark': 'DARK 💥meneror GHOST, PSYCHIC 🚫kebal PSYCHIC 🛡️menahan GHOST, DARK, tapi 🧪lemah digeprek FIGHTING, digigit BUG, dan disihir FAIRY!',
  'Fairy': 'FAIRY 💥menaklukan DRAGON, FIGHTING, DARK 🚫kebal DRAGON 🛡️menahan FIGHTING, BUG, DARK, tapi 🧪lemah dirusak POISON dan besi STEEL!',
  'Fire': 'FIRE 💥membakar GRASS, BUG, ICE, STEEL 🛡️menahan FIRE, GRASS, ICE, BUG, STEEL, FAIRY, tapi 🧪lemah disiram WATER, dilempar ROCK, atau diguncang GROUND!',
  'Water': 'WATER 💥mengikis GROUND, ROCK, FIRE 🛡️menahan FIRE, WATER, ICE, STEEL, tapi 🧪lemah diserap GRASS atau kesetrum ELECTRIC!',
  'Grass': 'GRASS 💥menjebol ROCK, GROUND, WATER 🛡️menahan WATER, ELECTRIC, GRASS, GROUND, tapi 🧪lemah dibakar FIRE, diracun POISON, dipatuk FLYING, digigit BUG, atau dibekukan ICE!',
  'Electric': 'ELECTRIC 💥menyengat FLYING, WATER 🛡️menahan ELECTRIC, FLYING, STEEL, tapi 🚫gagal total dan tidak berkutik menghadapi bumi GROUND!',
  'Dragon': 'DRAGON 💥menghancurkan sesama DRAGON 🛡️menahan elemen dasar FIRE, WATER, GRASS, ELECTRIC, tapi 🧪lemah dibekukan ICE, dihajar DRAGON, dan 🚫gagal total melawan FAIRY!',
  'Ice': 'ICE 💥membekukan DRAGON, FLYING, GRASS, GROUND 🛡️hanya menahan sesama ICE, tapi pertahanan 🧪sangat rapuh dihantam FIRE, FIGHTING, ROCK, STEEL!',
  'Fighting': 'FIGHTING 💥menghancurkan STEEL, ROCK, ICE, NORMAL, DARK 🛡️menahan ROCK, BUG, DARK, tapi 🕳️tumpul lawan PSYCHIC, FAIRY, FLYING dan 🚫gagal total menyentuh GHOST!',
  'Psychic': 'PSYCHIC 💥mengontrol FIGHTING, POISON 🛡️menahan FIGHTING, PSYCHIC, tapi pikiran 🧪langkah blank/fobia saat diteror BUG, GHOST, DARK!',
  'Rock': 'ROCK 💥meremukkan FLYING, BUG, FIRE, ICE 🛡️menahan NORMAL, FIRE, POISON, FLYING, tapi 🧪lemah dikikis WATER, GRASS atau dihantam FIGHTING, STEEL, GROUND!',
  'Poison': 'POISON 💥meracuni GRASS, FAIRY 🛡️menahan FIGHTING, POISON, BUG, GRASS, FAIRY, tapi 🚫gagal menyentuh STEEL dan 🧪lemah dihantam GROUND, PSYCHIC!',
  'Normal': 'NORMAL 🧪tidak punya keunggulan elemen (💥) apa pun 🚫kebal total dari GHOST, tapi 🧪lemah digebuk pukulan fisik FIGHTING!',
  'Bug': 'BUG 💥membasmi DARK, GRASS, PSYCHIC 🛡️menahan FIGHTING, GROUND, GRASS, tapi 🧪lemah terbakar FIRE, dipatok FLYING, atau digeprek ROCK!'
};

// ==========================================
// 2. KAMUS OFENSIF (HIT WEAKNESS ATTACK) - FIXED 18 TYPES
// ==========================================
// ==========================================
// 2. KAMUS OFENSIF (HIT WEAKNESS ATTACK)
// ==========================================
export const ATTACK_STORY_GUIDE: Record<string, string> = {
  'Steel': 'STEEL itu senjata tajam 💥pemotong ICE & ROCK, serta 💥menebas peri FAIRY!',
  'Ground': 'GROUND 💥menghancurkan baja STEEL & tiang listrik ELECTRIC, serta 💥mengubur FIRE, ROCK, dan POISON!',
  'Flying': 'FLYING adalah predator terbang yang 💥memangsa serangga BUG & tanaman GRASS!',
  'Ghost': 'GHOST bisa leluasa 💥meneror sesama hantu GHOST & 💥merusak mental PSYCHIC!',
  'Dark': 'DARK sukses 💥meneror hantu GHOST & 💥merusak mental kompetitif PSYCHIC!',
  'Fairy': 'FAIRY adalah sihir suci 💥penakluk naga DRAGON, petarung FIGHTING & kegelapan DARK!',
  'Fire': 'FIRE 💥membakar habis alam GRASS, BUG, ICE & 💥melelehkan pelindung besi STEEL!',
  'Water': 'WATER 💥memadamkan kobaran FIRE & 💥mengikis hancur tanah GROUND atau batuan ROCK!',
  'Grass': 'GRASS akarnya 💥menjebol batu ROCK, tanah GROUND & 💥menyerap habis energi air WATER!',
  'Electric': 'ELECTRIC paling cepat 💥menyengat burung di langit FLYING & air WATER! Setruman super dobel (4x) bagi kombinasi keduanya!',
  'Dragon': 'DRAGON itu monster legendaris yang hanya bisa 💥ditumbangkan oleh sesama kekuatan purba DRAGON!',
  'Ice': 'ICE 💥membekukan reptil DRAGON, sayap burung FLYING, rumput GRASS, & tanah GROUND!',
  'Fighting': 'FIGHTING bisa 💥menghancurkan benda padat ICE, ROCK, STEEL, NORMAL & 💥menghajar kejahatan DARK!',
  'Psychic': 'PSYCHIC 💥mengontrol disiplin fisik petarung FIGHTING & 💥menetralisir cairan beracun POISON!',
  'Rock': 'ROCK batunya 💥menjatuhkan burung FLYING, 💥meremukkan BUG, dan 💥memadamkan kobaran FIRE atau ICE!',
  'Poison': 'POISON 💥merusak kesucian peri FAIRY & 💥mematikan jaringan sel tanaman GRASS!',
  'Normal': 'NORMAL 🧪tidak memiliki keunggulan elemen (💥) terhadap tipe apa pun. Fokus murni pada raw damage output!',
  'Bug': 'BUG 💥merusak jaringan tumbuhan GRASS, 💥menggigit pikiran PSYCHIC, dan 💥membasmi kejahatan DARK!'
};

// ==========================================
// 3. KAMUS DEFENSIF (PIVOT ABSORBER)
// ==========================================
export const DEFENSE_STORY_GUIDE: Record<string, string> = {
  'Steel': 'Tameng besi STEEL 🛡️menahan 10 tipe elemen berbeda dan 🚫kebal total dari cairan limbah beracun POISON!',
  'Ground': 'Bumi GROUND 🚫kebal dari aliran listrik ELECTRIC, serta 🛡️meredam ledakan pasir ROCK dan racun POISON!',
  'Flying': 'Burung FLYING bebas terbang tinggi sehingga 🚫kebal dari gempa bumi GROUND, serta 🛡️menahan serangan BUG, FIGHTING, GRASS!',
  'Ghost': 'Dimensi gaib GHOST 🚫kebal total dari fisik NORMAL dan otot FIGHTING, serta 🛡️menahan racun POISON dan gigitan BUG!',
  'Dark': 'Sisi gelap DARK 🚫kebal dari manipulasi otak PSYCHIC, serta 🛡️menahan teror mistis GHOST dan sesama penjahat DARK!',
  'Fairy': 'Sihir suci FAIRY 🚫kebal total dari amukan naga DRAGON, serta 🛡️meredam pukulan FIGHTING, BUG, dan kegelapan DARK!',
  'Fire': 'Kobaran FIRE 🛡️menahan hawa beku ICE, tebasan STEEL, sihir FAIRY, gigitan BUG, tumbuhan GRASS, dan sesama kobaran api FIRE!',
  'Water': 'Aliran air WATER 🛡️meredam ledakan api FIRE, menghentikan beku ICE, menahan tebasan STEEL, dan sesama siraman air WATER!',
  'Grass': 'Tanaman GRASS 🛡️menyerap aliran sengatan ELECTRIC, menyedot air WATER, menahan guncangan GROUND, dan sesama tumbuhan GRASS!',
  'Electric': 'Daya ELECTRIC 🛡️menahan sengatan sesama petir ELECTRIC, menepis sayap terbang FLYING, dan meredam ketukan besi STEEL!',
  'Dragon': 'Sisik naga DRAGON 🛡️menahan empat elemen dasar alam sekaligus yaitu FIRE, WATER, GRASS, dan sengatan listrik ELECTRIC!',
  'Ice': 'Lapisan es ICE sangat rapuh dan 🛡️hanya bisa menahan dinginnya sisa serangan dari sesama udara beku ICE!',
  'Fighting': 'Disiplin bela diri FIGHTING 🛡️menahan lemparan batuan ROCK, gigitan serangga BUG, dan taktik kotor penjahat DARK!',
  'Psychic': 'Kekuatan mental PSYCHIC 🛡️membaca gerakan pukulan petarung FIGHTING dan meredam sesama gelombang pikiran PSYCHIC!',
  'Rock': 'Struktur batuan ROCK 🛡️menahan hantaman fisik NORMAL, kobaran api FIRE, racun POISON, dan patukan burung FLYING!',
  'Poison': 'Tubuh beracun POISON 🛡️menahan pukulan bela diri FIGHTING, gigitan BUG, tumbuhan GRASS, sihir FAIRY, dan sesama racun POISON!',
  'Normal': 'Tubuh polos NORMAL 🚫kebal dari dimensi spiritual hantu GHOST, tetapi 🧪lemah dihantam oleh disiplin bela diri FIGHTING!',
  'Bug': 'Tubuh serangga BUG 🛡️meredam pukulan otot petarung FIGHTING, guncangan tanah GROUND, dan jeratan tanaman GRASS!'
};

// ==========================================
// 4. SUSUNAN OPTIMAL TIERING MASTER VGC LINTAS TAB
// ==========================================
export const VGC_META_POPULARITY_ORDER = [
  'Steel', 'Ground', 'Flying', 'Ghost', 'Dark', 'Fairy', 
  'Fire', 'Water', 'Grass', 'Electric', 
  'Dragon', 'Ice', 'Fighting', 
  'Psychic', 'Rock', 'Poison', 'Normal', 'Bug'
];

export const POKEMON_TYPE_THEMES: Record<string, { bg: string; text: string; border: string; glow: string }> = {
  GROUND: { bg: 'bg-amber-950/40', text: 'text-amber-500', border: 'border-amber-700/30', glow: 'shadow-amber-500/5' },
  DARK: { bg: 'bg-neutral-900', text: 'text-neutral-400', border: 'border-neutral-700/40', glow: 'shadow-neutral-500/5' },
  FIRE: { bg: 'bg-red-950/40', text: 'text-red-500', border: 'border-red-700/30', glow: 'shadow-red-500/5' },
  STEEL: { bg: 'bg-slate-900/60', text: 'text-slate-300', border: 'border-slate-700/30', glow: 'shadow-slate-400/5' },
  GHOST: { bg: 'bg-purple-950/40', text: 'text-purple-400', border: 'border-purple-700/30', glow: 'shadow-purple-500/5' },
  GRASS: { bg: 'bg-emerald-950/40', text: 'text-emerald-500', border: 'border-emerald-700/30', glow: 'shadow-emerald-500/5' },
  WATER: { bg: 'bg-blue-950/40', text: 'text-blue-400', border: 'border-blue-700/30', glow: 'shadow-blue-500/5' },
  DRAGON: { bg: 'bg-indigo-950/40', text: 'text-indigo-400', border: 'border-indigo-700/30', glow: 'shadow-indigo-500/5' },
  ROCK: { bg: 'bg-stone-900/60', text: 'text-stone-400', border: 'border-stone-700/30', glow: 'shadow-stone-500/5' },
  PSYCHIC: { bg: 'bg-pink-950/40', text: 'text-pink-400', border: 'border-pink-700/30', glow: 'shadow-pink-500/5' },
  ELECTRIC: { bg: 'bg-yellow-950/30', text: 'text-yellow-400', border: 'border-yellow-600/30', glow: 'shadow-yellow-400/5' },
  FAIRY: { bg: 'bg-rose-950/40', text: 'text-rose-400', border: 'border-rose-700/30', glow: 'shadow-rose-400/5' },
  ICE: { bg: 'bg-cyan-950/40', text: 'text-cyan-400', border: 'border-cyan-700/30', glow: 'shadow-cyan-400/5' },
  FIGHTING: { bg: 'bg-orange-950/40', text: 'text-orange-500', border: 'border-orange-700/30', glow: 'shadow-orange-600/5' },
  POISON: { bg: 'bg-fuchsia-950/40', text: 'text-fuchsia-400', border: 'border-fuchsia-700/30', glow: 'shadow-fuchsia-500/5' },
  FLYING: { bg: 'bg-violet-950/30', text: 'text-violet-400', border: 'border-violet-700/30', glow: 'shadow-violet-400/5' },
  BUG: { bg: 'bg-lime-950/30', text: 'text-lime-400', border: 'border-lime-700/30', glow: 'shadow-lime-500/5' },
  NORMAL: { bg: 'bg-zinc-900', text: 'text-zinc-400', border: 'border-zinc-800', glow: 'shadow-zinc-500/5' }
};