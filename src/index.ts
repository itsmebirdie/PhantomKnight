const registerSlashCommands = require("./handler/registerCommands");
const getJSFile = require("./handler");
import { connect, connection } from "mongoose";
require("dotenv").config();
connect(process.env.mongodbUrl as string);
connection.on("open", () => {
  console.log("connected to mongodb");
});
import { join } from "path";
const { Client, Intents, Collection } = require("discord.js");
const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_PRESENCES,
    Intents.FLAGS.GUILD_MEMBERS,
  ],
});
import type { Interaction, GuildMember } from "discord.js";
import welcomerEvent from "./events/welcomeMessage";
client.commands = new Collection();
const commands = [];

// Get all the `.js` files in the `commands` directory
const commandFiles = getJSFile(join(__dirname, "commands"));

// Import all command files and
// add them to the `client.commands` collection
commandFiles.forEach((file) => {
  const command = require(file);

  // Add the values to the array and `Collection`
  commands.push(command.command.toJSON());
  // Sets the name of the command as the key
  client.commands.set(command.command.name, command);
});

// Registers the slash commands
// NOTE: isGlobal value is set to false because the bot is still under development phase
registerSlashCommands(commands, false);
client.on("ready", async () => {
  console.log(`Logged in as ${client.user.tag}! at ${new Date()}`);
});

client.on("interactionCreate", async (interaction: Interaction) => {
  if (!interaction.isCommand()) {
    return;
  }
  const command = client.commands.get(interaction.commandName);
  if (!command) {
    return;
  }
  try {
    await command.run(interaction, client);
  } catch (error) {
    console.log(error.message);
  }
});

client.on("guildMemberAdd", async (userJoined: GuildMember) => {
  await welcomerEvent(userJoined, client);
});

client.login(process.env.token as string);