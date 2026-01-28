import { prisma } from "../db/prisma";
import { getRankInfoByXp } from "../utils/ranks";
import { isAdmin, isHeadAdmin } from "../services/staff.service";
import {
  createApprovalRequest,
  buildApprovalButtons,
  buildHeadAdminPingText
} from "../services/approval.service";

/**
 * Regla: desde Suboficiales hacia arriba puede solicitar quitar XP sin whitelist.
 * (Tropas NO)
 */
async function canRequestXp(discordId: string): Promise<boolean> {
  // Head-admin siempre
  if (await isHeadAdmin(discordId)) return true;

  // Admin whitelist (si quieres mantenerlo como extra)
  if (await isAdmin(discordId)) return true;

  const profile = await prisma.userProfile.findUnique({
    where: { discordId }
  });

  if (!profile) return false;

  // Si es General, lo consideramos "alto rango" para solicitar (cámbialo a false si no quieres)
  if (profile.isGeneral) return true;

  const xp = profile.xp ?? 0;
  const rankInfo = getRankInfoByXp(xp, profile.isGeneral, profile.generalRank);

  const className = String(rankInfo.className || "").toLowerCase();

  const allowed =
    className.includes("suboficial") ||
    className.includes("oficiales mayores") ||
    (className.includes("oficial") && !className.includes("suboficial"));

  return allowed;
}

export async function cmdRemoveXp(client: any, message: any, args: string[]) {
  try {
    const requesterId = message.author.id;

    // ✅ Permisos según tu nueva regla
    const allowed = await canRequestXp(requesterId);
    if (!allowed) {
      await message.reply(
        "❌ No tienes permisos para usar este comando. Solo Suboficiales o superior pueden solicitar quitar XP."
      );
      return;
    }

    // ✅ Target
    const target = message.mentions.users.first();
    if (!target) {
      await message.reply("Uso: `!removexp @usuario <cantidad> [motivo]`");
      return;
    }
    if (target.bot) {
      await message.reply("❌ No puedes quitar XP a un bot.");
      return;
    }

    // ✅ Cantidad
    const amountRaw = Number(args[1]);
    if (!amountRaw || Number.isNaN(amountRaw) || amountRaw <= 0) {
      await message.reply("❌ Cantidad inválida. Ejemplo: `!removexp @usuario 30 sanción`");
      return;
    }

    const reason = args.slice(2).join(" ").trim() || "Sin motivo";

    // ✅ Guardamos amount negativo para que al aprobar reste XP
    const req = await createApprovalRequest({
      requestedById: requesterId,
      targetUserId: target.id,
      amount: -amountRaw,
      reason
    });

    const pingText = await buildHeadAdminPingText();

    await message.reply({
      content:
        `📩 Solicitud de **QUITAR XP** creada.\n` +
        `👤 Solicitante: <@${requesterId}>\n` +
        `🎯 Usuario: <@${target.id}>\n` +
        `📉 XP: **-${amountRaw}**\n` +
        `📝 Motivo: **${reason}**\n\n` +
        `${pingText}`,
      components: buildApprovalButtons(req.id)
    });
  } catch (err) {
    console.error("❌ Error en !removexp:", err);
    try {
      await message.reply("❌ Ocurrió un error ejecutando el comando `!removexp`.");
    } catch {}
  }
}
