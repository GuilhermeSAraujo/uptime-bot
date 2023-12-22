import { getAllUsersFromServer } from '../../repository/uptimeRepository.js';
import { formatTime } from '../../utils/dateTimeUtils.js';

const serversUptime = async (msg) => {
	try {
		const users = await getAllUsersFromServer({ serverId: msg.guildId });

		let text = `Tempo dos usuários no servidor: ${msg.guild.name}\n`;

		users.forEach((u, index) => {
			const formattedTime = formatTime(u.totalMinutesOnline);
			text += `${index + 1}° - ${u.userName} - **${formattedTime}**.\n`;
		});

		msg.reply(text);
		return;
	} catch (e) {
		console.log(e);
	}
};

export { serversUptime }