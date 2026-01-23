import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { prisma } from "../../db/prisma";
import { getRankInfoByXp } from "../../utils/ranks";
import {
  getRobloxUserIdByUsername,
  getRobloxGroupsByUserId,
  getRobloxAvatarHeadshot
} from "../../services/roblox.service";

function makeXpBar(current: number, max: number, size = 12) {
  const safeMax = Math.max(1, max);
  const pct = Math.min(1, Math.max(0, current / safeMax));
  const filled = Math.round(pct * size);
  return "█".repeat(filled) + "░".repeat(size - filled);
}

function shorten(text: string, maxLen: number) {
  if (!text) return "";
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen - 3) + "...";
}

export const cmdSlashPerfil = {
  data: new SlashCommandBuilder()
    .setName("perfil")
    .setDescription("Muestra tu perfil del sistema XP"),

  async execute(interaction: any) {
    const discordId = interaction.user.id;

    const profile = await prisma.userProfile.findUnique({
      where: { discordId }
    });

    if (!profile) {
      await interaction.reply({
        content: "⚠️ No tienes perfil aún. Usa `/setroblox` o `!setroblox`.",
        ephemeral: true
      });
      return;
    }

    const xp = profile.xp ?? 0;
    const robloxUsername = (profile.robloxUsername ?? "").trim();

    const rankInfo = getRankInfoByXp(xp, profile.isGeneral, profile.generalRank);
    const xpBar = makeXpBar(rankInfo.currentXpInRank, rankInfo.requiredXpForNextRank);
    const xpMissing = Math.max(0, rankInfo.requiredXpForNextRank - rankInfo.currentXpInRank);

    let robloxUserId: number | null = null;
    let groupsText = "No disponible.";

    if (robloxUsername) {
      robloxUserId = await getRobloxUserIdByUsername(robloxUsername);

      if (robloxUserId) {
        const groups = await getRobloxGroupsByUserId(robloxUserId);

        if (!groups.length) {
          groupsText = "No se encontraron grupos.";
        } else {
          groupsText = groups
            .slice(0, 10)
            .map((g) => `• **${shorten(g.groupName, 30)}** — ${shorten(g.roleName, 18)} (${g.roleRank})`)
            .join("\n");
        }
      } else {
        groupsText = "No se encontró el usuario de Roblox.";
      }
    } else {
      groupsText = "Vincula Roblox con `/setroblox`.";
    }

    const embed = new EmbedBuilder()
      .setTitle("👤 Perfil - GUS XP")
      .addFields(
        { name: "Discord", value: `<@${discordId}>`, inline: false },
        { name: "Roblox", value: robloxUsername ? `**${robloxUsername}**` : "No vinculado", inline: false },
        {
          name: "Rango",
          value:
            `• Clase: **${rankInfo.className}**\n` +
            `• Rango: **${rankInfo.currentRank}**\n` +
            `• Próximo: **${rankInfo.nextRank ?? "—"}**`,
          inline: false
        },
        {
          name: "XP",
          value:
            `${xpBar}\n` +
            `• Total: **${xp}**\n` +
            `• Faltan: **${xpMissing} XP**`,
          inline: false
        },
        { name: "Grupos Roblox (Top 10)", value: groupsText, inline: false }
      )
      .setTimestamp(new Date());

    if (robloxUserId) {
      const avatarUrl = await getRobloxAvatarHeadshot(robloxUserId);
      if (avatarUrl) embed.setThumbnail(avatarUrl);
    }

    await interaction.reply({ embeds: [embed] });
  }
};
