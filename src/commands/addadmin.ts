import { requireHeadAdmin } from "../utils/guards";
import { addAdmin } from "../services/staff.service";

export async function cmdAddAdmin(message: any) {
  const ok = await requireHeadAdmin(message);
  if (!ok) return;

  const target = message.mentions.users.first();
  if (!target) {
    await message.reply("Uso: `!addadmin @usuario`");
    return;
  }

  await addAdmin(target.id);
  await message.reply(`✅ <@${target.id}> fue agregado como **ADMIN**.`);
}
