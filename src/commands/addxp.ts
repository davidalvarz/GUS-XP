import { parseAmount } from "../utils/parse";
import { createApprovalRequest } from "../services/approval.service";
import { isAdmin } from "../services/staff.service";

export async function cmdAddXp(client: any, message: any, args: string[]) {
  const ok = await isAdmin(message.author.id);
  if (!ok) {
    await message.reply("❌ No estás autorizado para usar comandos de XP. (Solo Admins)");
    return;
  }

  const target = message.mentions.users.first();
  if (!target) {
    await message.reply("Uso: `!addxp @usuario <cantidad> [razón]`");
    return;
  }

  const amount = parseAmount(args[1]);
  if (amount === null || amount <= 0) {
    await message.reply("La cantidad debe ser un número entero positivo. Ej: `!addxp @user 50`");
    return;
  }

  const reason = args.slice(2).join(" ").trim() || undefined;

  await createApprovalRequest(client, message.author.id, target.id, amount, "ADD", reason);
  await message.reply("✅ Solicitud enviada a Head-Admins para aprobación.");
}
