const token =
  ""; //Token that you saved in step 5 of this tutorial
import { Client, IntentsBitField, GatewayIntentBits } from "discord.js";

const myIntents = new IntentsBitField();

myIntents.add(
  IntentsBitField.Flags.Guilds,
  IntentsBitField.Flags.GuildMessages,
  IntentsBitField.Flags.GuildMessageReactions,
  GatewayIntentBits.MessageContent,
  GatewayIntentBits.GuildVoiceStates
);

import { MongoClient } from "mongodb"; // hFuBTb5y5nZBxj5b

const connectionString =
  "";

const mongoClient = new MongoClient(connectionString);

const main = async () => {
  const client = new Client({ intents: myIntents });

  client.on("ready", (msg) => {
    console.log("The UptimeBot  is online"); //message when bot is online
  });

  client.on("messageCreate", (msg) => {
    console.log(msg.content);
    if (msg.content === "ping") {
      msg.reply("pong");
    }
  });

  client.on("voiceStateUpdate", async (oldState, newState) => {
    // Check if the user has joined a voice channel
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
        });

        if(user.totalMinutesOnline){
          const differenceInMilliseconds = new Date() - user.lastTimeEntered;
          const minutesOnline = Math.floor(differenceInMilliseconds / 1000 / 60);
        }
        console.log('user before', user);
        const result = await uptimeDb.insertOne({
          user: newState.member.user.tag,
          totalMinutesOnline:  user.totalMinutesOnline ? user.totalMinutesOnline : 0,
          lastTimeEntered: new Date()
        });
        console.log('user after', user);
        console.log(
          `A document was inserted with the _id: ${result.insertedId}`
        );
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
