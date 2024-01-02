import { Client, GatewayIntentBits, IntentsBitField } from "discord.js";
import cron from 'node-cron';
import { serversUptime } from './src/useCases/commands/serversUptime';
import { usersUptime } from "./src/useCases/commands/usersUptime";
import { enteredChannel } from "./src/useCases/enteredChannel";
import { leaveChannel } from "./src/useCases/leaveChannel";
import { updateOnlineUsers } from "./src/useCases/updateOnlineUsers";
import { config } from "dotenv";

config();

const token = process.env.DISCORD_TOKEN || "";

const myIntents = new IntentsBitField();

myIntents.add(
  IntentsBitField.Flags.Guilds,
  IntentsBitField.Flags.GuildMessages,
  IntentsBitField.Flags.GuildIntegrations,
  IntentsBitField.Flags.GuildMessageReactions,
  GatewayIntentBits.MessageContent,
  GatewayIntentBits.GuildVoiceStates,
  GatewayIntentBits.Guilds
);

const main = async () => {
  const client = new Client({ intents: myIntents });

  client.on("ready", (msg) => {
    console.log("The UptimeBot is online 🟢", new Date());
  });

  client.on("messageCreate", async (msg) => {
    if (msg.content[0] === "/") {
      if (msg.content === "/ping") {
        msg.reply("pong");
      }

      if (msg.content === "/uptime") {
        await usersUptime(msg);
      }

      if (msg.content === "/uptimeServer") {
        await serversUptime(msg);
      }

      if (msg.content === "/uptimeHelp") {
        msg.reply(`**/uptime**: para saber seu tempo online;\n**/uptimeServer**: para saber o TOP10 do servidor.`);
      }
    }
  });


  client.on("voiceStateUpdate", async (oldState, newState) => {
    if (!oldState.channelId && newState.channelId) {
      await enteredChannel(newState);
      return;
    }

    if (oldState.channelId && !newState.channelId) {
      await leaveChannel(oldState);
      return;
    }
  });

  // Running cronjob every 5 minutes
  // cron.schedule('*/5 * * * *', async () => {
  //   await updateOnlineUsers();
  // });
  cron.schedule('* * * * *', async () => {
    await updateOnlineUsers();
  });


  client.login(token);
};

main().catch(console.error);