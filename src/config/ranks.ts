export type RankEntry = {
  className: string;
  rankName: string;
  minXp: number;
};

export const CAREER_RANKS: RankEntry[] = [
  // Tropas
  { className: "Tropas", rankName: "Recluta", minXp: 0 },
  { className: "Tropas", rankName: "Soldado raso", minXp: 100 },
  { className: "Tropas", rankName: "Soldado", minXp: 250 },
  { className: "Tropas", rankName: "Cabo segundo", minXp: 450 },
  { className: "Tropas", rankName: "Cabo", minXp: 700 },
  { className: "Tropas", rankName: "Cabo primero", minXp: 1000 },

  // Suboficiales
  { className: "Suboficiales", rankName: "Sargento segundo", minXp: 1300 },
  { className: "Suboficiales", rankName: "Sargento", minXp: 1700 },
  { className: "Suboficiales", rankName: "Sargento primero", minXp: 2200 },
  { className: "Suboficiales", rankName: "Sargento mayor", minXp: 2800 },

  // Oficiales
  { className: "Oficiales", rankName: "Teniente segundo", minXp: 3500 },
  { className: "Oficiales", rankName: "Teniente", minXp: 4300 },
  { className: "Oficiales", rankName: "Teniente primero", minXp: 5200 },
  { className: "Oficiales", rankName: "Capitán", minXp: 6200 },

  // Oficiales Mayores
  { className: "Oficiales mayores", rankName: "Mayor", minXp: 7400 },
  { className: "Oficiales mayores", rankName: "Teniente coronel", minXp: 8800 },
  { className: "Oficiales mayores", rankName: "Coronel", minXp: 10500 }
];

export const GENERAL_RANKS = [
  "General mayor",
  "Teniente general",
  "Coronel general",
  "General del ejército",
  "Mariscal de servicio"
];
