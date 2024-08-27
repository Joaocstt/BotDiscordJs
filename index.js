const Discord = require("discord.js");
const {
  Client,
  Collection,
  GatewayIntentBits,
  PermissionFlagsBits,
} = require("discord.js");
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const config = require("./config.json");
const fs = require("fs")
client.login(config.token);
module.exports = client;
client.commands = new Discord.Collection();
client.slashCommands = new Discord.Collection();
client.config = require("./config.json");
require("./handler")(client);
const { glob } = require("glob");

client.pendingRequests = new Collection();

fs.readdir('./events/', (err, file) => {
  file.forEach(event => {
    require(`./events/${event}`)
  })
}) 

