import { Message } from 'discord.js';
import { formatTime } from '../../utils/dateTimeUtils';
import { getAllUsersFromServerUptime } from '../../repository/timeTrackRepository';

const serversUptime = async (msg: Message) => {
	try {
		const serverId = msg.guild?.id;
		const serverName = msg.guild?.name;

		if (serverId && serverName) {

			const users = await getAllUsersFromServerUptime(serverId);

			let text = `TOP10 usuários do servidor: ${msg.guild?.name}\n`;

			users.forEach((u, index) => {
				const formattedTime = formatTime(u.totalMinutesOnline);
				text += `${index + 1}° - ${u.displayName} - **${formattedTime}**.\n`;
			});

			msg.reply(text);
			return;
		}
	} catch (e) {
		console.error(e);
		msg.reply("Não foi possível obter os dados.");
	}
};

export { serversUptime }