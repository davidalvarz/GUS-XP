import { isHeadAdmin, removeStaff, listHeadAdmins } from "../services/staff.service";

export async function cmdRemoveHeadAdmin(message: any) {
  const ok = await isHeadAdmin(message.author.id);
  if (!ok) {
    await message.reply("❌ No tienes permisos. Solo Head-Admins pueden remover Head-Admins.");
    return;
  }

  const target = message.mentions.users.first();
  if (!target) {
    await message.reply("Uso: `!removehead-admin @usuario`");
    return;
  }

  const heads = await listHeadAdmins();

  // Evitar que se queden sin Head-Admins
  if (heads.length <= 1 && heads.includes(target.id)) {
    await message.reply("⚠️ No puedes eliminar al último Head-Admin del sistema.");
    return;
  }

  await removeStaff(target.id);
  await message.reply(`✅ ${target.username} fue removido de **HEAD-ADMIN**.`);
}
