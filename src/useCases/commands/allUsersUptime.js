import { getAllUsers } from '../../repository/uptimeRepository.js';
import { formatTime } from '../../utils/dateTimeUtils.js';

const allUsersUptime = async (msg) => {
	try {
		const allUsers = await getAllUsers();

		let text = "Tempo dos usuários que utilizam o UptimeBot:\n";

		allUsers.forEach((u, index) => {
			const formattedTime = formatTime(u.totalMinutesOnline);
			text += `${index + 1}° - ${u.userName} - ${formattedTime}${u.serverName ? ` - ${u.serverName} ` : ""}.\n`;
		});

		msg.reply(text);

		return;
	} catch (e) {
		console.log(e);
		msg.reply("Ocorreu um erro ao obter a lista dos usuários.");
	}
};



export { allUsersUptime }