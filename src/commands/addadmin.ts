import { addStaff, isHeadAdmin } from "../services/staff.service";

export async function cmdAddAdmin(message: any) {
  const ok = await isHeadAdmin(message.author.id);
  if (!ok) {
    await message.reply("❌ No tienes permisos. Solo Head-Admins pueden agregar Admins.");
    return;
  }

  const target = message.mentions.users.first();
  if (!target) {
    await message.reply("Uso: `!addadmin @usuario`");
    return;
  }

  await addStaff(target.id, "ADMIN");
  await message.reply(`✅ ${target.username} ahora es **ADMIN**.`);
}
