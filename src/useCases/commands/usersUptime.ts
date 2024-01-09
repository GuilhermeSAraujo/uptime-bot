import { Message } from 'discord.js';
import { getAllServerUptime, getUserUptime } from '../../repository/timeTrackRepository';
import { formatTime } from '../../utils/dateTimeUtils';

const usersUptime = async (msg: Message) => {
	try {
		const userId = msg.author.id;
		const serverId = msg.guildId;
		const serverName = msg.guild?.name;

		let message = "";

		if (serverId && serverName) {
			const userUptime = await getUserUptime({
				userId, serverId
			});
			message += `Tempo conectado no servidor ${serverName}: **${formatTime(userUptime)}**.\n`;
		}

		const totalUptime = await getAllServerUptime(userId);
		message += `Tempo total conectado nos servidores com UptimeBot: **${formatTime(totalUptime)}**`;

		msg.reply(message);
	} catch (e) {
		console.error(e);
		msg.reply("Não foi possível obter os dados.");
	}
};

export { usersUptime };
