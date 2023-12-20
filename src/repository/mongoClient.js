import 'dotenv/config'
import { MongoClient } from "mongodb";

const connectionString = process.env.MONGO_CONNECTION || "";

const mongoClient = new MongoClient(connectionString, {
	minPoolSize: 5, maxPoolSize: 30
});

const database = mongoClient.db("uptime");
const uptimeDb = database.collection("uptime-data");

export { uptimeDb };