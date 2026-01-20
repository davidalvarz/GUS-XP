import { prisma } from "../db/prisma";
import { requireHeadAdmin } from "../utils/guards";
import { GENERAL_RANKS } from "../config/ranks";

export async function cmdSetGeneral(message: any, args: string[]) {
  const ok = await requireHeadAdmin(message);
  if (!ok) return;

  const target = message.mentions.users.first();
  if (!target) {
    await message.reply(
      "Uso: `!setgeneral @usuario <rango>`\n\nEjemplo: `!setgeneral @Juan General mayor`"
    );
    return;
  }

  const rankName = args.slice(1).join(" ").trim();
  if (!rankName) {
    await message.reply(
      "Debes indicar el rango.\nEjemplo: `!setgeneral @Juan General mayor`"
    );
    return;
  }

  const validRank = GENERAL_RANKS.find(
    (r) => r.toLowerCase() === rankName.toLowerCase()
  );

  if (!validRank) {
    await message.reply(
      "❌ Rango inválido.\nRangos válidos:\n" +
        GENERAL_RANKS.map((r) => `• ${r}`).join("\n")
    );
    return;
  }

  await prisma.userProfile.upsert({
    where: { discordId: target.id },
    create: {
      discordId: target.id,
      xp: 0,
      isGeneral: true,
      generalRank: validRank
    },
    update: {
      isGeneral: true,
      generalRank: validRank
    }
  });

  await message.reply(
    `✅ Se asignó el rango **${validRank}** a <@${target.id}>.\n🔒 Este usuario ahora es **General** y **no recibirá XP**.`
  );
}
