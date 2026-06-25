// data.ts
export interface MetaThreat {
  name: string;
  archetype: 'Rain Team' | 'Sun Team' | 'Sand Team' | 'Trick Room' | 'Meta Balance' | 'Hyper Offense';
}

export const REG_M_META_POOL: MetaThreat[] = [
  // --- IMAGE 1: KANTO / JOHTO CORES (image_760e38.jpg) ---
  { name: 'venusaur', archetype: 'Sun Team' },
  { name: 'charizard', archetype: 'Sun Team' },
  { name: 'blastoise', archetype: 'Rain Team' },
  { name: 'pikachu', archetype: 'Hyper Offense' },
  { name: 'raichu-alola', archetype: 'Hyper Offense' },
  { name: 'ninetales-alola', archetype: 'Hyper Offense' },
  { name: 'arcanine-hisui', archetype: 'Meta Balance' },
  { name: 'arcanine', archetype: 'Meta Balance' },
  { name: 'gengar', archetype: 'Hyper Offense' },
  { name: 'gyarados', archetype: 'Meta Balance' },
  { name: 'tauros-paldea-blaze-breed', archetype: 'Hyper Offense' },
  { name: 'tauros-paldea-aqua-breed', archetype: 'Rain Team' },
  { name: 'aerodactyl', archetype: 'Sand Team' },
  { name: 'snorlax', archetype: 'Trick Room' },
  { name: 'dragonite', archetype: 'Hyper Offense' },
  { name: 'politoed', archetype: 'Rain Team' },
  { name: 'scizor', archetype: 'Meta Balance' },
  { name: 'tyranitar', archetype: 'Sand Team' },
  { name: 'pelipper', archetype: 'Rain Team' },
  { name: 'gardevoir', archetype: 'Hyper Offense' },

  // --- IMAGE 2: HOENN / SINNOH / UNOVA CORES (image_760e7c.jpg) ---
  { name: 'torkoal', archetype: 'Sun Team' },
  { name: 'milotic', archetype: 'Meta Balance' },
  { name: 'roserade', archetype: 'Hyper Offense' },
  { name: 'garchomp', archetype: 'Hyper Offense' },
  { name: 'lucario', archetype: 'Hyper Offense' },
  { name: 'abomasnow', archetype: 'Hyper Offense' },
  { name: 'weavile', archetype: 'Hyper Offense' },
  { name: 'glaceon', archetype: 'Hyper Offense' },
  { name: 'mamoswine', archetype: 'Meta Balance' },
  { name: 'froslass', archetype: 'Hyper Offense' },
  { name: 'rotom-heat', archetype: 'Sun Team' },
  { name: 'rotom-wash', archetype: 'Meta Balance' },
  { name: 'whimsicott', archetype: 'Hyper Offense' },
  { name: 'krookodile', archetype: 'Hyper Offense' },
  { name: 'zoroark-hisui', archetype: 'Hyper Offense' },
  { name: 'chandelure', archetype: 'Trick Room' },

  // --- IMAGE 3: KALOS / ALOLA CORES (image_760eb6.jpg) ---
  { name: 'hydreigon', archetype: 'Hyper Offense' },
  { name: 'volcarona', archetype: 'Hyper Offense' },
  { name: 'talonflame', archetype: 'Hyper Offense' },
  { name: 'sylveon', archetype: 'Hyper Offense' },
  { name: 'goodra', archetype: 'Meta Balance' },
  { name: 'incineroar', archetype: 'Meta Balance' },
  { name: 'primarina', archetype: 'Meta Balance' },
  { name: 'lycanroc-midday', archetype: 'Sand Team' },
  { name: 'toxapex', archetype: 'Meta Balance' },
  { name: 'mimikyu', archetype: 'Trick Room' },
  { name: 'kommo-o', archetype: 'Meta Balance' },

  // --- IMAGE 4: GALAR / PALDEA CORES (image_760ed5.jpg) ---
  { name: 'corviknight', archetype: 'Meta Balance' },
  { name: 'hatterene', archetype: 'Trick Room' },
  { name: 'dragapult', archetype: 'Hyper Offense' },
  { name: 'kleavor', archetype: 'Hyper Offense' },
  { name: 'basculegion-male', archetype: 'Rain Team' },
  { name: 'basculegion-female', archetype: 'Rain Team' },
  { name: 'sneasler', archetype: 'Hyper Offense' },
  { name: 'meowscarada', archetype: 'Hyper Offense' },
  { name: 'skeledirge', archetype: 'Trick Room' },
  { name: 'maushold', archetype: 'Meta Balance' },
  { name: 'garganacl', archetype: 'Meta Balance' },
  { name: 'armarouge', archetype: 'Trick Room' },
  { name: 'ceruledge', archetype: 'Trick Room' },
  { name: 'scovillain', archetype: 'Sun Team' },
  { name: 'tinkaton', archetype: 'Meta Balance' },
  { name: 'palafin-zero', archetype: 'Rain Team' },
  { name: 'glimmora', archetype: 'Sand Team' },
  { name: 'farigiraf', archetype: 'Trick Room' },
  { name: 'kingambit', archetype: 'Meta Balance' },
  { name: 'sinistcha', archetype: 'Meta Balance' },
  { name: 'archaludon', archetype: 'Rain Team' }
];

