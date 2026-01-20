import { addStaff, isHeadAdmin } from "../services/staff.service";

export async function cmdAddHeadAdmin(message: any) {
  const ok = await isHeadAdmin(message.author.id);
  if (!ok) {
    await message.reply("❌ No tienes permisos. Solo Head-Admins pueden agregar Head-Admins.");
    return;
  }

  const target = message.mentions.users.first();
  if (!target) {
    await message.reply("Uso: `!addhead-admin @usuario`");
    return;
  }

  await addStaff(target.id, "HEAD_ADMIN");
  await message.reply(`✅ ${target.username} ahora es **HEAD-ADMIN**.`);
}
