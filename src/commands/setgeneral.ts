import { prisma } from "../db/prisma";
import { settings } from "../config/settings";
import { GENERAL_RANKS } from "../config/ranks";
import { isWhitelistedAdmin } from "../utils/guards";

export async function cmdSetGeneral(message: any, args: string[]) {
  // Solo HEAD ADMIN o whitelist puede asignar general
  if (!isWhitelistedAdmin(message.author.id, settings.headAdminId)) {
    await message.reply("No estás autorizado para usar este comando.");
    return;
  }

  const target = message.mentions.users.first();
  if (!target) {
    await message.reply("Uso: `!setgeneral @usuario <rango>`");
    await message.reply(`Rangos: ${GENERAL_RANKS.join(", ")}`);
    return;
  }

  const rankName = args.slice(1).join(" ").trim();
  if (!GENERAL_RANKS.includes(rankName)) {
    await message.reply("Rango inválido para Generales.");
    await message.reply(`Rangos válidos: ${GENERAL_RANKS.join(", ")}`);
    return;
  }

  await prisma.userProfile.upsert({
    where: { discordId: target.id },
    create: { discordId: target.id, isGeneral: true, generalRank: rankName, xp: 0 },
    update: { isGeneral: true, generalRank: rankName, xp: 0 }
  });

  await message.reply(`✅ ${target.username} ahora es **General**: **${rankName}** (XP bloqueada).`);
}
