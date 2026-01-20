import { CAREER_RANKS } from "../config/ranks";

export function getCareerRankFromXp(xp: number) {
  const sorted = [...CAREER_RANKS].sort((a, b) => a.minXp - b.minXp);

  let current = sorted[0];
  for (const r of sorted) {
    if (xp >= r.minXp) current = r;
    else break;
  }

  const currentIndex = sorted.findIndex(
    (r) => r.className === current.className && r.rankName === current.rankName && r.minXp === current.minXp
  );

  const next = sorted[currentIndex + 1] ?? null;

  return { current, next };
}
