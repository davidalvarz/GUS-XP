import { SlashCommandBuilder } from "discord.js";
import { prisma } from "../../db/prisma";
import { getRobloxUserIdByUsername } from "../../services/roblox.service";

export const cmdSlashSetRoblox = {
  data: new SlashCommandBuilder()
    .setName("setroblox")
    .setDescription("Vincula tu usuario de Roblox")
    .addStringOption((opt: any) =>
      opt.setName("usuario").setDescription("Tu usuario exacto de Roblox").setRequired(true)
    ),

  async execute(interaction: any) {
    const username = String(interaction.options.getString("usuario")).trim();

    const userId = await getRobloxUserIdByUsername(username);
    if (!userId) {
      await interaction.reply({
        content: "❌ No pude encontrar ese usuario en Roblox.",
        ephemeral: true
      });
      return;
    }

    await prisma.userProfile.upsert({
      where: { discordId: interaction.user.id },
      create: {
        discordId: interaction.user.id,
        robloxUsername: username,
        xp: 0,
        isGeneral: false,
        generalRank: ""
      },
      update: { robloxUsername: username }
    });

    await interaction.reply({
      content: `✅ Roblox vinculado: **${username}** (ID: ${userId})`,
      ephemeral: true
    });
  }
};
