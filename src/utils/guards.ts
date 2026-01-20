import { isAdmin, isHeadAdmin } from "../services/staff.service";

export async function requireAdmin(message: any): Promise<boolean> {
  const ok = await isAdmin(message.author.id);
  if (!ok) {
    await message.reply("❌ No tienes permisos para usar este comando. (Solo Admins)");
    return false;
  }
  return true;
}

export async function requireHeadAdmin(message: any): Promise<boolean> {
  const ok = await isHeadAdmin(message.author.id);
  if (!ok) {
    await message.reply("❌ No tienes permisos para usar este comando. (Solo Head-Admins)");
    return false;
  }
  return true;
}
