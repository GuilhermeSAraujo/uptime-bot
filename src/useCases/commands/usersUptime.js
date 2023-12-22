import { getUserDataByUser } from '../../repository/uptimeRepository.js';
import { formatTime } from '../../utils/dateTimeUtils.js';

const usersUptime = async (msg) => {
	try {
		const userData = await getUserDataByUser(msg.author.username);

		const userDataOnServer = userData.find(u => u.serverId === msg.guildId);

		let text = `Tempo conectado no servidor ${msg.guild.name}: **${formatTime(userDataOnServer.totalMinutesOnline)}**.\n`;

		let totalUptime = 0;
		userData.forEach(register => {
			totalUptime += register.totalMinutesOnline;
		});

		text += `Tempo total conectado nos servidores com UptimeBot: **${formatTime(totalUptime)}**.`;

		msg.reply(text);
		return;
	} catch (e) {
		console.log(e);
	}
};

export { usersUptime };
