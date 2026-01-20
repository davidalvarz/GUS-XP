import { requireHeadAdmin } from "../utils/guards";
import { removeAdmin, getStaffRole } from "../services/staff.service";

export async function cmdRemoveAdmin(message: any) {
  const ok = await requireHeadAdmin(message);
  if (!ok) return;

  const target = message.mentions.users.first();
  if (!target) {
    await message.reply("Uso: `!removeadmin @usuario`");
    return;
  }

  const role = await getStaffRole(target.id);

  if (!role) {
    await message.reply(`⚠️ <@${target.id}> no está registrado en el staff.`);
    return;
  }

  if (role === "HEAD_ADMIN") {
    await message.reply(`⚠️ <@${target.id}> es **HEAD-ADMIN**. Usa \`!removehead-admin\`.`);
    return;
  }

  await removeAdmin(target.id);
  await message.reply(`✅ <@${target.id}> fue removido de **ADMIN**.`);
}
