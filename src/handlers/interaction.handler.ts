import { prisma } from "../db/prisma";
import { isHeadAdmin } from "../services/staff.service";

export async function handleInteraction(interaction: any) {
  try {
    if (!interaction.isButton()) return;

    const customId: string = interaction.customId || "";
    if (!customId.startsWith("xp_approve:") && !customId.startsWith("xp_deny:")) return;

    const [action, requestId] = customId.split(":");
    if (!requestId) return;

    // Solo Head-Admins pueden aprobar/denegar
    const ok = await isHeadAdmin(interaction.user.id);
    if (!ok) {
      await interaction.reply({ content: "❌ Solo Head-Admins pueden aprobar solicitudes.", ephemeral: true });
      return;
    }

    const req = await prisma.approvalRequest.findUnique({
      where: { id: requestId }
    });

    if (!req) {
      await interaction.reply({ content: "⚠️ Solicitud no encontrada.", ephemeral: true });
      return;
    }

    if (req.status !== "PENDING") {
      await interaction.reply({ content: "⚠️ Esta solicitud ya fue procesada.", ephemeral: true });
      return;
    }

    if (action === "xp_approve") {
      await prisma.$transaction(async (tx) => {
        // Actualizar estado
        await tx.approvalRequest.update({
          where: { id: requestId },
          data: {
            status: "APPROVED",
            reviewedById: interaction.user.id,
            reviewedAt: new Date()
          }
        });

        // Aplicar XP al target
        await tx.userProfile.upsert({
          where: { discordId: req.targetUserId },
          create: {
            discordId: req.targetUserId,
            xp: Math.max(0, req.amount),
            robloxUsername: "",
            isGeneral: false,
            generalRank: ""
          },
          update: {
            xp: { increment: req.amount }
          }
        });
      });

      await interaction.update({
        content: `✅ Solicitud aprobada por <@${interaction.user.id}>.\n📌 Usuario: <@${req.targetUserId}>\n📈 XP: **${req.amount}**`,
        components: []
      });

      return;
    }

    if (action === "xp_deny") {
      await prisma.approvalRequest.update({
        where: { id: requestId },
        data: {
          status: "DENIED",
          reviewedById: interaction.user.id,
          reviewedAt: new Date()
        }
      });

      await interaction.update({
        content: `❌ Solicitud rechazada por <@${interaction.user.id}>.\n📌 Usuario: <@${req.targetUserId}>\n📉 XP solicitada: **${req.amount}**`,
        components: []
      });

      return;
    }
  } catch (err) {
    console.error("❌ Error en interaction handler:", err);
    try {
      await interaction.reply({ content: "❌ Ocurrió un error procesando la interacción.", ephemeral: true });
    } catch {}
  }
}
