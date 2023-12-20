import { getUserByTagAndServerId, insertNewUser, updateTotalMinutesOnline } from '../repository/uptimeRepository.js';

const leaveChannel = async (oldState) => {
	console.log(`User ${oldState.member.user.tag} left voice channel ${oldState.channel.name}`);

	try {
		const user = await getUserByTagAndServerId({ tag: oldState.member.user.tag, serverId: oldState.guild.id });

		// user was already connected on server running
		if (!user) {
			await insertNewUser({
				tag: oldState.member.user.tag,
				displayName: oldState.member.user.displayName,
				serverId: oldState.guild.id,
				isOnline: false,
			});
			return;
		};

		const differenceInMilliseconds = new Date() - user.lastTimeEntered;
		const minutesOnline = Math.ceil(differenceInMilliseconds / 1000 / 60);

		await updateTotalMinutesOnline({
			isOnline: false,
			totalMinutesOnline: user.totalMinutesOnline + minutesOnline,
			serverId: oldState.guild.id,
			uptimeId: user._id
		});
	} catch (e) {
		console.log(e);
	}
}

export { leaveChannel }