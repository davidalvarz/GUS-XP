import { prisma } from "../db/prisma";
import { requireHeadAdmin } from "../utils/guards";

export async function cmdRemoveGeneral(message: any) {
  const ok = await requireHeadAdmin(message);
  if (!ok) return;

  const target = message.mentions.users.first();
  if (!target) {
    await message.reply("Uso: `!removegeneral @usuario`");
    return;
  }

  const profile = await prisma.userProfile.findUnique({
    where: { discordId: target.id }
  });

  if (!profile || !profile.isGeneral) {
    await message.reply(`⚠️ <@${target.id}> no está marcado como **General**.`);
    return;
  }

  await prisma.userProfile.update({
    where: { discordId: target.id },
    data: {
      isGeneral: false,
      generalRank: null
    }
  });

  await message.reply(
    `✅ Se removió el estado de **General** a <@${target.id}>.\n` +
    `📌 Ahora puede volver a recibir XP y subir de rango normalmente.`
  );
}
