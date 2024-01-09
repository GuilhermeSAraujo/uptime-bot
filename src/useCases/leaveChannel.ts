import { VoiceState } from "discord.js";
import { createExit, getCurrentSession } from "../repository/timeTrackRepository";

const leaveChannel = async (oldState: VoiceState) => {
	console.log(`User ${oldState.member?.user.tag} left voice channel ${oldState.channel?.name}`);

	try {
		const userId = oldState.member?.user.id;
		const serverId = oldState.guild?.id;

		if (!userId || !serverId) {
			console.log("Insuficient data to proceed.");
			return;
		}

		const currentSession = await getCurrentSession({ userId, serverId });
		if (currentSession) {
			const differenceInMilliseconds = new Date().getTime() - new Date(currentSession.enterTime).getTime();
			const minutesOnline = Math.ceil(differenceInMilliseconds / 1000 / 60);

			await createExit({ id: currentSession.id, duration: minutesOnline });
		}
	} catch (e) {
		console.error(e);
	}
}

export { leaveChannel }