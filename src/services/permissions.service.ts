import { prisma } from "../db/prisma";
import { getRankInfoByXp } from "../utils/ranks";

/**
 * Permite usar !addxp/!removexp si:
 * - es General (isGeneral), o
 * - su "clase" es Suboficiales u superior, según su XP/rango.
 */
export async function isSuboficialOrHigher(discordId: string): Promise<boolean> {
  const profile = await prisma.userProfile.findUnique({ where: { discordId } });
  if (!profile) return false;

  // Generales siempre cuentan como "alto rango"
  if (profile.isGeneral) return true;

  const xp = profile.xp ?? 0;
  const rankInfo = getRankInfoByXp(xp, profile.isGeneral, profile.generalRank);

  // Ajusta estos nombres EXACTOS a los que devuelva tu rankInfo.className
  const allowedClasses = new Set([
    "Suboficiales",
    "Oficiales",
    "Oficiales mayores"
  ]);

  return allowedClasses.has(rankInfo.className);
}
