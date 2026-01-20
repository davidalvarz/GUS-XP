import { CAREER_RANKS } from "../config/ranks";

export function getCareerRankByXp(xp: number) {
  const total = Math.max(0, xp);

  let current = CAREER_RANKS[0];
  for (const r of CAREER_RANKS) {
    if (total >= r.minXp) current = r;
  }

  const currentIndex = CAREER_RANKS.findIndex((r) => r.rank === current.rank);
  const next = currentIndex >= 0 ? CAREER_RANKS[currentIndex + 1] : undefined;

  return {
    className: current.className,
    rank: current.rank,
    nextRank: next?.rank ?? null
  };
}
