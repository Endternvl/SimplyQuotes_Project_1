const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const userSchema = require("../../schemas/userSchema"); // Assuming the path to userSchema

module.exports = {
  data: new SlashCommandBuilder()
    .setName("bot-stats")
    .setDescription("Get statistics about the bot")
    .toJSON(),
  userPermissions: [],
  botPermissions: [],

  run: async (client, interaction) => {
    const totalGuilds = client.guilds.cache.size;
    const totalMembers = client.guilds.cache.reduce(
      (acc, guild) => acc + guild.memberCount,
      0
    );
    const totalQuotes = await userSchema.countDocuments(); // Assuming quotes are counted in userSchema

    const statsEmbed = new EmbedBuilder()
      .setColor("#4A5EAD")
      .setTitle("🤖 Bot Statistics 📊")
      .setDescription("Here's a quick glance at some cool stats about me!")
      .addFields(
        { name: "🏠 Guilds", value: `${totalGuilds}`, inline: true },
        { name: "👥 Members", value: `${totalMembers}`, inline: true },
        { name: "💬 Community Quotes", value: `${totalQuotes}`, inline: true },
        { name: "📜 Default Quotes", value: "50", inline: true }
      )
      .setFooter({
        text: `📅 Statistics as of now`,
        iconURL: client.user.displayAvatarURL(),
      })
      .setTimestamp();

    await interaction.reply({
      embeds: [statsEmbed],
      ephemeral: false,
    });
  },
};
