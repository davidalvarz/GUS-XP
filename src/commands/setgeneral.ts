import { prisma } from "../db/prisma";
import { GENERAL_RANKS } from "../config/ranks";
import { requireHeadAdmin } from "../utils/guards";

export async function cmdSetGeneral(message: any) {
  const ok = await requireHeadAdmin(message);
  if (!ok) return;

  const target = message.mentions.users.first();
  const rankName = message.content.split(" ").slice(2).join(" ").trim();

  if (!target || !rankName) {
    await message.reply(
      "Uso: `!setgeneral @usuario RANGO`\n\nRangos disponibles:\n" +
        GENERAL_RANKS.map((r: string) => `• ${r}`).join("\n")
    );
    return;
  }

  const exists = GENERAL_RANKS.find(
    (r: string) => r.toLowerCase() === rankName.toLowerCase()
  );

  if (!exists) {
    await message.reply(
      "❌ Rango inválido. Usa uno de estos:\n" +
        GENERAL_RANKS.map((r: string) => `• ${r}`).join("\n")
    );
    return;
  }

  await prisma.userProfile.upsert({
    where: { discordId: target.id },
    create: {
      discordId: target.id,
      xp: 0,
      robloxUsername: "",
      isGeneral: true,
      generalRank: exists
    },
    update: {
      isGeneral: true,
      generalRank: exists
    }
  });

  await message.reply(`✅ <@${target.id}> fue asignado como **${exists}** (Generales).`);
}
