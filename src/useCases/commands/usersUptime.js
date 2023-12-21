import { getAllUsersFromServer } from '../../repository/uptimeRepository.js';

const usersUptime = async (msg) => {
	try {
		const users = await getAllUsersFromServer({ serverId: msg.guildId });

		let text = `Tempo dos usuários no servidor: ${msg.guild.name}\n`;

		users.forEach((u, index) => {
			const formattedTime = formatTime(u.totalMinutesOnline);
			text += `${index + 1}° - ${u.userName} - ${formattedTime}.\n`;
		});

		msg.reply(text);
		return;
	} catch (e) {
		console.log(e);
	}
};

const formatTime = (minutes) => {
	const days = Math.floor(minutes / 1440);
	minutes -= days * 1440; // 1440 = minutes in a day
	const hours = Math.floor(minutes / 60);
	minutes -= hours * 60; // 60 = minutes in an hour

	let result = '';
	if (days) result += `${days} dia(s) `;
	if (hours) result += `${hours} hora(s) `;
	if (minutes) result += `${minutes} minuto(s)`;

	return result.trim();
};

export { usersUptime }