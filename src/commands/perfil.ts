import { EmbedBuilder } from "discord.js";
import { prisma } from "../db/prisma";
import { getRankInfoByXp } from "../utils/ranks";
import {
  getRobloxUserIdByUsername,
  getRobloxGroupsByUserId,
  robloxAvatarHeadshotUrl
} from "../services/roblox.service";

function makeXpBar(current: number, max: number, size = 12) {
  const safeMax = Math.max(1, max);
  const pct = Math.min(1, Math.max(0, current / safeMax));
  const filled = Math.round(pct * size);
  const empty = size - filled;
  return "█".repeat(filled) + "░".repeat(empty);
}

function shorten(text: string, maxLen: number) {
  if (!text) return "";
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen - 3) + "...";
}

export async function cmdPerfil(message: any) {
  const discordId = message.author.id;

  try {
    const profile = await prisma.userProfile.findUnique({
      where: { discordId }
    });

    if (!profile) {
      await message.reply(
        "⚠️ No tienes perfil creado todavía.\n" +
          "✅ Usa el comando `!setroblox NOMBRE_DE_ROBLOX` para vincular tu cuenta."
      );
      return;
    }

    const currentXp = profile.xp ?? 0;

    // ✅ IMPORTANTE: nombre correcto (robloxUsername)
    const robloxUsername = (profile.robloxUsername ?? "").trim();

    // ✅ Rank info
    const rankInfo = getRankInfoByXp(currentXp, profile.isGeneral, profile.generalRank);

    const xpBar = makeXpBar(rankInfo.currentXpInRank, rankInfo.requiredXpForNextRank);
    const xpMissing = Math.max(0, rankInfo.requiredXpForNextRank - rankInfo.currentXpInRank);

    // ✅ Roblox groups
    let robloxUserId: number | null = null;
    let groupsText = "No disponible.";

    if (robloxUsername.length > 0) {
      robloxUserId = await getRobloxUserIdByUsername(robloxUsername);

      if (robloxUserId) {
        const groups = await getRobloxGroupsByUserId(robloxUserId);

        if (!groups || groups.length === 0) {
          groupsText = "No se encontraron grupos o la API no respondió.";
        } else {
          const top = groups.slice(0, 10);
          groupsText = top
            .map((g) => {
              const primary = g.isPrimaryGroup ? " ⭐" : "";
              const owner = g.isOwner ? " 👑" : "";
              return `• **${shorten(g.groupName, 32)}** — ${shorten(g.roleName, 22)} (${g.roleRank})${primary}${owner}`;
            })
            .join("\n");

          if (groups.length > 10) {
            groupsText += `\n… y **${groups.length - 10}** más`;
          }
        }
      } else {
        groupsText = "No se pudo encontrar el usuario de Roblox (revisa el nombre).";
      }
    } else {
      groupsText = "Vincula tu Roblox con `!setroblox NOMBRE` para ver tus grupos.";
    }

    const embed = new EmbedBuilder()
      .setTitle("👤 Perfil - GUS XP")
      .setDescription("Información del perfil del usuario.")
      .addFields(
        {
          name: "Discord",
          value: `• Usuario: <@${discordId}>\n• ID: \`${discordId}\``,
          inline: false
        },
        {
          name: "Roblox",
          value: robloxUserId
            ? `• Usuario: **${robloxUsername}**\n• ID: \`${robloxUserId}\``
            : `• Usuario: **${robloxUsername.length > 0 ? robloxUsername : "No vinculado"}**`,
          inline: false
        },
        {
          name: "Rango",
          value:
            `• Clase: **${rankInfo.className}**\n` +
            `• Rango actual: **${rankInfo.currentRank}**\n` +
            `• Próximo rango: **${rankInfo.nextRank ?? "—"}**`,
          inline: false
        },
        {
          name: "XP",
          value:
            `${xpBar}\n` +
            `• XP total: **${currentXp}**\n` +
            `• Dentro del rango: **${rankInfo.currentXpInRank}/${rankInfo.requiredXpForNextRank}**\n` +
            `• Faltan: **${xpMissing} XP**`,
          inline: false
        },
        {
          name: "Grupos de Roblox (Top 10)",
          value: groupsText.length > 1024 ? groupsText.slice(0, 1020) + "..." : groupsText,
          inline: false
        }
      )
      .setFooter({ text: "GUS XP • Sistema de rangos y XP" })
      .setTimestamp(new Date());

    if (robloxUserId) {
      embed.setThumbnail(robloxAvatarHeadshotUrl(robloxUserId));
    }

    await message.reply({ embeds: [embed] });
  } catch (err) {
    console.error("❌ Error en !perfil:", err);
    await message.reply("❌ Ocurrió un error ejecutando `!perfil`.");
  }
}
