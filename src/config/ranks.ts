export const CAREER_RANKS: Array<{
  className: string;
  rank: string;
  minXp: number;
}> = [
  { className: "Tropas", rank: "Recluta", minXp: 0 },
  { className: "Tropas", rank: "Soldado raso", minXp: 50 },
  { className: "Tropas", rank: "Soldado", minXp: 150 },
  { className: "Tropas", rank: "Cabo segundo", minXp: 350 },
  { className: "Tropas", rank: "Cabo", minXp: 650 },
  { className: "Tropas", rank: "Cabo primero", minXp: 1000 },

  { className: "Suboficiales", rank: "Sargento segundo", minXp: 1400 },
  { className: "Suboficiales", rank: "Sargento", minXp: 1900 },
  { className: "Suboficiales", rank: "Sargento primero", minXp: 2500 },
  { className: "Suboficiales", rank: "Sargento mayor", minXp: 3200 },

  { className: "Oficiales", rank: "Teniente segundo", minXp: 4000 },
  { className: "Oficiales", rank: "Teniente", minXp: 4900 },
  { className: "Oficiales", rank: "Teniente primero", minXp: 5900 },
  { className: "Oficiales", rank: "Capitán", minXp: 7200 },

  { className: "Oficiales mayores", rank: "Mayor", minXp: 9000 },
  { className: "Oficiales mayores", rank: "Teniente coronel", minXp: 11500 },
  { className: "Oficiales mayores", rank: "Coronel", minXp: 14500 }
];

export const GENERAL_RANKS: string[] = [
  "General mayor",
  "Teniente general",
  "Coronel general",
  "General del ejército",
  "Mariscal de servicio"
];
