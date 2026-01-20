import { requireHeadAdmin } from "../utils/guards";
import { removeHeadAdmin, getStaffRole } from "../services/staff.service";

export async function cmdRemoveHeadAdmin(message: any) {
  const ok = await requireHeadAdmin(message);
  if (!ok) return;

  const target = message.mentions.users.first();
  if (!target) {
    await message.reply("Uso: `!removehead-admin @usuario`");
    return;
  }

  const role = await getStaffRole(target.id);

  if (!role) {
    await message.reply(`⚠️ <@${target.id}> no está registrado en el staff.`);
    return;
  }

  if (role !== "HEAD_ADMIN") {
    await message.reply(`⚠️ <@${target.id}> no es Head-Admin.`);
    return;
  }

  const removed = await removeHeadAdmin(target.id);

  if (!removed) {
    await message.reply("⚠️ No se pudo remover (puede ser el OWNER_ID protegido).");
    return;
  }

  await message.reply(`✅ <@${target.id}> fue removido de **HEAD-ADMIN**.`);
}
