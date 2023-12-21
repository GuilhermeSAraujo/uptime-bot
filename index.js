import cron from 'node-cron';
import { Client, GatewayIntentBits, IntentsBitField } from "discord.js";
import { enteredChannel } from "./src/useCases/enteredChannel.js";
import { leaveChannel } from "./src/useCases/leaveChannel.js";
import { usersUptime } from "./src/useCases/commands/usersUptime.js";
import { updateOnlineUsers } from "./src/useCases/updateOnlineUsers.js";
import { allUsersUptime } from './src/useCases/commands/allUsersUptime.js';

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
    console.log("The UptimeBot is online 🟢");
  });

  client.on("messageCreate", async (msg) => {
    if (msg.content[0] === "/") {
      if (msg.content === "/ping") {
        msg.reply("pong");
      }

      if (msg.content === "/uptime") {
        await usersUptime(msg);
      }

      if (msg.content === "/uptimeAll") {
        await allUsersUptime(msg);
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
  cron.schedule('*/5 * * * *', async () => {
    await updateOnlineUsers();
  });

  client.login(token);
};

main().catch(console.error);