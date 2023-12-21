import { uptimeDb } from './mongoClient.js';
const ORDER_BY_DESC = -1;

const getUserByTagAndServerId = async ({ tag, serverId }) => {
	const user = await uptimeDb.findOne({
		user: tag,
		serverId: serverId
	});

	return user;
};

const insertNewUser = async ({ tag, displayName, serverId, isOnline }) => {
	await uptimeDb.insertOne({
		user: tag,
		totalMinutesOnline: 0,
		isOnline: isOnline,
		lastTimeEntered: new Date(),
		serverId: serverId,
		userName: displayName
	});
};

const updateLastTimeEntered = async ({ uptimeId, serverId, time, isOnline }) => {
	await uptimeDb.updateOne({ _id: uptimeId, serverId }, {
		$set: {
			lastTimeEntered: time,
			isOnline: isOnline
		}
	});
}

const updateTotalMinutesOnline = async ({ uptimeId, serverId, totalMinutesOnline, isOnline }) => {
	await uptimeDb.updateOne({ _id: uptimeId, serverId }, {
		$set: {
			isOnline: isOnline,
			totalMinutesOnline: totalMinutesOnline,
			lastTimeEntered: new Date()
		}
	});
}

const getAllUsersFromServer = async ({ serverId }) => {
	const users = await uptimeDb.find({ serverId })
		.sort({ totalMinutesOnline: ORDER_BY_DESC })
		.toArray();

	return users;
};

const getAllUsersOnline = async () => {
	const users = await uptimeDb.find({ isOnline: true })
		.sort({ serverId: ORDER_BY_DESC })
		.toArray();

	return users;
};

const getAllUsers = async () => {
	const users = await uptimeDb.find({})
		.sort({ totalMinutesOnline: ORDER_BY_DESC })
		.toArray();

	return users;
};

export {
	getUserByTagAndServerId,
	insertNewUser,
	updateLastTimeEntered,
	updateTotalMinutesOnline,
	getAllUsersFromServer,
	getAllUsersOnline,
	getAllUsers
}