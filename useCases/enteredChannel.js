import { getUserByTagAndServerId, insertNewUser, updateLastTimeEntered } from '../repository/uptimeRepository.js';

const enteredChannel = async (newState) => {
	console.log(`User ${newState.member.user.tag} joined voice channel ${newState.channel.name}`);

	try {
		const user = await getUserByTagAndServerId({
			tag: newState.member.user.tag,
			serverId: newState.guild.id
		});

		// first time entered
		if (user == null) {
			await insertNewUser({
				tag: newState.member.user.tag,
				totalMinutesOnline: 0,
				lastTimeEntered: new Date(),
				serverId: newState.guild.id,
				displayName: newState.member.user.displayName,
				isOnline: true,
			});

			return;
		}

		await updateLastTimeEntered({ uptimeId: user._id, serverId: newState.guild.id, time: new Date(), isOnline: true });

	} catch (e) {
		console.log(e);
	}
}

export { enteredChannel }