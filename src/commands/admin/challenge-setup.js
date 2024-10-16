const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChannelType,
  EmbedBuilder,
} = require("discord.js");
const quoteChallengeSchema = require("../../schemas/quoteChallengeSetup");
const mConfig = require("../../messageConfig.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("challenge-quote-setup")
    .setDescription("Configure or update the challenge quote system")
    .addChannelOption((o) =>
      o
        .setName("challenge-channel")
        .setDescription("The channel for challenge quotes.")
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true)
    )
    .addRoleOption((o) =>
      o
        .setName("challenge-role")
        .setDescription("The role to ping for challenge quotes.")
        .setRequired(false)
    )
    .addBooleanOption((o) =>
      o
        .setName("active")
        .setDescription("Toggle the challenge quote system on or off.")
        .setRequired(false)
    )
    .toJSON(),
  userPermissions: [PermissionFlagsBits.Administrator],
  botPermissions: [],

  run: async (client, interaction) => {
    const { options, guildId } = interaction;
    const role = options.getRole("challenge-role");
    const channel = options.getChannel("challenge-channel");
    const isActive = options.getBoolean("active") || false;
    const guildOwnerID = interaction.guild.ownerId;

    const rEmbed = new EmbedBuilder().setFooter({
      iconURL: `${client.user.displayAvatarURL({ dynamic: true })}`,
      text: `${client.user.username} - SimplyQuote`,
    });

    let data = await quoteChallengeSchema.findOne({ guildID: guildId });
    if (!data) {
      data = new quoteChallengeSchema({
        guildID: guildId,
        guildOwnerID: guildOwnerID,
      });
    } else {
      data.guildOwnerID = guildOwnerID;
    }

    if (channel) {
      data.quoteChallengeChannelID = channel.id;
    }
    if (role) {
      data.challengeRoleID = role.id;
    }
    data.isActive = isActive;

    await data.save();
    rEmbed
      .setColor(mConfig.embedColorSuccess)
      .setDescription(
        `✅ Challenge quote configuration updated:` +
          (channel ? ` Channel set to ${channel}.` : "") +
          (role ? ` Role set to ${role}.` : "") +
          (isActive ? " System is active." : " System is inactive.")
      );
    interaction.reply({ embeds: [rEmbed], ephemeral: true });
  },
};
