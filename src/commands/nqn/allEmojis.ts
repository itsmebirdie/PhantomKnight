import { MessageEmbed, CommandInteraction } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import { emojiModel as emojisModel } from "../../models/emojis";
module.exports = {
  command: new SlashCommandBuilder()
    .setName("nall")
    .setDescription("Sends list of emojis present in the database."),
  async run(interaction: CommandInteraction) {
    await interaction.deferReply({ ephemeral: true });
    const allEmojis = await emojisModel.find({});
    let allEmojisName: Array<string> = [];
    allEmojis.forEach((emoji) => {
      allEmojisName.push(`**${emoji.customName}**`);
    });
    const emb = new MessageEmbed()
      .setTimestamp()
      .setTitle("Emojis")
      .setDescription(`${allEmojisName.join(",")}`)
      .setFooter("All Emoji Names are bold and separated by commas");
    await interaction.editReply({ embeds: [emb] });
  },
};