export type RankInfo = {
  className: string;
  currentRank: string;
  nextRank: string | null;

  // XP dentro del rango actual
  currentXpInRank: number;

  // XP necesaria para llegar al siguiente rango (dentro del rango actual)
  requiredXpForNextRank: number;
};

type RankStep = {
  className: string;
  rank: string;
  minXp: number; // XP total mínimo para estar en este rango
  nextRank: string | null;
  nextMinXp: number | null; // XP total mínimo del siguiente rango
};

const RANKS: RankStep[] = [
  // ✅ Tropas
  { className: "Tropas", rank: "Recluta", minXp: 0, nextRank: "Soldado raso", nextMinXp: 50 },
  { className: "Tropas", rank: "Soldado raso", minXp: 50, nextRank: "Soldado", nextMinXp: 150 },
  { className: "Tropas", rank: "Soldado", minXp: 150, nextRank: "Cabo segundo", nextMinXp: 350 },
  { className: "Tropas", rank: "Cabo segundo", minXp: 350, nextRank: "Cabo", nextMinXp: 650 },
  { className: "Tropas", rank: "Cabo", minXp: 650, nextRank: "Cabo primero", nextMinXp: 1000 },
  { className: "Tropas", rank: "Cabo primero", minXp: 1000, nextRank: "Sargento segundo", nextMinXp: 1400 },

  // ✅ Suboficiales
  { className: "Suboficiales", rank: "Sargento segundo", minXp: 1400, nextRank: "Sargento", nextMinXp: 1900 },
  { className: "Suboficiales", rank: "Sargento", minXp: 1900, nextRank: "Sargento primero", nextMinXp: 2500 },
  { className: "Suboficiales", rank: "Sargento primero", minXp: 2500, nextRank: "Sargento mayor", nextMinXp: 3200 },
  { className: "Suboficiales", rank: "Sargento mayor", minXp: 3200, nextRank: "Teniente segundo", nextMinXp: 4000 },

  // ✅ Oficiales
  { className: "Oficiales", rank: "Teniente segundo", minXp: 4000, nextRank: "Teniente", nextMinXp: 4900 },
  { className: "Oficiales", rank: "Teniente", minXp: 4900, nextRank: "Teniente primero", nextMinXp: 5900 },
  { className: "Oficiales", rank: "Teniente primero", minXp: 5900, nextRank: "Capitán", nextMinXp: 7200 },
  { className: "Oficiales", rank: "Capitán", minXp: 7200, nextRank: "Mayor", nextMinXp: 9000 },

  // ✅ Oficiales Mayores
  { className: "Oficiales mayores", rank: "Mayor", minXp: 9000, nextRank: "Teniente coronel", nextMinXp: 11500 },
  { className: "Oficiales mayores", rank: "Teniente coronel", minXp: 11500, nextRank: "Coronel", nextMinXp: 14500 },
  { className: "Oficiales mayores", rank: "Coronel", minXp: 14500, nextRank: null, nextMinXp: null }
];

export function getRankInfoByXp(
  totalXp: number,
  isGeneral?: boolean,
  generalRank?: string | null
): RankInfo {
  // ✅ Generales: no suben por XP, solo se muestran
  if (isGeneral && generalRank) {
    return {
      className: "Generales",
      currentRank: generalRank,
      nextRank: null,
      currentXpInRank: totalXp,
      requiredXpForNextRank: 0
    };
  }

  const xp = Math.max(0, totalXp);

  // Buscar el último rango que cumpla minXp <= xp
  let current = RANKS[0];
  for (const step of RANKS) {
    if (xp >= step.minXp) current = step;
  }

  const currentMin = current.minXp;
  const nextMin = current.nextMinXp ?? null;

  const currentXpInRank = xp - currentMin;
  const requiredXpForNextRank =
    nextMin === null ? 0 : Math.max(0, nextMin - currentMin);

  return {
    className: current.className,
    currentRank: current.rank,
    nextRank: current.nextRank,
    currentXpInRank,
    requiredXpForNextRank
  };
}
