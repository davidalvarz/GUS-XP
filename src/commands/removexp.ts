import { createApprovalRequest, buildApprovalButtons, buildHeadAdminPingText } from "../services/approval.service";
import { isAdmin } from "../services/staff.service";

export async function cmdRemoveXp(client: any, message: any, args: string[]) {
  const ok = await isAdmin(message.author.id);
  if (!ok) {
    await message.reply("❌ No tienes permisos para usar este comando.");
    return;
  }

  const target = message.mentions.users.first();
  if (!target) {
    await message.reply("Uso: `!removexp @usuario <cantidad> [motivo]`");
    return;
  }

  const amountRaw = Number(args[1]);
  if (!amountRaw || isNaN(amountRaw) || amountRaw <= 0) {
    await message.reply("❌ Cantidad inválida. Ejemplo: `!removexp @usuario 30 sanción`");
    return;
  }

  const reason = args.slice(2).join(" ").trim() || "Sin motivo";

  // ✅ Para remover XP, guardamos amount negativo
  const req = await createApprovalRequest({
    requestedById: message.author.id,
    targetUserId: target.id,
    amount: -amountRaw,
    reason
  });

  const pingText = await buildHeadAdminPingText();

  await message.reply({
    content:
      `📩 Solicitud de **QUITAR XP** creada.\n` +
      `👤 Admin: <@${message.author.id}>\n` +
      `🎯 Usuario: <@${target.id}>\n` +
      `📉 XP: **-${amountRaw}**\n` +
      `📝 Motivo: **${reason}**\n\n` +
      `${pingText}`,
    components: buildApprovalButtons(req.id)
  });
}
