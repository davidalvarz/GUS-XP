import { createApprovalRequest, buildApprovalButtons, buildHeadAdminPingText } from "../services/approval.service";
import { isAdmin } from "../services/staff.service";

export async function cmdAddXp(client: any, message: any, args: string[]) {
  const ok = await isAdmin(message.author.id);
  if (!ok) {
    await message.reply("❌ No tienes permisos para usar este comando.");
    return;
  }

  const target = message.mentions.users.first();
  if (!target) {
    await message.reply("Uso: `!addxp @usuario <cantidad> [motivo]`");
    return;
  }

  const amount = Number(args[1]);
  if (!amount || isNaN(amount) || amount <= 0) {
    await message.reply("❌ Cantidad inválida. Ejemplo: `!addxp @usuario 50 entrenamiento`");
    return;
  }

  const reason = args.slice(2).join(" ").trim() || "Sin motivo";

  // ✅ Creamos la solicitud con el nuevo formato (objeto)
  const req = await createApprovalRequest({
    requestedById: message.author.id,
    targetUserId: target.id,
    amount: amount,
    reason
  });

  const pingText = await buildHeadAdminPingText();

  await message.reply({
    content:
      `📩 Solicitud de **AUMENTAR XP** creada.\n` +
      `👤 Admin: <@${message.author.id}>\n` +
      `🎯 Usuario: <@${target.id}>\n` +
      `📈 XP: **+${amount}**\n` +
      `📝 Motivo: **${reason}**\n\n` +
      `${pingText}`,
    components: buildApprovalButtons(req.id)
  });
}
