import { getAllUsers } from '../../repository/uptimeRepository.js';
import { formatTime } from '../../utils/dateTimeUtils.js';

const allUsersUptime = async (msg) => {
	try {
		const allUsers = await getAllUsers();

		let text = "Top 10 usuários que mais utilizam UptimeBot:\n";

		let groupedData = allUsers.reduce((acc, obj) => {
			let key = obj['user'];
			if (!acc[key]) {
				acc[key] = { ...obj }
			} else {
				acc[key].totalMinutesOnline += obj.totalMinutesOnline;
			}
			return acc;
		}, {});

		let result = Object.keys(groupedData).map(key => groupedData[key]);

		result.sort((a, b) => b.totalMinutesOnline - a.totalMinutesOnline);
		result = result.slice(0, 10);


		result.forEach((u, index) => {
			const formattedTime = formatTime(u.totalMinutesOnline);
			text += `${index + 1}° - ${u.userName} - **${formattedTime}**${u.serverName ? ` - ${u.serverName}` : ""}.\n`;
		});

		msg.reply(text);

		return;
	} catch (e) {
		console.log(e);
		msg.reply("Ocorreu um erro ao obter a lista dos usuários.");
	}
};



export { allUsersUptime }