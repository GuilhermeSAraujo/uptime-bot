import { MongoClient } from "mongodb";

const connectionString = "";
const mongoClient = new MongoClient(connectionString, {
	minPoolSize: 5, maxPoolSize: 30
});

const database = mongoClient.db("uptime");
const uptimeDb = database.collection("uptime-data");

export { uptimeDb };