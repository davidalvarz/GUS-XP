import { requireHeadAdmin } from "../utils/guards";
import { addHeadAdmin } from "../services/staff.service";

export async function cmdAddHeadAdmin(message: any) {
  const ok = await requireHeadAdmin(message);
  if (!ok) return;

  const target = message.mentions.users.first();
  if (!target) {
    await message.reply("Uso: `!addhead-admin @usuario`");
    return;
  }

  await addHeadAdmin(target.id);
  await message.reply(`✅ <@${target.id}> fue agregado como **HEAD-ADMIN**.`);
}
