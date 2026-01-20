export const GENERAL_RANKS = [
  "General mayor",
  "Teniente general",
  "Coronel general",
  "General del ejercito",
  "Mariscal de servicio"
];

export const CAREER_RANKS = [
  { className: "Tropas", rankName: "Recluta", minXp: 0 },
  { className: "Tropas", rankName: "Soldado raso", minXp: 100 },
  { className: "Tropas", rankName: "Soldado", minXp: 250 },
  { className: "Tropas", rankName: "Cabo segundo", minXp: 450 },
  { className: "Tropas", rankName: "Cabo", minXp: 700 },
  { className: "Tropas", rankName: "Cabo primero", minXp: 1000 },

  { className: "Suboficiales", rankName: "Sargento segundo", minXp: 1400 },
  { className: "Suboficiales", rankName: "Sargento", minXp: 1900 },
  { className: "Suboficiales", rankName: "Sargento primero", minXp: 2500 },
  { className: "Suboficiales", rankName: "Sargento mayor", minXp: 3200 },

  { className: "Oficiales", rankName: "Teniente segundo", minXp: 4000 },
  { className: "Oficiales", rankName: "Teniente", minXp: 4900 },
  { className: "Oficiales", rankName: "Teniente primero", minXp: 5900 },
  { className: "Oficiales", rankName: "Capitan", minXp: 7000 },

  { className: "Oficiales mayores", rankName: "Mayor", minXp: 8300 },
  { className: "Oficiales mayores", rankName: "Teniente coronel", minXp: 9800 },
  { className: "Oficiales mayores", rankName: "Coronel", minXp: 11500 }
];
