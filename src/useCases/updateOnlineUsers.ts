import { getOnlineUsers, updateDuration } from "../repository/timeTrackRepository";

const updateOnlineUsers = async () => {
	console.log("Starting update uptime routine", new Date());

	const onlineUsersTimeTrack = await getOnlineUsers();

	onlineUsersTimeTrack.forEach(async (t) => {
		console.log("online user time track", t);
		const differenceInMilliseconds = new Date().getTime() - new Date(t.enterTime).getTime();
		const minutesOnline = Math.ceil(differenceInMilliseconds / 1000 / 60);
		await updateDuration({ id: t.id, duration: minutesOnline });
	});

	console.log("Routine finished", new Date());
};


export { updateOnlineUsers };