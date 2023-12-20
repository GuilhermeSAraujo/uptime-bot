import { getAllUsersFromServer } from '../../repository/uptimeRepository.js';

const usersUptime = async (msg) => {
	try {
		const users = await getAllUsersFromServer({ serverId: msg.guildId });

		let text = `Tempo dos usuários no servidor: ${msg.guild.name}\n`;

		users.forEach((u, index) => {
			text += `${index + 1}° - ${u.userName} - ${u.totalMinutesOnline} minutos.\n`;
		});

		msg.reply(text);
		return;
	} catch (e) {
		console.log(e);
	}
};

export { usersUptime }