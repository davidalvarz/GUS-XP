import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  TextChannel,
  MessageActionRowComponentBuilder
} from "discord.js";

import { prisma } from "../db/prisma";
import { settings } from "../config/settings";
import { listHeadAdmins } from "./staff.service";

export async function createApprovalRequest(
  client: any,
  requesterId: string,
  targetId: string,
  amount: number,
  type: "ADD" | "REMOVE",
  reason?: string
) {
  const req = await prisma.pendingXpRequest.create({
    data: { requesterId, targetId, amount, type, reason }
  });

  const embed = new EmbedBuilder()
    .setTitle("🛡️ Solicitud de XP - Requiere aprobación")
    .addFields(
      { name: "ID Solicitud", value: req.id, inline: false },
      { name: "Acción", value: type === "ADD" ? "Agregar XP" : "Quitar XP", inline: true },
      { name: "Cantidad", value: String(amount), inline: true },
      { name: "Admin solicitante", value: `<@${requesterId}>`, inline: true },
      { name: "Usuario objetivo", value: `<@${targetId}>`, inline: true },
      { name: "Razón", value: reason?.slice(0, 200) ?? "Sin razón", inline: false }
    )
    .setFooter({ text: "Aprobación requerida (Head-Admins)" });

  // ✅ FIX TS: usar MessageActionRowComponentBuilder
  const row = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId(`approve:${req.id}`)
      .setLabel("Aprobar")
      .setStyle(ButtonStyle.Success),
    new ButtonBuilder()
      .setCustomId(`reject:${req.id}`)
      .setLabel("Rechazar")
      .setStyle(ButtonStyle.Danger)
  );

  // ✅ Ping a todos los Head-Admins
  const heads = await listHeadAdmins();
  const pingHeads = heads.length ? heads.map((id) => `<@${id}>`).join(" ") : "⚠️ No hay Head-Admins registrados.";

  // Preferencia: canal de aprobaciones
  if (settings.approvalChannelId) {
    const ch = await client.channels.fetch(settings.approvalChannelId).catch(() => null);

    if (ch && ch.isTextBased()) {
      await (ch as TextChannel).send({
        content: `🔔 **Aprobación requerida:** ${pingHeads}`,
        embeds: [embed],
        components: [row]
      });
      return req;
    }
  }

  // Si no hay canal, manda DM a todos los Head-Admins
  for (const id of heads) {
    try {
      const headUser = await client.users.fetch(id);
      await headUser.send({
        content: `🔔 **Aprobación requerida** (${pingHeads})`,
        embeds: [embed],
        components: [row]
      });
    } catch {
      // ignore
    }
  }

  return req;
}