export const INDIVIDUAL_TYPES = [
  'Normal', 'Fire', 'Water', 'Grass', 'Electric', 'Ice', 
  'Fighting', 'Poison', 'Ground', 'Flying', 'Psychic', 'Bug', 
  'Rock', 'Ghost', 'Dragon', 'Dark', 'Steel', 'Fairy'
];

export const RESISTANCES: Record<string, { immune: string[]; resists: string[]; weak: string[] }> = {
  'Ground':  { immune: ['Flying'], resists: ['Grass', 'Bug'], weak: ['Fire', 'Electric', 'Poison', 'Rock', 'Steel'] },
  'Dark':    { immune: [], resists: ['Dark', 'Fighting', 'Fairy'], weak: ['Psychic', 'Ghost'] },
  'Fire':    { immune: [], resists: ['Fire', 'Water', 'Rock', 'Dragon'], weak: ['Steel', 'Grass', 'Ice', 'Bug'] },
  'Steel':   { immune: [], resists: ['Fire', 'Water', 'Electric', 'Steel'], weak: ['Ice', 'Rock', 'Fairy'] },
  'Ghost':   { immune: ['Normal'], resists: ['Dark'], weak: ['Psychic', 'Ghost'] },
  'Grass':   { immune: [], resists: ['Fire', 'Grass', 'Poison', 'Flying', 'Bug', 'Dragon', 'Steel'], weak: ['Water', 'Ground', 'Rock'] },
  'Water':   { immune: [], resists: ['Water', 'Grass', 'Dragon'], weak: ['Fire', 'Ground', 'Rock'] },
  'Dragon':  { immune: ['Fairy'], resists: ['Steel'], weak: ['Dragon', 'Ice', 'Fairy'] },
  'Rock':    { immune: [], resists: ['Fighting', 'Ground', 'Steel'], weak: ['Normal', 'Fire', 'Poison', 'Flying', 'Ice', 'Bug'] },
  'Psychic': { immune: ['Dark'], resists: ['Psychic', 'Steel'], weak: ['Fighting', 'Poison'] },
  'Electric':{ immune: [], resists: ['Electric', 'Grass', 'Dragon'], weak: ['Water', 'Flying'] },
  'Fairy':   { immune: [], resists: ['Fire', 'Poison', 'Steel'], weak: ['Fighting', 'Dragon', 'Dark'] },
  'Ice':     { immune: [], resists: ['Fire', 'Water', 'Ice', 'Steel'], weak: ['Grass', 'Ground', 'Flying', 'Dragon'] },
  'Normal':  { immune: ['Ghost'], resists: [], weak: [] },
  'Fighting':{ immune: ['Ghost'], resists: ['Poison', 'Flying', 'Psychic', 'Bug', 'Fairy'], weak: ['Normal', 'Ice', 'Rock', 'Dark', 'Steel'] },
  'Poison':  { immune: ['Steel'], resists: ['Poison', 'Ground', 'Rock', 'Ghost'], weak: ['Grass', 'Fairy'] },
  'Flying':  { immune: [], resists: ['Electric', 'Rock', 'Steel'], weak: ['Grass', 'Fighting', 'Bug'] },
  'Bug':     { immune: [], resists: ['Fire', 'Fighting', 'Poison', 'Flying', 'Ghost', 'Steel', 'Fairy'], weak: ['Grass', 'Psychic', 'Dark'] }
};