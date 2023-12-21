import { getAllUsersOnline, updateTotalMinutesOnline } from '../repository/uptimeRepository.js';

const updateOnlineUsers = async () => {
	console.log("Starting update uptime routine", new Date());
	const allUsers = await getAllUsersOnline();

	console.log("Total users online", allUsers.length);
	const usersByServer = groupUsersByServerId(allUsers);

	for (let serverId in usersByServer) {
		console.log(`Processing server: ${serverId}`);
		const usersInServer = usersByServer[serverId];

		for (let user of usersInServer) {
			const differenceInMilliseconds = new Date() - user.lastTimeEntered;
			const minutesOnline = Math.ceil(differenceInMilliseconds / 1000 / 60);

			await updateTotalMinutesOnline({
				totalMinutesOnline: user.totalMinutesOnline + minutesOnline,
				serverId: user.serverId,
				uptimeId: user._id,
				isOnline: user.isOnline
			});
		}
	}
	console.log("Routine finished", new Date());
};

const groupUsersByServerId = (allUsers) => {
	return allUsers.reduce((acc, user) => {
		if (!acc[user.serverId]) {
			acc[user.serverId] = [];
		}
		acc[user.serverId].push(user);
		return acc;
	}, {});
};

export { updateOnlineUsers };