import { isHeadAdmin, removeStaff, getStaffRole } from "../services/staff.service";

export async function cmdRemoveAdmin(message: any) {
  const ok = await isHeadAdmin(message.author.id);
  if (!ok) {
    await message.reply("❌ No tienes permisos. Solo Head-Admins pueden remover Admins.");
    return;
  }

  const target = message.mentions.users.first();
  if (!target) {
    await message.reply("Uso: `!removeadmin @usuario`");
    return;
  }

  const role = await getStaffRole(target.id);
  if (!role) {
    await message.reply("⚠️ Ese usuario no está registrado como staff.");
    return;
  }

  if (role !== "ADMIN") {
    await message.reply("⚠️ Ese usuario no es ADMIN (o es Head-Admin).");
    return;
  }

  await removeStaff(target.id);
  await message.reply(`✅ ${target.username} fue removido de **ADMIN**.`);
}
