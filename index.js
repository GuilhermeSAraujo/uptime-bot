const token =
  ""; //Token that you saved in step 5 of this tutorial
const connectionString =
  "";

import { Client, GatewayIntentBits, IntentsBitField } from "discord.js";

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

import { MongoClient } from "mongodb";


const mongoClient = new MongoClient(connectionString);

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
        try {
          await mongoClient.connect();

          const database = mongoClient.db("uptime");
          const uptimeDb = database.collection("uptime-data");

          const users = await uptimeDb.find({ serverId: msg.guildId })
            .sort({ totalMinutesOnline: -1 })
            .toArray();

          let text = `Tempo dos usuários no servidor: ${msg.guild.name}\n`;

          users.forEach((u, index) => {
            text += `${index + 1}° - @${u.userName} ${u.totalMinutesOnline} minutos.\n`;
          });

          msg.reply(text);
          return;
        } catch (e) {
          console.log(e);
        } finally {
          mongoClient.close();

        }
      }
    }
  });

  client.on("voiceStateUpdate", async (oldState, newState) => {
    if (!oldState.channelId && newState.channelId) {
      console.log(
        `User ${newState.member.user.tag} joined voice channel ${newState.channel.name}`
      );
      try {
        await mongoClient.connect();

        const database = mongoClient.db("uptime");
        const uptimeDb = database.collection("uptime-data");

        const user = await uptimeDb.findOne({
          user: newState.member.user.tag,
          serverId: newState.guild.id
        });

        // first time entered
        if (user == null) {
          await uptimeDb.insertOne({
            user: newState.member.user.tag,
            totalMinutesOnline: 0,
            lastTimeEntered: new Date(),
            serverId: newState.guild.id,
            userName: newState.member.user.displayName
          });
          return;
        }

        // already exists
        await uptimeDb.updateOne({ _id: user._id, serverId: newState.guild.id }, {
          $set: {
            lastTimeEntered: new Date()
          }
        });

      } catch (e) {
        console.log(e);
      } finally {
        mongoClient.close();
      }
    }
    if (oldState.channelId && !newState.channelId) {
      console.log(
        `User ${oldState.member.user.tag} left voice channel ${oldState.channel.name}`
      );
      try {
        await mongoClient.connect();

        const database = mongoClient.db("uptime");
        const uptimeDb = database.collection("uptime-data");

        const user = await uptimeDb.findOne({
          user: oldState.member.user.tag,
          serverId: oldState.guild.id
        });

        if (!user) {
          await uptimeDb.insertOne({
            user: oldState.member.user.tag,
            totalMinutesOnline: 0,
            lastTimeEntered: new Date(),
            serverId: oldState.guild.id,
            userName: oldState.member.user.displayName
          });
          return;
        };

        const differenceInMilliseconds = new Date() - user.lastTimeEntered;
        const minutesOnline = Math.ceil(differenceInMilliseconds / 1000 / 60);

        const updateQuery = { _id: user._id, serverId: oldState.guild.id };
        const newValues = {
          $set: {
            totalMinutesOnline: user.totalMinutesOnline + minutesOnline
          }
        };

        await uptimeDb.updateOne(updateQuery, newValues);
      } catch (e) {
        console.log(e);
      } finally {
        mongoClient.close();
      }
    }
  });

  client.login(token);
};

main().catch(console.error);