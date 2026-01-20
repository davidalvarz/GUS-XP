import { EmbedBuilder } from "discord.js";
import { prisma } from "../db/prisma";
import { getCareerRankFromXp } from "../services/rank.service";
import { getRobloxAvatarHeadshot } from "../services/roblox.service";
import { progressBar } from "../utils/bar";

export async function cmdPerfil(message: any) {
  const target = message.mentions.users.first() ?? message.author;

  const profile = await prisma.userProfile.upsert({
    where: { discordId: target.id },
    create: { discordId: target.id, xp: 0 },
    update: {}
  });

  const robloxName = profile.robloxName ?? "No vinculado";
  const xp = profile.xp;

  let className = "Sin clase";
  let rankName = "Sin rango";
  let nextRankLabel = "N/A";
  let xpToNextLabel = "N/A";
  let bar = progressBar(0, 1);

  if (profile.isGeneral) {
    className = "Generales";
    rankName = profile.generalRank ?? "General (sin especificar)";
    nextRankLabel = "N/A (Bloqueado)";
    xpToNextLabel = "N/A";
    bar = progressBar(1, 1);
  } else {
    const { current, next } = getCareerRankFromXp(xp);
    className = current.className;
    rankName = current.rankName;

    if (next) {
      const currentBase = current.minXp;
      const needed = next.minXp - currentBase;
      const progress = xp - currentBase;
      const remaining = Math.max(0, next.minXp - xp);

      bar = progressBar(progress, needed);
      nextRankLabel = `${next.className} - ${next.rankName}`;
      xpToNextLabel = `${remaining} XP`;
    } else {
      bar = progressBar(1, 1);
      nextRankLabel = "Máximo alcanzado";
      xpToNextLabel = "0 XP";
    }
  }

  let avatarUrl: string | null = null;
  if (profile.robloxUserId) {
    avatarUrl = await getRobloxAvatarHeadshot(profile.robloxUserId);
  }

  const embed = new EmbedBuilder()
    .setTitle("Perfil")
    .setThumbnail(avatarUrl ?? target.displayAvatarURL())
    .addFields(
      { name: "Discord", value: `${target.username}`, inline: true },
      { name: "Roblox", value: robloxName, inline: true },
      { name: "Clase", value: className, inline: true },
      { name: "Rango actual", value: rankName, inline: true },
      { name: "Próximo rango", value: nextRankLabel, inline: true },
      { name: "XP actual", value: `${xp} XP`, inline: true },
      { name: "Faltante", value: xpToNextLabel, inline: true },
      { name: "Progreso", value: `\`${bar}\``, inline: false }
    );

  await message.reply({ embeds: [embed] });
}
