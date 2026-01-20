import { prisma } from "../db/prisma";
import { getRobloxUserIdByUsername } from "../services/roblox.service";

export async function cmdSetRoblox(message: any) {
  const username = message.content.split(" ").slice(1).join(" ").trim();

  if (!username) {
    await message.reply("Uso: `!setroblox NOMBRE_DE_ROBLOX`");
    return;
  }

  // Validamos que Roblox lo encuentre
  const userId = await getRobloxUserIdByUsername(username);
  if (!userId) {
    await message.reply("❌ No pude encontrar ese usuario en Roblox. Revisa el nombre exacto.");
    return;
  }

  await prisma.userProfile.upsert({
    where: { discordId: message.author.id },
    create: {
      discordId: message.author.id,
      robloxUsername: username,
      xp: 0,
      isGeneral: false,
      generalRank: ""
    },
    update: {
      robloxUsername: username
    }
  });

  await message.reply(`✅ Roblox vinculado correctamente: **${username}** (ID: \`${userId}\`)`);
}
