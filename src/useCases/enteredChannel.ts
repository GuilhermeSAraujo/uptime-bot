import { VoiceState } from "discord.js";
import { createUser, getUserById } from "../repository/userRepository";
import { createServer, getServerById } from "../repository/serverRepository";
import { createEntry } from "../repository/timeTrackRepository";

const enteredChannel = async (newState: VoiceState) => {
	console.log(`User ${newState.member?.user.tag} joined voice channel ${newState.channel?.name}`);

	try {
		const userId = newState.member?.user.id;
		const serverId = newState.guild?.id;

		if (!userId || !serverId) {
			console.log("Insuficient data to create proceed.");
			return;
		}

		const user = await getUserById(userId);

		const server = await getServerById(serverId);

		// first time user entered
		if (user == null) {
			await createUser({
				id: userId,
				displayName: newState.member.user.displayName,
				tag: newState.member.user.tag,
			});
		}

		// first time server is used
		if (server == null) {
			await createServer({
				id: serverId,
				name: newState.guild.name
			});
		}

		await createEntry({ userId, serverId });

	} catch (e) {
		console.error(e);
	}
}

export { enteredChannel }
