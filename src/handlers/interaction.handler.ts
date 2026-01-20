import { prisma } from "../db/prisma";
import { isHeadAdmin } from "../services/staff.service";

export async function handleInteraction(interaction: any) {
  if (!interaction.isButton()) return;

  const [action, requestId] = interaction.customId.split(":");
  if (!requestId) return;

  // ✅ Solo Head-Admins pueden aprobar/rechazar
  const ok = await isHeadAdmin(interaction.user.id);
  if (!ok) {
    await interaction.reply({
      content: "❌ Solo Head-Admins pueden aprobar solicitudes.",
      ephemeral: true
    });
    return;
  }

  const req = await prisma.pendingXpRequest.findUnique({ where: { id: requestId } });
  if (!req) {
    await interaction.reply({ content: "Solicitud no encontrada.", ephemeral: true });
    return;
  }

  if (req.status !== "PENDING") {
    await interaction.reply({
      content: `Esta solicitud ya fue procesada (${req.status}).`,
      ephemeral: true
    });
    return;
  }

  if (action === "approve") {
    const targetProfile = await prisma.userProfile.upsert({
      where: { discordId: req.targetId },
      create: { discordId: req.targetId, xp: 0 },
      update: {}
    });

    // Bloquear cambios si es General
    if (targetProfile.isGeneral) {
      await prisma.pendingXpRequest.update({
        where: { id: req.id },
        data: { status: "REJECTED" }
      });

      await interaction.update({
        content: `❌ Rechazado: <@${req.targetId}> es **General** y no puede recibir cambios de XP.`,
        embeds: [],
        components: []
      });
      return;
    }

    const delta = req.type === "ADD" ? req.amount : -req.amount;
    const newXp = Math.max(0, targetProfile.xp + delta);

    await prisma.userProfile.update({
      where: { discordId: req.targetId },
      data: { xp: newXp }
    });

    await prisma.pendingXpRequest.update({
      where: { id: req.id },
      data: { status: "APPROVED" }
    });

    await interaction.update({
      content: `✅ **Aprobado** por <@${interaction.user.id}>. XP actualizado para <@${req.targetId}>.`,
      embeds: [],
      components: []
    });
    return;
  }

  if (action === "reject") {
    await prisma.pendingXpRequest.update({
      where: { id: req.id },
      data: { status: "REJECTED" }
    });

    await interaction.update({
      content: `❌ **Rechazado** por <@${interaction.user.id}>. No se aplicaron cambios.`,
      embeds: [],
      components: []
    });
    return;
  }
}
