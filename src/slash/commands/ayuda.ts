import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { settings } from "../../config/settings";

export const cmdSlashAyuda = {
  data: new SlashCommandBuilder()
    .setName("ayuda")
    .setDescription("Muestra la ayuda del bot"),

  async execute(interaction: any) {
    const embed = new EmbedBuilder()
      .setTitle("📌 GUS XP - Ayuda")
      .setDescription(
        `**Comandos principales:**\n` +
          `• \`${settings.prefix}ayuda\`\n` +
          `• \`${settings.prefix}perfil\`\n` +
          `• \`${settings.prefix}setroblox <usuario>\`\n\n` +
          `**Staff:**\n` +
          `• \`${settings.prefix}addxp @user <cantidad> [motivo]\`\n` +
          `• \`${settings.prefix}removexp @user <cantidad> [motivo]\`\n` +
          `• \`${settings.prefix}stafflist\`\n`
      );

    await interaction.reply({ embeds: [embed] });
  }
};
