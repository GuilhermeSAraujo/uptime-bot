import { Client, GatewayIntentBits, IntentsBitField } from "discord.js";
import cron from 'node-cron';
import { enteredChannel } from "./useCases/enteredChannel.js";
import { leaveChannel } from "./useCases/leaveChannel.js";
import { usersUptime } from "./useCases/commands/usersUptime.js";
import { updateOnlineUsers } from "./useCases/updateOnlineUsers.js";

const token = "";

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
    console.log("The UptimeBot  is online"); //message when bot is online
  });

  client.on("messageCreate", async (msg) => {
    if (msg.content[0] === "/") {
      if (msg.content === "/ping") {
        msg.reply("pong");
      }

      if (msg.content === "/uptime") {
        await usersUptime(msg);
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

  cron.schedule('*/5 * * * *', async () => {
    console.log('Running a task every 5 minutes');
    await updateOnlineUsers();
  });

  client.login(token);
};

main().catch(console.error);