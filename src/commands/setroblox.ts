import { prisma } from "../db/prisma";
import { resolveRobloxUser } from "../services/roblox.service";

export async function cmdSetRoblox(message: any, args: string[]) {
  const input = args[0];
  if (!input) {
    await message.reply("Uso: `!setroblox <usernameRoblox | userId>`");
    return;
  }

  const rb = await resolveRobloxUser(input);
  if (!rb) {
    await message.reply("No pude encontrar ese usuario en Roblox. Verifica el nombre o ID.");
    return;
  }

  await prisma.userProfile.upsert({
    where: { discordId: message.author.id },
    create: { discordId: message.author.id, robloxUserId: rb.id, robloxName: rb.name },
    update: { robloxUserId: rb.id, robloxName: rb.name }
  });

  await message.reply(`✅ Roblox vinculado: **${rb.name}** (ID: ${rb.id})`);
}
