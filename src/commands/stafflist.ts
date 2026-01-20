import { EmbedBuilder } from "discord.js";
import { prisma } from "../db/prisma";
import { requireHeadAdmin } from "../utils/guards";
import { settings } from "../config/settings";

export async function cmdStaffList(message: any) {
  const ok = await requireHeadAdmin(message);
  if (!ok) return;

  const staff = await prisma.staffMember.findMany({
    orderBy: { createdAt: "asc" },
    select: { discordId: true, role: true }
  });

  const headAdmins = staff
    .filter((s) => s.role === "HEAD_ADMIN")
    .map((s) => s.discordId);

  const admins = staff
    .filter((s) => s.role === "ADMIN")
    .map((s) => s.discordId);

  // ✅ aseguramos que el OWNER aparezca SIEMPRE
  if (settings.ownerId && !headAdmins.includes(settings.ownerId)) {
    headAdmins.unshift(settings.ownerId);
  }

  const embed = new EmbedBuilder()
    .setTitle("📋 Staff List - GUS XP")
    .setDescription(
      "Lista del personal autorizado del sistema.\n\n" +
      "⭐ **HEAD-ADMIN:** aprueban solicitudes de XP y gestionan staff.\n" +
      "🛡️ **ADMIN:** pueden solicitar dar/quitar XP (requiere aprobación)."
    )
    .addFields(
      {
        name: `⭐ Head-Admins (${headAdmins.length})`,
        value:
          headAdmins.length > 0
            ? headAdmins.map((id) => `• <@${id}> \`(${id})\``).join("\n")
            : "No hay Head-Admins registrados.",
        inline: false
      },
      {
        name: `🛡️ Admins (${admins.length})`,
        value:
          admins.length > 0
            ? admins.map((id) => `• <@${id}> \`(${id})\``).join("\n")
            : "No hay Admins registrados.",
        inline: false
      }
    )
    .setFooter({ text: "Comando restringido: solo Head-Admins" })
    .setTimestamp(new Date());

  await message.reply({ embeds: [embed] });
}
