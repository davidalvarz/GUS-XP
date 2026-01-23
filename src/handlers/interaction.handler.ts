import { prisma } from "../db/prisma";
import { isHeadAdmin } from "../services/staff.service";
import { slashCommands } from "../slash/router";

export async function handleInteraction(interaction: any) {
  try {
    // =========================
    // ✅ SLASH COMMANDS ROUTER
    // =========================
    if (interaction.isChatInputCommand && interaction.isChatInputCommand()) {
      const cmd = slashCommands.get(interaction.commandName);

      if (!cmd) {
        // Comando slash no registrado en el router
        if (!interaction.replied) {
          await interaction.reply({
            content: "❌ Este comando no está disponible.",
            ephemeral: true
          });
        }
        return;
      }

      try {
        await cmd.execute(interaction);
      } catch (err) {
        console.error(`❌ Error ejecutando slash /${interaction.commandName}:`, err);

        try {
          if (!interaction.replied && !interaction.deferred) {
            await interaction.reply({
              content: "❌ Ocurrió un error ejecutando el comando.",
              ephemeral: true
            });
          } else {
            await interaction.editReply("❌ Ocurrió un error ejecutando el comando.");
          }
        } catch {}
      }

      return;
    }

    // =========================
    // ✅ BOTONES (Aprobación XP)
    // =========================
    if (!interaction.isButton || !interaction.isButton()) return;

    const customId: string = interaction.customId || "";

    // Solo manejamos botones de aprobaciones XP
    if (!customId.startsWith("xp_approve:") && !customId.startsWith("xp_deny:")) {
      return;
    }

    const [action, requestId] = customId.split(":");
    if (!requestId) return;

    // ✅ Solo Head-Admins pueden aprobar/denegar
    const ok = await isHeadAdmin(interaction.user.id);
    if (!ok) {
      await interaction.reply({
        content: "❌ Solo Head-Admins pueden aprobar solicitudes.",
        ephemeral: true
      });
      return;
    }

    // ✅ Buscar solicitud
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

    // =========================
    // ✅ APROBAR
    // =========================
    if (action === "xp_approve") {
      await prisma.$transaction(async (tx) => {
        // Cambiar estado
        await tx.approvalRequest.update({
          where: { id: requestId },
          data: {
            status: "APPROVED",
            reviewedById: interaction.user.id,
            reviewedAt: new Date()
          }
        });

        // Aplicar XP sin permitir negativos
        const targetProfile = await tx.userProfile.findUnique({
          where: { discordId: req.targetUserId }
        });

        if (!targetProfile) {
          await tx.userProfile.create({
            data: {
              discordId: req.targetUserId,
              xp: Math.max(0, req.amount),
              robloxUsername: "",
              isGeneral: false,
              generalRank: ""
            }
          });
        } else {
          const newXp = Math.max(0, (targetProfile.xp ?? 0) + req.amount);

          await tx.userProfile.update({
            where: { discordId: req.targetUserId },
            data: { xp: newXp }
          });
        }
      });

      await interaction.update({
        content:
          `✅ Solicitud aprobada por <@${interaction.user.id}>.\n` +
          `👤 Usuario: <@${req.targetUserId}>\n` +
          `📈 XP aplicada: **${req.amount}**`,
        components: []
      });

      return;
    }

    // =========================
    // ✅ RECHAZAR
    // =========================
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
        content:
          `❌ Solicitud rechazada por <@${interaction.user.id}>.\n` +
          `👤 Usuario: <@${req.targetUserId}>\n` +
          `📉 XP solicitada: **${req.amount}**`,
        components: []
      });

      return;
    }
  } catch (err) {
    console.error("❌ Error en interaction handler:", err);

    try {
      if (interaction?.reply) {
        await interaction.reply({
          content: "❌ Ocurrió un error procesando la interacción.",
          ephemeral: true
        });
      }
    } catch {}
  }
}
