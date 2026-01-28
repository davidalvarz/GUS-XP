import { prisma } from "../db/prisma";
import { getRankInfoByXp } from "../utils/ranks";
import { isAdmin, isHeadAdmin } from "../services/staff.service";
import {
  createApprovalRequest,
  buildApprovalButtons,
  buildHeadAdminPingText
} from "../services/approval.service";

/**
 * Regla: desde Suboficiales hacia arriba puede solicitar XP sin whitelist.
 * (Tropas NO)
 */
async function canRequestXp(discordId: string): Promise<boolean> {
  // Head-admin siempre
  if (await isHeadAdmin(discordId)) return true;

  // Admin whitelist (si quieres mantenerlo como extra)
  if (await isAdmin(discordId)) return true;

  // Por rango/clase en el sistema XP
  const profile = await prisma.userProfile.findUnique({
    where: { discordId }
  });

  if (!profile) return false;

  // Si es General, lo consideramos "alto rango" para solicitar XP (puedes cambiarlo a false si no quieres)
  if (profile.isGeneral) return true;

  const xp = profile.xp ?? 0;
  const rankInfo = getRankInfoByXp(xp, profile.isGeneral, profile.generalRank);

  // Ajusta si tus nombres exactos difieren (pero estos suelen coincidir)
  const className = String(rankInfo.className || "").toLowerCase();

  // Suboficiales, Oficiales, Oficiales Mayores (y Generales ya cubiertos arriba)
  const allowed =
    className.includes("suboficial") ||
    className.includes("oficiales mayores") ||
    (className.includes("oficial") && !className.includes("suboficial"));

  return allowed;
}

export async function cmdAddXp(client: any, message: any, args: string[]) {
  try {
    const requesterId = message.author.id;

    // ✅ Permisos según tu nueva regla
    const allowed = await canRequestXp(requesterId);
    if (!allowed) {
      await message.reply(
        "❌ No tienes permisos para usar este comando. Solo Suboficiales o superior pueden solicitar XP."
      );
      return;
    }

    // ✅ Target
    const target = message.mentions.users.first();
    if (!target) {
      await message.reply("Uso: `!addxp @usuario <cantidad> [motivo]`");
      return;
    }
    if (target.bot) {
      await message.reply("❌ No puedes dar XP a un bot.");
      return;
    }

    // ✅ Cantidad
    const amount = Number(args[1]);
    if (!amount || Number.isNaN(amount) || amount <= 0) {
      await message.reply("❌ Cantidad inválida. Ejemplo: `!addxp @usuario 50 entrenamiento`");
      return;
    }

    // ✅ Motivo
    const reason = args.slice(2).join(" ").trim() || "Sin motivo";

    // ✅ Crear solicitud (PENDING) — aprobación por Head-Admin
    const req = await createApprovalRequest({
      requestedById: requesterId,
      targetUserId: target.id,
      amount,
      reason
    });

    // ✅ Ping a TODOS los head-admins
    const pingText = await buildHeadAdminPingText();

    await message.reply({
      content:
        `📩 Solicitud de **AUMENTAR XP** creada.\n` +
        `👤 Solicitante: <@${requesterId}>\n` +
        `🎯 Usuario: <@${target.id}>\n` +
        `📈 XP: **+${amount}**\n` +
        `📝 Motivo: **${reason}**\n\n` +
        `${pingText}`,
      components: buildApprovalButtons(req.id)
    });
  } catch (err) {
    console.error("❌ Error en !addxp:", err);
    try {
      await message.reply("❌ Ocurrió un error ejecutando el comando `!addxp`.");
    } catch {}
  }
}
